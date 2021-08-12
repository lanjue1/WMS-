import prompt from '@/components/Prompt';
import {
  selectWarehouseBin,
  abledWarehouseBin,
  viewWarehouseBin,
  operateWarehouseBin,
  addBatch,
 
} from '@/services/basicData/warehouseBin';

export default {
  namespace: 'WarehouseBin',
  state: {
    warehouseBinList: {}, // list列表

    warehouseBinDetail: {},
   // archivesDetail: {},
    formValues: {},
    
  },
//Effect :Action 处理器，处理异步动作，基于 Redux-saga 实现。
  effects: {
    // 
    // 1、查询 货主信息列表 

    *selectWarehouseBin({ payload, callback }, { call, put }) {
      const response = yield call(selectWarehouseBin, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          warehouseBinList: {
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
    },
    // 2、查询详情 货主信息
    *viewWarehouseBin({ payload, callback }, { call, put }) {
      const response = yield call(viewWarehouseBin, payload);
      const { code, data } = response;
      if (code !== 0) return;
      let newData = data;
      
      yield put({
        type: 'detail',
        payload: { warehouseBinDetail: { [payload.id]: newData } },
      });
      callback && callback(newData);
    },


    // 3、启用|禁用 货主信息
    *abledWarehouseBin({ payload, callback }, { call }) {
      const response = yield call(abledWarehouseBin, payload);
      const { code, data, message } = response;
      const content = `${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(response);
    },

    // 4、新增 货主信息  操作：新增、编辑 archivesOperate
    *operateWarehouseBin({ payload, callback }, { call }) {
      const response = yield call(operateWarehouseBin, payload);
      const { code, data, message } = response;
      // const content = payload.id ? `编辑${message}` : `新增${message}`;
      if (code !== 0) return;
      prompt({ content:message });
      // if (payload.operateType == 'save') {
        
      // }
      callback && callback(data);
    },
    *addBatch({ payload, callback }, { call }){
      const response = yield call(addBatch, payload);
      const { code, data, message } = response;
      if (code !== 0) return;
      prompt({ content:message });
      callback && callback(data);
    },

    /**
     * 设置表单参数
     */
    *allValus({ payload }, { _, put }) {
      yield put({
        type: 'saveAllValus',
        payload,
      });
    },


    *selectFileList({ payload, callback }, { call }) {
      const response = yield call(selectFileList, payload);
      const { code, message, data } = response;
      if (code === 0) {
        if (callback) callback(data);
      }
    },
  },

  //Reducer 是 Action 处理器，用来处理同步操作，
  reducers: {
    //设置表单参数
    saveAllValus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    oilCard(state, { payload }) {
      return {
        ...state,
        oilCardList: payload.oilCardList,
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
