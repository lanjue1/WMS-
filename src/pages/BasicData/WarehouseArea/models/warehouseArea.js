import {
  warehouseAreaList,
  warehouseAreaOperate,
  warehouseAreaDetails,
  ableOperate,
} from '@/services/basicData/warehouseArea';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'warehouseArea',

  state: {
    warehouseAreaList: {},
    warehouseAreaDetails: {},
  },

  effects: {
    //仓库管理列表：
    *warehouseAreaList({ payload, callback }, { call, put }) {
      const response = yield call(warehouseAreaList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            warehouseAreaList: {
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
    *warehouseAreaOperate({ payload, callback }, { call }) {
      const response = yield call(warehouseAreaOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    //详情
    *warehouseAreaDetails({ payload, callback }, { call, put }) {
      const response = yield call(warehouseAreaDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            warehouseAreaDetails: { [payload.id]: response.data },
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
        warehouseAreaList: payload.warehouseAreaList,
      };
    },
    //详情数据
    detail(state, { payload }) {
      return {
        ...state,
        warehouseAreaDetails: { ...state.warehouseAreaDetails, ...payload.warehouseAreaDetails },
      };
    },
  },
};
