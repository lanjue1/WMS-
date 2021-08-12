import { sysConfigList, sysConfigAdd, sysConfigEdit, sysConfigDetails,reinitialize } from '@/services/sysConfig';
import { memberExpression } from '@babel/types';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'sysConfig',

  state: {
    sysConfigList: {},
    sysConfigDetails: {},
  },

  effects: {
    *sysConfigList({ payload, callback }, { call, put }) {
      const response = yield call(sysConfigList, payload);
      if (response.code === 0) {
        //easyMock
        // if (response.code) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            sysConfigList: {
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
    *SysConfigOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? sysConfigEdit : sysConfigAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *sysConfigDetails({ payload, callback }, { call, put }) {
      const response = yield call(sysConfigDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            sysConfigDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    *reinitialize({ payload, callback }, { call, put }){
      const response=yield call(reinitialize,payload)
      
      if(response.code!==0) return
      Prompt({content:response.message})
      callback&&callback(response)
    }
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        sysConfigList: payload.sysConfigList,
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        sysConfigDetails: { ...state.sysConfigDetails, ...payload.sysConfigDetails },
      };
    },
  },
};
