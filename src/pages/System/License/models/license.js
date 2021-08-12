import {
    selectCustomerTypes,
    selectimportExcel
  } from '@/services/system/license';
  import prompt from '@/components/Prompt';
  
  export default {
    namespace: 'license',
  
    state: {
      getCustomerList: {}, 
      formValues: {},
    },
  
    effects: {
        *selectCustomerTypes({ payload, callback }, { call, put }) {
            const response = yield call(selectCustomerTypes, payload);
            const { code, data } = response;
            if (code !== 0) return;
            yield put({
              type: 'detail',
              payload: { getCustomerList: data},
            });
            callback && callback(data);
          },

          *selectimportExcel({ payload, callback }, { call, put }) {
            const response = yield call(selectimportExcel, payload);
            const { code, data } = response;
            if (code !== 0) return;
          
            callback && callback(data);
          }, 

    //   *removeDynamicData({ payload, callback }, { call }) {
    //     const response = yield call(removeDynamicData, payload);
    //     const { code, data, message } = response;
    //     const content = `删除${message}`;
    //     if (code !== 0) return;
    //     prompt({ content });
    //     callback && callback(true);
    //   },
  
      /**
       * 设置表单参数
       */
      *allValus({ payload }, { _, put }) {
        yield put({
          type: 'saveAllValus',
          payload,
        });
      },
    },
  
    reducers: {
      //设置表单参数
      saveAllValus(state, { payload }) {
        return {
          ...state,
          ...payload,
        };
      },
      detail(state, { payload }) {
        let param = '';
        for (let k in payload) {
          param = k;
        }
        return {
          ...state,
          [param]: { ...state[param], ...payload[param] },
        };
      },
    },
  };
  