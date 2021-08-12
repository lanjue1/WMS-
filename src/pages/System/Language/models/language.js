import {
  languageList,
  countryOperate,
  countryDetails,
  ableOperate,
} from '@/services/system/language';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'Language',

  state: {
    countryList: {},
    countryDetails: {},
  },

  effects: {
    //国家管理列表：
    *countryList({ payload, callback }, { call, put }) {
      const response = yield call(languageList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            countryList: {
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
    *countryOperate({ payload, callback }, { call }) {
      const response = yield call(countryOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    //详情
    *countryDetails({ payload, callback }, { call, put }) {
      const response = yield call(countryDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            countryDetails: { [payload.id]: response.data },
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
        countryList: payload.countryList,
      };
    },
    //详情数据
    detail(state, { payload }) {
      return {
        ...state,
        countryDetails: { ...state.countryDetails, ...payload.countryDetails },
      };
    },
  },
};
