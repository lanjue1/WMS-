import {
  selectDetails,
  selectList,
  disabledCli,
  enableCli,
  cliAdd,
  cliEdit,
  selectListBinding,
  roleList,
  deleteTask,
} from '@/services/client';
import prompt from '@/components/Prompt';

export default {
  namespace: 'client',

  state: {
    selectList: {},
    selectDetails: {},
    roleList: {},
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
    *cliOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? cliEdit : cliAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        prompt({ content: message });
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
    *disabledCli({ payload, callback }, { call, put }) {
      const response = yield call(disabledCli, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *enableCli({ payload, callback }, { call, put }) {
      const response = yield call(enableCli, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *deleteTask({ payload, callback }, { call }) {
      const response = yield call(deleteTask, payload);
      const { code, message } = response;
      const content = `删除${message}`;
      callback && callback(true);
      if (code !== 0) return;
      Prompt({ content });
      callback && callback(true);
    },
  },

  reducers: {
    list(state, { payload }) {
      return {
        ...state,
        selectList: payload.selectList,
      };
    },
    listRole(state, { payload }) {
      return {
        ...state,
        roleList: payload.roleList,
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
