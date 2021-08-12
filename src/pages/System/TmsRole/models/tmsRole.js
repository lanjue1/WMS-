import {
  selectDetails,
  selectList,
  disabledRole,
  enableRole,
  roleAdd,
  roleEdit,
  selectListNoBinding,
  selectListBinding,
  addAuth,
  deleteAuth,
  authList,
  selectAllMenuList,
  selectRoleMenuList,
  selectFilterDetail,
  addUserRole,
  addFilter,
  ableStatus,
} from '@/services/tmsRole';
import prompt from '@/components/Prompt';

export default {
  namespace: 'tmsRole',

  state: {
    selectList: {},
    selectDetails: {},
    authList: {},
    selectAllMenuList: [],
    selectRoleMenuList: [],
    filterDetail: {},
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
    *roleOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? roleEdit : roleAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *ableStatus({ payload, callback }, { call }) {
      const response = yield call(ableStatus, payload);
      const message = response.message;
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *authOperate({ payload, callback }, { call }) {
      // const response = yield call(payload.type == 'remove' ? deleteAuth : addAuth, payload);
      const response = yield call(addAuth, payload);
      if (response.code === 0) {
        // prompt({ content: response.message });
        callback(response);
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
    *disabledRole({ payload, callback }, { call, put }) {
      const response = yield call(disabledRole, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *enableRole({ payload, callback }, { call, put }) {
      const response = yield call(enableRole, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *authList({ payload }, { call, put }) {
      const response = yield call(authList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'listAuth',
          payload: {
            authList: {
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
    *selectListBinding({ payload, callback }, { call, put }) {
      const response = yield call(selectListBinding, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'listBind',
          payload: {
            selectListBinding: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          },
        });
        callback(list);
      }
    },
    *selectListNoBinding({ payload }, { call, put }) {
      const response = yield call(selectListNoBinding, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'NoBinding',
          payload: {
            selectListNoBinding: {
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
    *selectRoleMenuList({ payload, callback }, { call, put }) {
      // console.log('callback888888', callback);
      const response = yield call(selectRoleMenuList, payload);
      if (response.code === 0) {
        yield put({
          type: 'menuRole',
          payload: {
            selectRoleMenuList: response.data,
          },
        });
        // console.log('callback============', callback);
        callback(response.data);
      }
    },
    *addUserRole({ payload, callback }, { call, put }) {
      const response = yield call(addUserRole, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *selectFilterDetail({ payload, callback }, { call, put }) {
      const response = yield call(selectFilterDetail, payload);
      if (response.code === 0) {
        yield put({
          type: 'filterDetail',
          payload: {
            filterDetail: response.data,
          },
        });
        callback(response.data);
      }
    },
    *addFilter({ payload, callback }, { call, put }) {
      const response = yield call(addFilter, payload);
      if (response.code === 0) {
        prompt({ content: `编辑过滤${response.message}` });
        callback(response.data);
      }
    },
  },

  reducers: {
    filterDetail(state, { payload }) {
      return {
        ...state,
        filterDetail: payload.filterDetail,
      };
    },
    cars(state, { payload }) {
      return {
        ...state,
        carList: payload.carList,
      };
    },
    list(state, { payload }) {
      return {
        ...state,
        selectList: payload.selectList,
      };
    },
    listAuth(state, { payload }) {
      return {
        ...state,
        authList: payload.authList,
      };
    },
    NoBinding(state, { payload }) {
      return {
        ...state,
        selectListNoBinding: payload.selectListNoBinding,
      };
    },
    listBind(state, { payload }) {
      return {
        ...state,
        selectListBinding: payload.selectListBinding,
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
    menuRole(state, { payload }) {
      return {
        ...state,
        selectRoleMenuList: [...state.selectRoleMenuList, ...payload.selectRoleMenuList],
      };
    },
  },
};
