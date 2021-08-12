import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import {
  fakeAccountLogin,
  getFakeCaptcha,
  fakeAccountLogout,
  checkLogin,
  ddLogin,
} from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    user: {},
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.code === 0) {
        callback && callback()
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            redirect = null;
          }
        }
        // yield put(routerRedux.replace(redirect || '/'));
        // window.location.reload(true);
        window.location.href = '/';
      }
    },

    // *ddLogin({ payload }, { call }) {
    //   const response = yield call(ddLogin, payload);
    //   const { data, code } = response;
    //   if (code === 0) {
    //     localStorage.setItem('token', data);
    //     reloadAuthorized();
    //     const urlParams = new URL(window.location.href);
    //     const params = getPageQuery();
    //     let { redirect } = params;
    //     if (redirect) {
    //       const redirectUrlParams = new URL(redirect);
    //       if (redirectUrlParams.origin === urlParams.origin) {
    //         redirect = redirect.substr(urlParams.origin.length);
    //         if (redirect.match(/^\/.*#/)) {
    //           redirect = redirect.substr(redirect.indexOf('#') + 1);
    //         }
    //       } else {
    //         redirect = null;
    //       }
    //     }
    //     yield put(routerRedux.replace(redirect || '/'));
    //   }
    // },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *checkLogin({ payload, callback }, { call, put }) {
      const response = yield call(checkLogin, payload);
      if (response.data) {
        yield put({
          type: 'saveUser',
          payload: {
            user: response.data,
          },
        });
      }
      callback(response);
    },

    *logout(_, { call, put }) {
      const response = yield call(fakeAccountLogout);

      if (response.code === 0) {
        // localStorage.clear();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('changeToken');
        localStorage.removeItem('openToken');
        localStorage.removeItem('menuList');
        localStorage.removeItem('language');

        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        // reloadAuthorized();
        // redirect
        if (window.location.pathname !== '/user/login') {
          yield put(
            routerRedux.replace({
              pathname: '/user/login',
              // search: stringify({
              //   redirect: window.location.href,
              // }),
            })
          );
        }
      }
    },
  },

  reducers: {
    saveUser(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);

      if (payload.code === 0) {
        localStorage.setItem('token', payload.data);
        // setAuthority('aa');
      }
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
