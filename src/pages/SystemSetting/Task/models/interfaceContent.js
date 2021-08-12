import { 
  interfaceContentList, 
  retryInterfaceContent, 
  interfaceContentDetails, 
  interfaceContentOperate,
  abledOperate, 
} from '@/services/interface/interface';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'interfaceContent',

  state: {
    interfaceContentList: {},
    interfaceContentDetails: {}
  },

  effects: {
    *interfaceContentList({ payload, callback }, { call, put }) {
      const response = yield call(interfaceContentList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            interfaceContentList: {
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
    *retryInterfaceContent({ payload, callback }, { call, put }) {
      const response = yield call(retryInterfaceContent, payload);
      const { code, data, message } = response;
      if (code === 0) {
        Prompt({ content: `${message}` });
        callback && callback(data);
      }
    },
    *interfaceContentDetails({ payload, callback }, { call, put }) {
      const response = yield call(interfaceContentDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            interfaceContentDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    *interfaceContentOperate({ payload, callback }, { call }) {
      const response = yield call(interfaceContentOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *abledOperate({ payload, callback }, { call }){
      const response = yield call(abledOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response);
      }
    }
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        interfaceContentList: payload.interfaceContentList,
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        interfaceContentDetails: { ...state.interfaceContentDetails, ...payload.interfaceContentDetails },
      };
    },
  },
};
