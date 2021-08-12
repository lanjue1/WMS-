import {
  ruleMenuList,
  ruleMenuOperate,
  ruleMenuDetails,
  deleteRuleMenu,
  ruleMenuConDetails,
  ruleMenuConOperate,
  deleteRuleMenuCon,
  operateRuleMenuCon,
  cancelRuleMenuCon,
  businessRules,
  dataSourceList,
  selectDebugList,
  debug,
} from '@/services/ruleMannage/businessRules';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'businessRules',

  state: {
    ruleMenuList: [],
    ruleMenuDetails: {},
    ruleMenuConDetails: {},
    dataSourceList: [],
    debuglist: {},
    jsonData: {},

  },

  effects: {
    //规则菜单表
    *ruleMenuList({ payload, callback }, { call, put }) {
      const response = yield call(ruleMenuList, payload);
      const { code, data } = response;
      if (code === 0) {
        yield put({
          type: 'show',
          payload: {
            ruleMenuList: data,
          },
        });
        callback && callback(data);
      }
    },
    *ruleMenuOperate({ payload, callback }, { call }) {
      const response = yield call(ruleMenuOperate, payload);
      const message = response.message;
      if (response.code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *ruleMenuDetails({ payload, callback }, { call, put }) {
      const response = yield call(ruleMenuDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            ruleMenuDetails: response.data,
          },
        });
        callback && callback(response.data);
      }
    },
    *deleteRuleMenu({ payload, callback }, { call }) {
      const response = yield call(deleteRuleMenu, payload);
      const { code, message } = response;
      if (code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    //二、规则菜单内容表
    *ruleMenuConOperate({ payload, callback }, { call }) {
      const response = yield call(ruleMenuConOperate, payload);
      const { code, message, data } = response;
      if (code === 0) {
        Prompt({ content: message });
        if (callback) callback(data);
      }
    },
    *ruleMenuConDetails({ payload, callback }, { call, put }) {
      const response = yield call(ruleMenuConDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveAllValus',
          payload: {
            // ruleMenuConDetails: { [payload.id]: response.data },
            ruleMenuConDetails: response.data,
          },
        });
        callback && callback(response.data);
      }
    },
    *deleteRuleMenuCon({ payload, callback }, { call }) {
      const response = yield call(deleteRuleMenuCon, payload);
      const { code, message } = response;
      if (code === 0) {
        Prompt({ content: message });
        if (callback) callback(response.data);
      }
    },
    *operateRuleMenuCon({ payload, callback }, { call }) {
      const response = yield call(operateRuleMenuCon, payload);
      const { code, message } = response;
      if (code === 0) {
        Prompt({ content: payload.type == 'release' ? `发布${message}` : `下线${message}` });
        if (callback) callback(response.data);
      }
    },
    *dataSourceList({ payload, callback }, { call, put }) {
      const response = yield call(dataSourceList, payload);
      const { code, data } = response;
      if (code === 0) {
        yield put({
          type: 'dataSource',
          payload: {
            dataSourceList: data,
          },
        });
        // callback && callback(data);
      }
    },
    *selectDebugList({ payload, callback }, { call, put }) {
      const response = yield call(selectDebugList, payload);
      const { code, data } = response;
      if (code === 0) {
        yield put({
          type: 'dataSource',
          payload: {
            debuglist: { list: data || [] },
          },
        });
        // callback && callback(data);
      }
    },
    *debug({ payload, callback }, { call }) {
      const response = yield call(debug, payload);
      const { code, message } = response;
      if (code === 0) {
        Prompt({ content: `调试${message}` });
        if (callback) callback(response.data);
      }
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
  },

  reducers: {
    //设置表单参数
    saveAllValus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    show(state, { payload }) {
      return {
        ...state,
        ruleMenuList: [payload.ruleMenuList],
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
    dataSource(state, { payload }) {
      return {
        ...state,
        dataSourceList: [...payload.dataSourceList],
      };
    },
  },
};
