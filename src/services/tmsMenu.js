import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

export async function selectList(params) {
  return request(`/server/api/mds-menu/selectMenuList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}
//菜单层级结构：
export async function selectFirstMenu(params) {
  return request(`/server/api/mds-menu/selectFirstMenu`, {
    method: 'POST',
    body: params,
  });
}

export async function selectDetails(params) {
  return request(`/server/api/mds-menu/viewDetails`, {
    method: 'POST',
    body: params,
  });
}

export async function menuAdd(params) {
  return request(`/server/api/mds-menu/addMenuInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function menuEdit(params) {
  return request(`/server/api/mds-menu/updateMenuInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function disabledMenu(params) {
  return request(
    `/server/api/mds-menu/disabledMenuInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function enableMenu(params) {
  return request(
    `/server/api/mds-menu/enableMenuInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function ableOperate(params) {
  const {type,...param}=params
  let url = ''
  switch (params.type) {
      case 'sync':
          url = 'mds-menu/syncMenu'
          break;
  }
  return request(`/server/api/${url}`, {
      method: 'POST',
      body: param,
  },
      true
  );
}
