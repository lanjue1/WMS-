import {
  selectDataPermList,
  selectDetails,
  saveSequence,
  enableDataAuthority,
} from '@/services/systemSetting/dataAuthority';
import prompt from '@/components/Prompt';

export default {
  namespace: 'dataAuthority',

  state: {
    dataList: {}, // 帐单列表
    dataDetail: {},
    dataAuthorityList: {},
  },

  effects: {
    /**
     * 查询列表
     */
    *selectDataPermList({ payload, callback }, { call, put }) {
      const response = yield call(selectDataPermList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          dataList: {
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
    /**
     * 查询详情---
     */
    *selectDetails({ payload, callback }, { call, put }) {
      const response = yield call(selectDetails, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type: 'saveDetail',
        payload: {
          dataDetail: { [payload.id]: data },
          dataAuthorityList: { [payload.id]: { list: data.dataFilterList || [] } },
        },
      });
      callback && callback(data);
    },
    *saveSequence({ payload, callback }, { call }) {
      const response = yield call(saveSequence, payload);
      const { code, data, message } = response;
      const content = `${payload.id ? '编辑' : '新增'}${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(data);
    },
    *enableDataAuthority({ payload, callback }, { call }) {
      const response = yield call(enableDataAuthority, payload);
      const { code, data, message } = response;
      const content = `${payload.enable ? '启用' : '禁用'}${message}`;
      if (code !== 0) return;
      prompt({ content });
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
  },

  reducers: {
    //设置表单参数
    saveAllValus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        dataDetail: { ...state.dataDetail, ...payload.dataDetail },
        dataAuthorityList: { ...state.dataAuthorityList, ...payload.dataAuthorityList },
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
