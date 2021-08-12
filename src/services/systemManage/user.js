import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

export async function selectList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds/mds-user/selectList`, {
    method: 'POST',
    body: params,
  });
}

export async function selectListBinding(params) {
  return request(`/server/api/mds/mds-user/viewRoleDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function selectListNoBinding(params) {
  return request(`/server/api/mds/mds-user/viewNoRoleDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function addUserRole(params) {
  return request(`/server/api/mds/mds-user/addUserRole`, {
    method: 'POST',
    body: params,
  });
}
export async function deleteUserRole(params) {
  return request(`/server/api/mds/mds-user/deleteUserRole`, {
    method: 'POST',
    body: params,
  });
}

export async function selectDetails(params) {
  return request(`/server/api/mds/mds-user/viewDetails`, {
    method: 'POST',
    body: params,
  });
}

export async function authAdd(params) {
  return request(`/server/api/mds/mds-user/addUserInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function authEdit(params) {
  return request(`/server/api/mds/mds-user/updateUserInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function disabledAuth(params) {
  return request(
    `/server/api/mds/mds-user/disabledUserInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function enableAuth(params) {
  return request(
    `/server/api/mds/mds-user/enableUserInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function roleList(params) {
  return request(`/server/api/mds/mds-user/roleList-s`, {
    method: 'POST',
    body: params,
  });
}
//重置密码：
export async function resetPasswd(params) {
  return request(`/server/api/mds/mds-user/resetPasswd`, {
    method: 'POST',
    body: params,
  });
}
