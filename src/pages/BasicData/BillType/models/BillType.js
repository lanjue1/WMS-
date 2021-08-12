import {
  billTypeList,
  billTypeOperate,
  billTypeDetails,
  ableOperate,
} from '@/services/basicData/billType';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'billType',

  state: {
    billTypeList: {},
    billTypeDetails: {},
  },

  effects: {
    //单据流水号列表：
    *billTypeList({ payload, callback }, { call, put }) {
      const response = yield call(billTypeList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            billTypeList: {
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
    //操作（新增/编辑）
    *billTypeOperate({ payload, callback }, { call }) {
      const response = yield call(billTypeOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    //详情
    *billTypeDetails({ payload, callback }, { call, put }) {
      const response = yield call(billTypeDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            billTypeDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    //启用禁用
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },

  },
  reducers: {
    //列表数据
    show(state, { payload }) {
      return {
        ...state,
        billTypeList: payload.billTypeList,
      };
    },
    //详情数据
    detail(state, { payload }) {
      return {
        ...state,
        billTypeDetails: { ...state.billTypeDetails, ...payload.billTypeDetails },
      };
    },
  },
};
