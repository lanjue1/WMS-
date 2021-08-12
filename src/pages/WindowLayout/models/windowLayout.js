import { querytReport } from '@/services/component';

export default {
    namespace: 'windowLayout',

    state: {
        windowLayoutReportList: {},
    },

    effects: {
        // 库存报表列表：
        *windowLayoutReportList({ payload, callback }, { call, put }) {
            const response = yield call(windowLayoutReportList, payload);
            if (response.code === 0) {
                const { list, pageSize, total, pageNum } = response.data;
                yield put({
                    type: 'show',
                    payload: {
                        windowLayoutReportList: {
                            pagination: {
                                current: pageNum,
                                pageSize,
                                total,
                            },
                            list
                        },
                    },
                });
                callback && callback(list);
            }
        },
        *exportFile({ payload, callback }, { call }) {
            yield call(exportFile, payload)
        }
    },
    reducers: {
        // 
        show(state, { payload }) {
            return {
                ...state,
                windowLayoutReportList: payload.windowLayoutReportList,
            };
        },
    },
};