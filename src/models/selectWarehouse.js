import { fetchUserWarehouseList, fetchAuthWarehouseList, fetchBindWarehouse, fetchSwitchWarehouse } from '@/services/selectWarehouse';
import Prompt from '@/components/Prompt';

export default {
    namespace: 'selectWarehouse',

    state: {
        list: [],
        warehouseList: {}
    },

    effects: {
        *fetchUserWarehouseList({ payload, callback }, { call, put }) {
            const response = yield call(fetchUserWarehouseList, payload);
            if (response.code === 0) {
                yield put({
                    type: 'save',
                    payload: response.data,
                });
                callback && callback(response.data)
            }
        },
        *fetchAuthWarehouseList({ payload, callback }, { call, put }) {
            const response = yield call(fetchAuthWarehouseList, payload);
            if (response.code === 0) {
                yield put({
                    type: 'show',
                    payload: {
                        warehouseList: {
                            list: response.data,
                        }
                    },
                });
                callback && callback(response.data)
            }
        },
        *fetchBindWarehouse({ payload, callback }, { call, put }) {
            const response = yield call(fetchBindWarehouse, payload);
            if (response.code === 0) {
                Prompt({ content: response.message });
                if (callback) callback();
            }
        },
        *fetchSwitchWarehouse({ payload, callback }, { call, put }) {
            const response = yield call(fetchSwitchWarehouse, payload);
            if (response.code === 0) {
                Prompt({ content: response.message });
                if (callback) callback();
            }
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        show(state, { payload }) {
            return {
                ...state,
                warehouseList: payload.warehouseList,
            };
        },
    },
};
