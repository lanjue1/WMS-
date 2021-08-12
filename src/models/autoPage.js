import { message } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import { getPageConfig, fetchList, getOperatePageConfig, saveFormData, updatePageUserConfig,downLoadFn } from '@/services/autoPage';
import router from 'umi/router';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'autoPage',
  state: {
    pageConfigData: {},
    pageList: {},
    operatePageConfigData: {},
    selectDetails: {},
    formList: [],
  },

  effects: {
    // 列表页配置信息
    *getPageConfig({ callback, payload }, { call, put }) {
      const response = yield call(getPageConfig, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveConfigData',
          payload: {
            pageConfigData: { [payload.id]: response.data }
          },
        });
      }
      callback && callback(response)
    },

    // 编辑页页面配置信息
    *getOperatePageConfig({ callback, payload }, { call, put }) {
      const response = yield call(getPageConfig, payload);
      
      if (response.code === 0) {
        yield put({
          type: 'saveOperateConfigData',
          payload: {
            operatePageConfigData: { [payload.id]: response.data }
          },
        });
      }
      callback && callback(response)
    },

    // 请求列表
    *fetchList({ payload, callback }, { call, put }) {
      const response = yield call(fetchList, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'savePageList',
          payload: {
            pageList: {
              [payload.id]: {
                pagination: {
                  current: pageNum,
                  pageSize,
                  total,
                },
                list
              }
            }
          }
        });

        callback && callback(response.data);
      }
    },

    // 通用操作
    *saveFormData({ callback, payload }, { call, put }) {
      const response = yield call(saveFormData, payload);
      if (response.code === 0) {
        Prompt({ content: response.message || 'success' });

        callback && callback(response);
      }
    },

    // 编辑页详情
    *selectDetails({ payload, callback }, { call, put }) {
      const response = yield call(saveFormData, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            selectDetails: { [payload.id]: response.data },
            // papersList: {
            //   [payload.id]: {
            //     list: response.data.papers,
            //   },
            // },
          },
        });
        callback(response.data);
      }
    },
    // 保存表头配置文件
    *updatePageUserConfig({ callback, payload }, { call, put }) {
      const response = yield call(updatePageUserConfig, payload);
      if (response.code === 0) {

        // yield put({
        //   type: 'saveConfigData',
        //   payload: {
        //     pageConfigData: { [payload.id]: response.data }
        //   },
        // });
      }
      callback && callback(response)
    },
    // 保存表格的configList
    *saveFormList({ payload }, { _, put }) {
      yield put({
        type: 'save',
        payload: {
          formList: payload.formList
        },
      });
    },

     // 下载文件操作
     *downLoadFn({ callback, payload }, { call, put }) {
       debugger
      const response = yield call(downLoadFn, payload);
      callback && callback(response);
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        selectDetails: { ...state.selectDetails, ...payload.selectDetails },
      };
    },
    saveOperateConfigData(state, { payload }) {
      return {
        ...state,
        operatePageConfigData: { ...state.operatePageConfigData, ...payload.operatePageConfigData },
      };
    },
    saveConfigData(state, { payload }) {
      return {
        ...state,
        pageConfigData: { ...state.pageConfigData, ...payload.pageConfigData },
      };
    },
    savePageList(state, { payload }) {
      return {
        ...state,
        pageList: { ...state.pageList, ...payload.pageList },
      };
    },
  },
};
