import {
  warehouseList,
  warehouseOperate,
  warehouseDetails,
  ableOperate,
} from '@/services/basicData/warehouse';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'warehouse',

  state: {
    warehouseList: {},
    warehouseDetails: {},
  },

  effects: {
    //仓库管理列表：
    *warehouseList({ payload, callback }, { call, put }) {
      const response = yield call(warehouseList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            warehouseList: {
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
    *warehouseOperate({ payload, callback }, { call }) {
      const response = yield call(warehouseOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    //详情
    *warehouseDetails({ payload, callback }, { call, put }) {
      const response = yield call(warehouseDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            warehouseDetails: { [payload.id]: response.data },
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
        warehouseList: payload.warehouseList,
      };
    },
    //详情数据
    detail(state, { payload }) {
      return {
        ...state,
        warehouseDetails: { ...state.warehouseDetails, ...payload.warehouseDetails },
      };
    },
  },
};
