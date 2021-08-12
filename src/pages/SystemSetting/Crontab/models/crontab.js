import { crontabList, crontabAdd, crontabEdit, deleteTask, crontabDetails, restateAll } from '@/services/system/crontab';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'crontab',

  state: {
    crontabList: {},
    crontabDetails: {},
  },

  effects: {
    *crontabList({ payload, callback }, { call, put }) {
      const response = yield call(crontabList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            crontabList: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          },
        });
        callback && callback(list);
      }
    },
    *crontabOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? crontabEdit : crontabAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *crontabDetails({ payload, callback }, { call, put }) {
      const response = yield call(crontabDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            crontabDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    *restateAll({ payload, callback }, { call }) {
      const response = yield call(restateAll, payload);
      const { code, message } = response;
      const content = `重启${message}`;
      if (code !== 0) return;
      Prompt({ content });
      callback && callback(true);
    },
    *deleteTask({ payload, callback }, { call }) {
      const response = yield call(deleteTask, payload);
      const { code, message } = response;
      const content = `删除${message}`;
      if (code !== 0) return;
      Prompt({ content });
      callback && callback(true);
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        crontabList: payload.crontabList,
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        crontabDetails: { ...state.crontabDetails, ...payload.crontabDetails },
      };
    },
  },
};
