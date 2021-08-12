import {
  DictListOfData,
  dictDataList,
  dictDataAdd,
  dictDataEdit,
  dictDataDetails,
  enableDictDataInfo,
  disabledDictDataInfo,
} from '@/services/dict';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'dictData',

  state: {
    DictListOfData: {},
    dictDataList: {},
    dictDataDetails: {},
  },

  effects: {
    //字典管理：
    *DictListOfData({ payload, callback }, { call, put }) {
      const response = yield call(DictListOfData, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            DictListOfData: {
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

    //字典数据管理
    *dictDataList({ payload, callback }, { call, put }) {
      const response = yield call(dictDataList, payload);
      if (response.code === 0) {
        yield put({
          type: 'showChange',
          payload: {
            dictDataList:response.data
          },
        });
        callback && callback(response.data);
      }
    },
    *dictDataOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? dictDataEdit : dictDataAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *dictDataDetails({ payload, callback }, { call, put }) {
      const response = yield call(dictDataDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detailChange',
          payload: {
            dictDataDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    *ableDictDataOperate({ payload, callback }, { call }) {
      const response = yield call(
        payload.type ? enableDictDataInfo : disabledDictDataInfo,
        payload
      );
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        DictListOfData: payload.DictListOfData,
      };
    },
    showChange(state, { payload }) {
      return {
        ...state,
        dictDataList: payload.dictDataList,
      };
    },
    detailChange(state, { payload }) {
      return {
        ...state,
        dictDataDetails: { ...state.dictDataDetails, ...payload.dictDataDetails },
      };
    },
  },
};
