import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl, transferLanguage } from '@/utils/utils';
import styles from './index.less';
import router from 'umi/router';
import IconFont from '@/components/IconFont';
import { connect } from 'dva';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string') {
    if (isUrl(icon)) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};

@connect(({ menu, i18n }) => ({ menuAuthority: menu.menuAuthority, language: i18n.language }))
export default class BaseMenu extends PureComponent {
  state = {
    mouseOver: ''
  }
  componentDidMount() {
    const { dispatch } = this.props;
    console.log('navigator.language', (navigator.language || navigator.browserLanguage).toLowerCase().slice(0, 2))
    let browserLanguage = (navigator.language || navigator.browserLanguage).toLowerCase().slice(0, 2)
    let projectLanguage = undefined;
    ['zh-CN', 'en-US', 'pt-BR'].map(item => {
      if (item.slice(0, 2) === browserLanguage) {
        projectLanguage = item
      }
    })
    !localStorage.getItem('language_type') && projectLanguage ? localStorage.setItem('language_type', projectLanguage) : undefined

    if (!localStorage.getItem('language') && localStorage.getItem('token')) {
      dispatch({
        type: 'i18n/fetch',
        payload: { type: localStorage.getItem('language_type') ? localStorage.getItem('language_type') : !projectLanguage ? 'en-US' : projectLanguage },
        callback: (res) => {
          localStorage.setItem('language', JSON.stringify(res));
        }
      });
    }
    // dispatch({
    //   type: 'login/checkLogin',
    //   callback: res => {
    //     if (res.code === 0) {
    //       localStorage.setItem('user', JSON.stringify(res.data));
    //       // dispatch({
    //       //   type: 'common/queryOwnCompany',
    //       // });
    //       // dispatch({
    //       //   type: 'menu/getMenuAuthority',
    //       // });
    //     } else {
    //       // localStorage.clear();
    //       localStorage.removeItem('token');
    //       localStorage.removeItem('user');
    //       localStorage.removeItem('changeToken');
    //       localStorage.removeItem('openToken');
    //       router.push('/user/login');
    //       localStorage.removeItem('menuList');

    //     }
    //   },
    // });
  }
  /**
   * 获得菜单子节点
   * @memberof 
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = (pathname) => {
    const { flatMenuKeys } = this.props;
    const flag = pathname.split('/').some(item => {
      return ['pageList', 'pageEdit'].indexOf(item) !== -1
    })
    const arrLength = pathname.split('/').length
    //  return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
    return flag ? pathname.split('/').slice(2, arrLength) : pathname.split('/').slice(1, arrLength)
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    const { menuAuthority, language } = this.props;

    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      // const index = menuAuthority.findIndex(v => v.code === item.code);
      // const index = menuAuthority.findIndex(v => v.code === item.children.code);
      // if (index === -1) {
      //   return;
      // }
      const newAuthority = [];
      item.children.filter(child => {
        // menuAuthority[index].menuBODetail.filter(menu => {
        //   if (child.code === menu.code) {
        newAuthority.push(child);
        //   }
        // });
      });
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{transferLanguage(name, language)}</span>
              </span>
            ) : (
              transferLanguage(name, language)
            )
          }
          key={item.id}
        >
          {this.getNavMenuItems(newAuthority)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.id}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof 
   */
  getMenuItemPath = item => {
    const { language } = this.props
    const { name, id, parentId } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{transferLanguage(name, language)}</span>
        </a >
      );
    }
    const { location, isMobile, onCollaps, setCurrentRouter, menuData, menuList } = this.props;
    const path = menuData.filter((i) => { return i.id === item.id }).length > 0 ?
      menuData.filter((i) => { return i.id === item.id })[0].path : undefined
    var pathUrl = '';
    //beCustom前端自定义页面(TRUE后端配置 FALSE前端配置)
    if (!item.beCustom) {
      pathUrl = path;
    } else {
      //pageType: "WINDOW" 报表预览
      if (item.pageType == "WINDOW") {
        pathUrl = `/windowLayout/${parentId}/${id}`;
      } else {
        pathUrl = `/pageList/${parentId}/${id}`;
      }

    }
    return (
      <Link
        to={pathUrl}
        target={target}
        replace={itemPath === location.pathname}
        onMouseOver={() => { this.setState({ mouseOver: id }) }}
        onClick={() => {
          setCurrentRouter(item);
          isMobile
            ? () => onCollapse(true)
            : undefined
        }
        }
      >
        {icon}
        <span>{transferLanguage(name, language)}</span>
        {
          this.state.mouseOver === id && < a className={styles.link} style={{ float: 'right', color: 'rgba(255, 255, 255, 0.65)' }} onClick={(e) => { e.stopPropagation(); }} href={!item.beCustom ? path : `${pathUrl}`} target="_blank" >
            <Icon style={{
              display: 'inline-block', mozTtransform: 'scaleX(-1)',
              webkitTransform: 'scaleX(-1)',
              oTransform: 'scaleX(-1)',
              transform: 'scaleX(-1)'
            }} type='select' />
          </a>
        }
      </Link >
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname, openKeys);
    // let selectedKeys = openKeys
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.indexOf('/') !== -1 ? [...selectedKeys] : openKeys,
      };
    }
    const { handleOpenChange, style, menuData, menuList } = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={cls}
        {...props}
      >
        {this.getNavMenuItems(menuList)}
      </Menu>
    );
  }
}
