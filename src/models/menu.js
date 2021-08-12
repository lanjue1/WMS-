import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
// import { getMenuAuthority } from '@/services/api';
import { getMenuList } from '@/services/systemManage/menu'
import { menu } from '../defaultSettings';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  if (!data) {
    return;
  }
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName && parentName !== '/') {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }
      // if enableMenuLocale use item.name,
      // close menu international
      const name = menu.disableLocal
        ? item.name
        : formatMessage({ id: locale, defaultMessage: item.name });
      const result = {
        ...item,
        name,
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

function formatterMenu(data) {
  if (!data) {
    return;
  }
  return data
    .map(item => {
      const result = {
        ...item,
      };
      if (item.children && item.children.length >= 1) {
        let children = []
        item.children.map(child => {
          if (child.itemList) {
            children = children.concat(child.itemList)
          } else {
            children.push(child)
          }
        })
        result.children = children;
      }
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    routerData: [],
    breadcrumbNameMap: {},
    menuAuthority: [],
  },

  effects: {
    *getMenuData({ payload }, { put }) {
      const { routes, authority, path } = payload;
      const originalMenuData = memoizeOneFormatter(routes, authority, path);
      const menuData = filterMenuData(originalMenuData);
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
      // console.log('breadcrumbNameMap?',menuData,breadcrumbNameMap)
      //menuData ：未隐藏的页面的route组成的数组,hideInMenu: false时的routes
      //breadcrumbNameMap:由各route中的path做key,对应的route做 value，组成的所有routes的对象，包含隐藏和不隐藏页面
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, routerData: routes },
      });
    },
    // *getMenuAuthority({ _ }, { call, put }) {
    //   const response = yield call(getMenuAuthority);
    //   if (response.code === 0) {
    //     yield put({
    //       type: 'menuAuthority',
    //       payload: { menuAuthority: response.data },
    //     });
    //   }
    // },
    *getMenuList({ callback }, { call, put }) {
      const response = yield call(getMenuList);
      if (response.code === 0) {
        yield put({
          type: 'save',
          payload: { menuList: formatterMenu(response.data), },
        });
       
        callback && callback(formatterMenu(response.data))
      }

    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    menuAuthority(state, action) {
      return {
        ...state,
        menuAuthority: action.payload.menuAuthority,
      };
    },
  },
};
