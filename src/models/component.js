import { queryComponentList, querytDictByCode, querytReport} from '@/services/component';

export default {
  namespace: 'component',

  state: {
    dictObject: {},
    ownCompany: [],
    searchValue: {},
    partsOfferDict: [],
    isRightDrawOpen: false,
    isRightDrawOtherOpen: false,
  },

  effects: {
    *queryComponentList({ payload, callback }, { call }) {
      const response = yield call(queryComponentList, payload);
      const { code, data } = response;
      const { list } = data;
      const callbackData = payload.params.flag === 'table' ? list : data;
      code === 0 && callback && callback(callbackData);
    },
    *querySearchValue({ payload, callback }, { call, put }) {
      const response = yield call(queryComponentList, payload);
      const { code, data } = response;
      const { list } = data;
      if (code !== 0) return;
      yield put({
        type: 'saveSearchValue',
        searchValue: { [Object.values(payload.params)[0]]: list || data },
      });
      callback && callback(data);
    },
    
    *queryPartsOfferDict({ payload, callback }, { call, put }) {
      const response = yield call(queryComponentList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type: 'savePartsOfferDict',
        payload: data,
      });
      callback && callback();
    },
    *querytDictByCode({ payload, callback }, { call, put }) {
      const response = yield call(querytDictByCode, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type: 'saveDictObject',
        dictObject: { [payload.code]: data },
      });
      callback && callback(data);
    },
    *setRightDrawValue({ payload }, { _, put }) {
      yield put({
        type: 'saveRightDrawValue',
        payload,
      });
    },
    *getBiReport({ payload, callback }, { call }){
      const response = yield call(querytReport, payload);
      const { code, data } = response;
      if (code === 0) {
        callback(data);
      }
    },
  },

  reducers: {
    saveOwnCompany(state, action) {
      return {
        ...state,
        ownCompany: action.payload,
      };
    },
    savePartsOfferDict(state, action) {
      return {
        ...state,
        partsOfferDict: action.payload,
      };
    },
    saveDictObject(state, payload) {
      return {
        ...state,
        dictObject: { ...state.dictObject, ...payload.dictObject },
      };
    },
    saveSearchValue(state, payload) {
      return {
        ...state,
        searchValue: { ...state.searchValue, ...payload.searchValue },
      };
    },
    saveRightDrawValue(state, payload) {
      return {
        ...state,
        ...payload.payload,
      };
    },
  },
};
