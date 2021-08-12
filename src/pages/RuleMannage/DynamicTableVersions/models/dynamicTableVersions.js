import {
  selectDynamicTableList,
  selectDynamicTableDetail,
  removeDynamicTable,
  dynamicTableOperate,
  selectTable,
  osDyData,
  requestRuleTableFieldList,
  operationTableData,
  delTableData,
  operationStatus,
  exportTableVersions,
  emptyTableData
} from '@/services/ruleMannage/dynamicTableVersions';
import prompt from '@/components/Prompt';

export default {
  namespace: 'dynamicTableVersions',

  state: {
    dynamicTableList: {}, // 帐单列表
    dynamicTableDetail: {},
    fieldList: {},
    formValues: {},
    dy_dataList: {},
    dy_fieldList: [],
    dy_queryItem: [],
  },

  effects: {
    //一、动态表
    // 1、动态表  列表
    *selectDynamicTableList({ payload, callback }, { call, put }) {
      const response = yield call(selectDynamicTableList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          dynamicTableList: {
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
    // 2、动态表  详情
    *selectDynamicTableDetail({ payload, callback }, { call, put }) {
      const response = yield call(selectDynamicTableDetail, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type: 'detail',
        payload: {
          dynamicTableDetail: { [payload.id]: data },
          //   fieldList: { [payload.id]: { list: data.fieldList || [] } },
        },
      });
      callback && callback(data);
    },

    *requestRuleTableFieldList({ payload, callback }, { call, put }) {
      const response = yield call(requestRuleTableFieldList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type: 'detail',
        payload: {
          //   dynamicTableDetail: { [payload.id]: data },
          fieldList: { [payload.tableName]: { list: data.list || [] } },
        },
      });
      callback && callback(data);
    },
    // 3、动态表 删除
    *removeDynamicTable({ payload, callback }, { call }) {
      const response = yield call(removeDynamicTable, payload);
      const { code, data, message } = response;
      const content = `删除${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(true);
    },

    // 4、动态表  操作：新增、编辑
    *dynamicTableOperate({ payload, callback }, { call }) {
      const response = yield call(dynamicTableOperate, payload);
      const { code, data, message } = response;
      const content = payload.id ? `编辑${message}` : `新增${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(data);
    },

    // 二  动态标数据
    // 1、动态表数据--列表
    *selectTable({ payload, callback }, { call, put }) {
      const response = yield call(selectTable, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const {
        dataPage: { list, pageSize, total, pageNum: current },
        fieldList,
        queryItem,
      } = data;
      yield put({
        type: 'detail',
        payload: {
            dy_dataList: {
              [payload.tableName]: {
                pagination: {
                  current,
                  pageSize,
                  total,
                },
                list,
              },
            },
          dy_fieldList: { [payload.tableName]: fieldList },
          dy_queryItem: { [payload.tableName]: queryItem },
        },
      });
      callback && callback(data);
    },
    *osDyData({ payload, callback }, { call }) {
      const response = yield call(osDyData, payload);
      const { code, data, message } = response;
      const content = `保存${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(true);
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
    *operationTableData({ payload, callback }, { call }) {
      const response = yield call(operationTableData, payload);
      const { code, data, message } = response;
      const content = `新增${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(true);
    },
    *delTableData({ payload, callback }, { call }) {
      const response = yield call(delTableData, payload);
      const { code, data, message } = response;
      const content = `删除${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(true);
    },
    *operationStatus({ payload, callback }, { call }) {
      const response = yield call(operationStatus, payload);
      const { code, data, message } = response;
      const content = payload.type === 'downLine' ? `下线${message}` : `上线${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(true);
    },
    *exportTableVersions({ payload, callback }, { call, put }){
      yield call(exportTableVersions, payload)
    },
    *emptyTableData({ payload, callback }, { call }) {
      const response = yield call(emptyTableData, payload);
      const { code, data, message } = response;
      const content = `清空${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(true);
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
      let obj = {};
      for (let k in payload) {
        obj[k] = { ...state[k], ...payload[k] };
      }
      return {
        ...state,
        ...obj,
      };
    },
  },
};
