import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

// export async function ddLogin(params) {
//   return request(`/server/api/login/ddLogin?code=${params.code}&state=${params.state}`);
// }

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}
//
export async function checkLogin(params) {
  return request('/server/api/login/checkLogin', {
    method: 'POST',
    body: params,
  });
}
//
export async function fakeAccountLogin(params) {
  return request('/server/api/login/login', {
    method: 'POST',
    body: params,
  });
}

export async function fakeAccountLogout() {
  return request('/server/api/login/logout', {
    method: 'POST',
    body: {},
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// export async function getMenuAuthority() {
//   return request('/server/api/mds/mds-menu/selectList', {
//     method: 'POST',
//     body: {},
//   });
// }
