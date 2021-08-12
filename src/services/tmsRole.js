import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

export async function selectList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds-role/selectList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
    
  });
}
export async function selectListAll(params) {
  return request(`/server/api/mds-user/selectList`, {
    method: 'POST',
    body: params,
  });
}

export async function selectDetails(params) {
  return request(`/server/api/mds-role/viewDetails`, {
    method: 'POST',
    body: params,
  });
}

export async function roleAdd(params) {
  return request(`/server/api/mds-role/addRoleInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function roleEdit(params) {
  return request(`/server/api/mds-role/updateRoleInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function disabledRole(params) {
  return request(
    `/server/api/mds-role/disabledRoleInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function enableRole(params) {
  return request(
    `/server/api/mds-role/enableRoleInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function selectListBinding(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request(`/server/api/mds-role/viewUserDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function selectListNoBinding(params) {
  return request(`/server/api/mds-role/viewNoUserDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function addAuth(params) {
  return request(`/server/api/mds-role/addRoleUser`, {
    method: 'POST',
    body: params,
  });
}
export async function deleteAuth(params) {
  return request(`/server/api/mds-role/deleteRoleUser`, {
    method: 'POST',
    body: params,
  });
}
export async function authList(params) {
  return request(`/server/api/mds-user/selectList`, {
    method: 'POST',
    body: params,
  });
}
export async function selectAllMenuList(params) {
  return request(`/server/api/mds-menu/selectAllMenuList`, {
    method: 'POST',
    body: params,
  });
}
export async function selectRoleMenuList(params) {
  return request(`/server/api/mds-role/selectRoleMenuList`, {
    method: 'POST',
    body: params,
  });
}

export async function addUserRole(params) {
  return request(`/server/api/mds-role/addRoleMenu`, {
    method: 'POST',
    body: params,
  });
}

export async function selectFilterDetail(params) {
  return request(`/server/api/mds-role-menu/viewDataPerm`, {
    method: 'POST',
    body: params,
  });
}

export async function addFilter(params) {
  return request(`/server/api/mds-role-menu/settingDataPerm`, {
    method: 'POST',
    body: params,
  });
}
export async function ableStatus(params){
  const {type,...param}=params
  let url=''
  switch(type){
    case 'refreash':
      url='mds-role/refreshPermissions'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}
