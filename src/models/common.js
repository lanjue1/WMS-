import {
  
  querytDictByCode,
  selectAreaById,
  viewAreaById,
  selectOrgById,
  querySelectSearch,
  globalExportFn
} from '@/services/common';

export default {
  namespace: 'common',

  state: {
    ownCompany: [],
    dictObject: {},
    spin: false,
    selectAreaById: [],
    viewAreaById: {},
    tabsName: {},
    isReplaceTab: false,
    searchData: {},
    selectData: [],
    menuList: [],
    selectedMenuList: [],
    panes: [],
  },

  effects: {
    *setPanes({ payload, callback }, { call, put }) {
      yield put({
        type: 'paneName',
        panes: payload.panes,
      });
      if (callback) callback(true);
    },
   
    *querytDictByCode({ payload, callback }, { call, put }) {
      const response = yield call(querytDictByCode, payload);
      const { code, data } = response;
      if (code === 0) {
        yield put({
          type: 'dictObject',
          dictObject: { [payload.code]: data },
        });
        callback && callback(data);
      }
    },
    *selectAreaById({ payload, callback }, { call, put }) {
      const response = yield call(selectAreaById, payload);
      const { code, data } = response;
      if (code === 0) {
        yield put({
          type: 'areaById',
          selectAreaById: data,
        });
        callback(response);
      }
    },
    *selectOrgById({ payload, callback }, { call, put }) {
      const response = yield call(selectOrgById, payload);
      const { code, data } = response;
      if (code === 0) {
        // yield put({
        //   type: 'areaById',
        //   selectAreaById: data,
        // });
        callback(data);
      }
    },
    *viewAreaById({ payload, callback }, { call, put }) {
      const response = yield call(viewAreaById, payload);
      const { code, data } = response;
      if (code === 0) {
        yield put({
          type: 'areaView',
          viewAreaById: data,
        });
        callback(response);
      }
    },
    *spin({ payload }, { call, put }) {
      yield put({
        type: 'spinning',
        spin: payload,
      });
    },
    *setTabsName({ payload, callback }, { call, put }) {
      console.log('setTabsName---',payload)
      if (payload.id) {
        yield put({
          type: 'tabsName',
          tabsName: { [payload.id]: payload.name },
        });
      }
      if (payload.isReplaceTab !== undefined) {
        yield put({
          type: 'isReplaceTab',
          isReplaceTab: payload.isReplaceTab,
        });
      }

      if (callback) callback(true);
    },
    *querySelectSearch({ payload, callback }, { call, put }) {
      const response = yield call(querySelectSearch, payload);
      const { code, data } = response;
      if (code === 0) {
        if (callback) callback(data);
      }
    },
    *querySelectData({ payload, callback }, { call, put }) {
      const response = yield call(querySelectSearch, payload);
      if (response.code === 0) {
        let selectData = [];
        if (payload.params.code) {
          selectData = { [payload.params.code]: response.data };
        } else {
          selectData = { company: response.data };
        }
        yield put({
          type: 'saveSelectData',
          selectData,
        });
        if (callback) callback(response);
      }
    },
    *querySearchData({ payload, callback }, { call, put }) {
      const response = yield call(querySelectSearch, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        if (list) {
          yield put({
            type: 'saveSearchData',
            searchData: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          });
        } else {
          yield put({
            type: 'saveSearchData',
            searchData: {
              pagination: {},
              list: response.data,
            },
          });
        }

        if (callback) callback(response.data);
      }
    },
    *selectMenuList({ payload, callback }, { call, put }) {
      const response = yield call(querySelectSearch, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveMenuList',
          menuList: response.data,
        });
        callback(response.data);
      }
    },
    *selectSelectedMenuList({ payload, callback }, { call, put }) {
      const response = yield call(querySelectSearch, payload);
      if (response.code === 0) {
        yield put({
          type: 'saveSelectedMenuList',
          selectedMenuList: response.data,
        });
        callback(response.data);
      }
    },
    *selectReginList({ payload, callback }, { call, put }) {
      const response = yield call(querySelectSearch, payload);
      const { code, data } = response;
      if (code !== 0) return;
      callback(data);
    },
    *globalExportFn({ payload, callback }, { call, put }) {
      yield call(globalExportFn, payload)
    },
  },

  reducers: {
    saveSelectedMenuList(state, payload) {
      return {
        ...state,
        selectedMenuList: payload.selectedMenuList,
      };
    },
    saveMenuList(state, payload) {
      return {
        ...state,
        menuList: payload.menuList,
      };
    },
    saveSearchData(state, payload) {
      return {
        ...state,
        searchData: payload.searchData,
      };
    },
    saveSelectData(state, payload) {
      return {
        ...state,
        selectData: { ...state.selectData, ...payload.selectData },
      };
    },
    paneName(state, payload) {
      return {
        ...state,
        panes: payload.panes,
      };
    },
    tabsName(state, payload) {
      return {
        ...state,
        tabsName: payload.tabsName,
      };
    },
    isReplaceTab(state, payload) {
      return {
        ...state,
        isReplaceTab: payload.isReplaceTab,
      };
    },
    spin(state, payload) {
      return {
        ...state,
        spin: payload === true || payload === false ? payload : payload.payload,
      };
    },
    ownCompany(state, action) {
      return {
        ...state,
        ownCompany: action.payload,
      };
    },
    dictObject(state, payload) {
      return {
        ...state,
        dictObject: { ...state.dictObject, ...payload.dictObject },
      };
    },
    areaById(state, payload) {
      return {
        ...state,
        selectAreaById: [...state.selectAreaById, ...payload.selectAreaById],
      };
    },
    areaView(state, payload) {
      return {
        ...state,
        viewAreaById: { ...state.viewAreaById, ...payload.viewAreaById },
      };
    },
  },
};
