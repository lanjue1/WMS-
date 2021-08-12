import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function updatePasswd(params) {
  return request(
    `/server/api/mds/mds-user/updatePasswd`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function forgetPasswd(params) {
  return request(
    `/server/api/mds/mds-user/forgetPasswd`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
