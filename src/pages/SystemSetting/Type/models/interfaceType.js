import {
  interfaceTypeList,
  interfaceTypeOperate,
  interfaceTypeDetails,
  ableOperate,
  eventReceiverOperate,
  eventReceiverDelete,
  selectRequestTypeList,
} from '@/services/interface/interface';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'interfaceType',

  state: {
    interfaceTypeList: {},
    interfaceTypeDetails: {},
    dictDataDetails: {},
    eventReceiverList: [],
    releaseRule: [],
  },

  effects: {
    //一、接口业务类型管理：
    *interfaceTypeList({ payload, callback }, { call, put }) {
      const response = yield call(interfaceTypeList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            interfaceTypeList: {
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
    *interfaceTypeOperate({ payload, callback }, { call }) {
      const response = yield call(interfaceTypeOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *interfaceTypeDetails({ payload, callback }, { call, put }) {
      const response = yield call(interfaceTypeDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            interfaceTypeDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },
   
    
    //请求类型列表
    *selectRequestTypeList({ payload, callback }, { call }) {
      const response = yield call(selectRequestTypeList, payload);
      const { code, message } = response;
      if (code === 0) {
        if (callback) callback(response.data);
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        interfaceTypeList: payload.interfaceTypeList,
      };
    },
    ReceiverList(state, { payload }) {
      return {
        ...state,
        eventReceiverList: payload.eventReceiverList,
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        interfaceTypeDetails: { ...state.interfaceTypeDetails, ...payload.interfaceTypeDetails },
      };
    },
  },
};
