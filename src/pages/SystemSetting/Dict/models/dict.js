import {
  DictList,
  dictAdd,
  dictEdit,
  dictDetails,
  disabledDictInfo,
  enableDictInfo,
  dictDataList,
  dictDataAdd,
  dictDataEdit,
  dictDataDetails,
  enableDictDataInfo,
  disabledDictDataInfo,
} from '@/services/dict';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'Dict',

  state: {
    DictList: {},
    dictDataList: {},
    dictDetails: {},
    dictDataDetails: {},
  },

  effects: {
    //字典管理：
    *DictList({ payload, callback }, { call, put }) {
      const response = yield call(DictList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            DictList: {
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
    *DictOperate({ payload, callback }, { call }) {
      const response = yield call(payload.id ? dictEdit : dictAdd, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *dictDetails({ payload, callback }, { call, put }) {
      const response = yield call(dictDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detailETC',
          payload: {
            dictDetails: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    *ableDictOperate({ payload, callback }, { call }) {
      const response = yield call(payload.type ? enableDictInfo : disabledDictInfo, payload);
      if (response.code === 0) {
        Prompt({ content: response.message });
        callback(response);
      }
    },

    //字典数据管理
    *dictDataList({ payload }, { call, put }) {
      const response = yield call(dictDataList, payload);
      if (response.code === 0) {
        // const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'showChange',
          payload: {
            dictDataList: response.data
          },
        });
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
        DictList: payload.DictList,
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
    detailETC(state, { payload }) {
      return {
        ...state,
        dictDetails: { ...state.dictDetails, ...payload.dictDetails },
      };
    },
  },
};
