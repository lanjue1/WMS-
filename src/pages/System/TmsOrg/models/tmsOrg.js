import {
  selectDetails,
  selectList,
  orgAdd,
  orgEdit,
  disabledOrg,
  enableOrg,
} from '@/services/tmsOrg';
import prompt from '@/components/Prompt';

export default {
  namespace: 'tmsOrg',
  state: {
    selectList: {},
    selectDetails: {},
  },

  effects: {
    *selectList({ payload, callback }, { call, put }) {
      const response = yield call(selectList, payload);
      if (response.code === 0) {
        // const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'list',
          payload: {
            // selectList: {
            //   pagination: {
            //     current: pageNum,
            //     pageSize,
            //     total,
            //   },
            //   list,
            // },
            selectList: response,
          },
        });
        callback && callback(response.data);
      }
    },
    *orgOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? orgEdit : orgAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        callback(response);
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
    *disabledOrg({ payload, callback }, { call, put }) {
      const response = yield call(disabledOrg, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    *enableOrg({ payload, callback }, { call, put }) {
      const response = yield call(enableOrg, payload);
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
    detail(state, { payload }) {
      return {
        ...state,
        selectDetails: { ...state.selectDetails, ...payload.selectDetails },
      };
    },
  },
};
