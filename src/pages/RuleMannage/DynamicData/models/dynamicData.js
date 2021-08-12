import {
  selectDynamicDataList,
  selectDynamicDataDetail,
  removeDynamicData,
  dynamicDataOperate,
} from '@/services/ruleMannage/dynamicData';
import prompt from '@/components/Prompt';

export default {
  namespace: 'dynamicData',

  state: {
    dynamicDataList: {}, // 帐单列表
    dynamicDataDetail: {},
    formValues: {},
  },

  effects: {
    // 1、动态数据源  列表
    *selectDynamicDataList({ payload, callback }, { call, put }) {
      const response = yield call(selectDynamicDataList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          dynamicDataList: {
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
    // 2、动态数据源  详情
    *selectDynamicDataDetail({ payload, callback }, { call, put }) {
      const response = yield call(selectDynamicDataDetail, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type: 'detail',
        payload: { dynamicDataDetail: { [payload.id]: data } },
      });
      callback && callback(data);
    },
    // 3、动态数据源 删除
    *removeDynamicData({ payload, callback }, { call }) {
      const response = yield call(removeDynamicData, payload);
      const { code, data, message } = response;
      const content = `删除${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(true);
    },

    // 4、动态数据源  操作：新增、编辑
    *dynamicDataOperate({ payload, callback }, { call }) {
      const response = yield call(dynamicDataOperate, payload);
      const { code, data, message } = response;
      const content = payload.id ? `编辑${message}` : `新增${message}`;
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
