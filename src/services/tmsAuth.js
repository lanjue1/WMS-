import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

export async function selectList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds-user/selectList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

export async function selectListBinding(params) {
  return request(`/server/api/mds-user/viewRoleDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function selectListNoBinding(params) {
  return request(`/server/api/mds-user/viewNoRoleDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function addUserRole(params) {
  return request(`/server/api/mds-user/addUserRole`, {
    method: 'POST',
    body: params,
  });
}
export async function deleteUserRole(params) {
  return request(`/server/api/mds-user/deleteUserRole`, {
    method: 'POST',
    body: params,
  });
}

export async function selectDetails(params) {
  return request(`/server/api/mds-user/viewDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function clientList(params) {
  return request(`/server/api/customer-user-relation/selectUserCustomerList`, {
    method: 'POST',
    body: params,
  });
}

export async function abledStatus(params) {
  const {type,...param}=params
  let url=''
  switch(type){
    case 'relationUser':
      url='customer-user-relation/relationUserCustomer'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: param,
  });
}
export async function authAdd(params) {
  return request(`/server/api/mds-user/addUserInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function authEdit(params) {
  return request(`/server/api/mds-user/updateUserInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function disabledAuth(params) {
  return request(
    `/server/api/mds-user/disabledUserInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function enableAuth(params) {
  return request(
    `/server/api/mds-user/enableUserInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function roleList(params) {
  return request(`/server/api/mds-role/selectList`, {
    method: 'POST',
    body: params,
  });
}
//重置密码：
export async function resetPasswd(params) {
  return request(`/server/api/mds-user/resetPasswd`, {
    method: 'POST',
    body: params,
  });
}


