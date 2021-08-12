import {
  selectDetails,
  selectList,
  clientList,
  disabledAuth,
  enableAuth,
  authAdd,
  authEdit,
  selectListNoBinding,
  selectListBinding,
  addUserRole,
  deleteUserRole,
  roleList,
  resetPasswd,
  abledStatus,
} from '@/services/tmsAuth';
import prompt from '@/components/Prompt';

export default {
  namespace: 'tmsAuth',

  state: {
    selectList: {},
    selectDetails: {},
    selectListNoBinding: {},
    selectListBinding: {},
    roleList: {},
    clientList: {},
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
    *clientList({ payload }, { call, put }) {
      const response = yield call(clientList, payload);
      if (response.code === 0) {

        yield put({
          type: 'show',
          payload: {
            clientList: {
              list: response.data
            },
          },
        });
      }
    },
    *abledStatus({ payload, callback }, { call, put }) {
      const response = yield call(abledStatus, payload);
      if (response.code == 0) {
        prompt({ content: response.message });
      }
      callback &&callback(response);
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

    *roleList({ payload }, { call, put }) {
      const response = yield call(roleList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'listRole',
          payload: {
            roleList: {
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
    *authOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? authEdit : authAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        prompt({ content: message });
        callback(response);
      }
    },
    *roleOperate({ payload, callback }, { call }) {
      // const response = yield call(payload.type == 'remove' ? deleteUserRole : addUserRole, payload);
      const response = yield call(addUserRole, payload);
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
    *disabledAuth({ payload, callback }, { call, put }) {
      const response = yield call(disabledAuth, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *enableAuth({ payload, callback }, { call, put }) {
      const response = yield call(enableAuth, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *resetPasswd({ payload, callback }, { call, put }) {
      const response = yield call(resetPasswd, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
  },

  reducers: {
    list(state, { payload }) {
      return {
        ...state,
        selectList: payload.selectList,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        clientList: payload.clientList,
      };
    },
    listRole(state, { payload }) {
      return {
        ...state,
        roleList: payload.roleList,
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
  },
};
