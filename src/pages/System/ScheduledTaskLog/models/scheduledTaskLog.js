import { scheduledTaskLogList } from '@/services/system/scheduledTaskLog';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'scheduledTaskLog',

  state: {
    scheduledTaskLogList: {},
  },

  effects: {
    *scheduledTaskLogList({ payload, callback }, { call, put }) {
      const response = yield call(scheduledTaskLogList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            scheduledTaskLogList: {
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
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        scheduledTaskLogList: payload.scheduledTaskLogList,
      };
    },
  },
};
