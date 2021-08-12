import request from '@/utils/request';
import { getPageSize } from '@/utils/common';


/**
 * 查询 货主信息列表 wms-contact-unit/selectWmsContactUnitList
 * @param params
 */
export async function selectContactUnit(params) {
params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-contact-unit/selectWmsContactUnitList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 启用|禁用 货主信息 禁用：/wms-contact-unit/disabledWmsContactUnit
 * @param params
 */
export async function abledContactUnit(params) {
  const { type, ids } = params;
  const url =
    type === 'disabled'
      ? '/server/api/wms-contact-unit/disabledWmsContactUnit'
      : '/server/api/wms-contact-unit/enableWmsContactUnit';
  return request(url, {
    method: 'POST',
    body: {
      ids,
    },
  });
}

/**
 * 查询详情 货主信息 /wms-contact-unit/viewWmsContactUnitDetails
 * @param params
 */
export async function viewContactUnit(params) {
  return request('/server/api/wms-contact-unit/viewWmsContactUnitDetails', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 新增、修改  货主信息 /wms-contact-unit/insertWmsContactUnit
 * @param params
 */
export async function operateContactUnit(params) {
  let url= params.id ? 'updateWmsContactUnit' : 'insertWmsContactUnit';
  return request(`/server/api/wms-contact-unit/${url}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


