import { fetchLanguage } from '@/services/i18n';
import language from '@/locales/i18n'

export default {
    namespace: 'i18n',

    state: {
        language: localStorage.getItem('language') ? JSON.parse(localStorage.getItem('language')) : {},
    },
    effects: {
        *fetch({ payload, callback }, { call, put }) {
            const response = yield call(fetchLanguage, payload);
            if (response.code === 0) {
                yield put({
                    type: 'save',
                    payload: {},
                    payload: response.data,
                });
                callback && callback(response.data)
            }
        },
    },

    reducers: {
        save(state, action) {
            return {
                ...state,
                language: action.payload,
            };
        },
    },
};
