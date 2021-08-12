import {
  selectDetails,
  selectList,
  menuAdd,
  menuEdit,
  disabledMenu,
  enableMenu,
  selectFirstMenu,
  ableOperate,
} from '@/services/tmsMenu';
import { selectAllMenuList } from '@/services/tmsRole';
import prompt from '@/components/Prompt';

export default {
  namespace: 'tmsMenu',
  state: {
    selectList: {},
    selectDetails: {},
    selectAllMenuList: [],
  },

  effects: {
    *selectList({ payload }, { call, put }) {
      const response = yield call(selectList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'list',
          payload: {
            selectList: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          },
        });
      }
    },
    *selectFirstMenu({ payload, callback }, { call, put }) {
      const response = yield call(selectFirstMenu, payload);
      if (response.code === 0) {
        callback && callback(response.data);
      }
    },
    *selectAllMenuList({ payload, callback }, { call, put }) {
      const response = yield call(selectAllMenuList, payload);
      if (response.code === 0) {
        yield put({
          type: 'menuList',
          payload: {
            selectAllMenuList: response.data,
          },
        });
        callback(response.data);
      }
    },
    *menuOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? menuEdit : menuAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        callback(response.data);
        prompt({ content: message });
      }
    },
    *selectDetails({ payload, callback }, { call, put }) {
      const response = yield call(selectDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            selectDetails: { [payload.id]: response.data },
          },
        });
        if (callback) callback(response.data);
      }
    },
    *disabledMenu({ payload, callback }, { call, put }) {
      const response = yield call(disabledMenu, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *enableMenu({ payload, callback }, { call, put }) {
      const response = yield call(enableMenu, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code !== 0) return
      Prompt({ content: response.message });
      callback && callback(response);
    },
  },

  reducers: {
    list(state, { payload }) {
      return {
        ...state,
        selectList: payload.selectList,
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        selectDetails: { ...state.selectDetails, ...payload.selectDetails },
      };
    },
    menuList(state, { payload }) {
      return {
        ...state,
        selectAllMenuList: [...state.selectAllMenuList, ...payload.selectAllMenuList],
      };
    },
  },
};
