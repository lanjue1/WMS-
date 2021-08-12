import {
  goodsList,
  goodsOperate,
  goodsDetails,
  ableOperate,
} from '@/services/basicData/goods';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'goods',

  state: {
    goodsList: {},
    goodsDetails: {},
  },

  effects: {
    //仓库管理列表：
    *goodsList({ payload, callback }, { call, put }) {
      const response = yield call(goodsList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            goodsList: {
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
    *goodsOperate({ payload, callback }, { call }) {
      const response = yield call(goodsOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    //详情
    *goodsDetails({ payload, callback }, { call, put }) {
      const response = yield call(goodsDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            goodsDetails: { [payload.id]: response.data },
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
        goodsList: payload.goodsList,
      };
    },
    //详情数据
    detail(state, { payload }) {
      return {
        ...state,
        goodsDetails: { ...state.goodsDetails, ...payload.goodsDetails },
      };
    },
  },
};
