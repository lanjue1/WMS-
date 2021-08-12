import {
  carList,
  selectDetails,
  vehicleOperate,
  paperOperate,
  selectPapersDetails,
  selectDictByCode,
  ableVehicle,
  selectListDriver,
  vehicleDriverList,
  vehicleDriverOperate,
  vehicleDriverDetails,
  deleteVehicleDriver,
} from '@/services/demo';
import { memberExpression } from '@babel/types';
import prompt from '@/components/Prompt';

export default {
  namespace: 'demo',

  state: {
    carList: {},
    selectDetails: {},
    papersList: {},
    driverList: {},
    detailsPaper: {},
    vehicleDriverList: {},
    detailsDriver: {},
    formValues: {},
  },

  effects: {
    // 一、车辆管理
    // 1、车辆--列表
    *carList({ payload, callback }, { call, put }) {
      const response = yield call(carList, payload);

      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'show',
          payload: {
            carList: {
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
    // 2、车辆--详情
    *selectDetails({ payload, callback }, { call, put }) {
      const response = yield call(selectDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {
            selectDetails: { [payload.id]: response.data },
            papersList: {
              [payload.id]: {
                list: response.data.papers,
              },
            },
          },
        });
        callback(response.data);
      }
    },
    // 3、车辆--新增、编辑
    *vehicleOperate({ payload, callback }, { call, put }) {
      const response = yield call(vehicleOperate, payload);
      const message = payload.id ? `编辑${response.message}` : `新增${response.message}`;
      if (response.code === 0) {
        prompt({ content: message });
        callback && callback(response.data);
      }
    },
    // 4、车辆--启用、禁用
    *ableVehicle({ payload, callback }, { call, put }) {
      const response = yield call(ableVehicle, payload);
      const message = payload.type ? `启用${response.message}` : `禁用${response.message}`;
      if (response.code === 0) {
        prompt({ content: message });
        callback && callback();
      }
    },

    //二、车辆--证件信息
    // 1、车辆--证件--新增、编辑
    *paperOperate({ payload, callback }, { call, put }) {
      const response = yield call(paperOperate, payload);
      const message = payload.id ? `编辑${response.message}` : `新增${response.message}`;
      if (response.code === 0) {
        prompt({ content: message });
        callback && callback(response.data);
      }
    },
    // 2、车辆--证件--详情
    *selectPapersDetails({ payload, callback }, { call, put }) {
      const response = yield call(selectPapersDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'papersDetails',
          payload: {
            detailsPaper: response.data,
          },
        });
        callback && callback(response.data);
      }
    },

    //三、车辆--司机关系表：
    // 1、车辆--司机--列表
    *vehicleDriverList({ payload, callback }, { call, put }) {
      const response = yield call(vehicleDriverList, payload);

      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;
        yield put({
          type: 'driverShow',
          payload: {
            vehicleDriverList: {
              [payload.id]: {
                list,
                pagination: {
                  current: pageNum,
                  pageSize,
                  total,
                },
              },
            },
          },
        });
        callback && callback(list);
      }
    },
    // 2、车辆--司机--详情
    *vehicleDriverDetails({ payload, callback }, { call, put }) {
      const response = yield call(vehicleDriverDetails, payload);
      if (response.code === 0) {
        yield put({
          type: 'driverDetails',
          payload: {
            detailsDriver: { [payload.id]: response.data },
          },
        });
        callback && callback(response.data);
      }
    },
    // 3、车辆--司机--操作（新增、编辑）
    *vehicleDriverOperate({ payload, callback }, { call, put }) {
      const response = yield call(vehicleDriverOperate, payload);
      const message = payload.id ? `编辑${response.message}` : `新增${response.message}`;
      if (response.code === 0) {
        prompt({ content: message });
        callback && callback(response.data);
      }
    },
    // 4、车辆--司机--删除
    *deleteVehicleDriver({ payload, callback }, { call, put }) {
      const response = yield call(deleteVehicleDriver, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback && callback(response.data);
      }
    },

    // 司机列表
    *driverList({ payload }, { call, put }) {
      const response = yield call(selectListDriver, payload);
      if (response.code === 0) {
        const { list, pageSize, total, pageNum } = response.data;

        yield put({
          type: 'drivers',
          payload: {
            driverList: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          },
        });
      }
    },
    //字典
    *selectDictByCode({ payload, callback }, { call, put }) {
      const response = yield call(selectDictByCode, payload);
      callback(response);
    },
    //  * 设置表单参数
    *allValus({ payload }, { call, put }) {
      yield put({
        type: 'saveAllValus',
        payload,
      });
    },
  },

  reducers: {
    show(state, { payload }) {
      return {
        ...state,
        carList: payload.carList,
      };
    },
    driverShow(state, { payload }) {
      return {
        ...state,
        vehicleDriverList: payload.vehicleDriverList,
      };
    },
    drivers(state, { payload }) {
      return {
        ...state,
        driverList: payload.driverList,
      };
    },
    detail(state, { payload }) {
      return {
        ...state,
        selectDetails: { ...state.selectDetails, ...payload.selectDetails },
        papersList: { ...state.papersList, ...payload.papersList },
      };
    },
    papersDetails(state, { payload }) {
      return {
        ...state,
        detailsPaper: payload.detailsPaper,
      };
    },
    driverDetails(state, { payload }) {
      return {
        ...state,
        detailsDriver: { ...payload.detailsDriver },
      };
    },
    //设置表单参数
    saveAllValus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
