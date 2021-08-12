import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

export async function selectList(params) {
  return request(`/server/api/mds/mds-menu/selectMenuList`, {
    method: 'POST',
    body: params,
  });
}
//菜单层级结构：
export async function selectFirstMenu(params) {
  return request(`/server/api/mds/mds-menu/selectFirstMenu`, {
    method: 'POST',
    body: params,
  });
}

export async function selectDetails(params) {
  return request(`/server/api/mds/mds-menu/viewDetails`, {
    method: 'POST',
    body: params,
  });
}

export async function menuAdd(params) {
  return request(`/server/api/mds/mds-menu/addMenuInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function menuEdit(params) {
  return request(`/server/api/mds/mds-menu/updateMenuInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function disabledMenu(params) {
  return request(
    `/server/api/mds/mds-menu/disabledMenuInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function enableMenu(params) {
  return request(
    `/mds/mds-menu/enableMenuInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// /server/api
export async function getMenuList(params) {
  return request(`/server/api/pageConfig/getMenuConfig`, {
    method: 'POST',
    body: params,
  });
}

