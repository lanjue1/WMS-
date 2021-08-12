import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 货主信息列表 /wms-forwarder/selectWmsForwarderList
 * @param params
 */
export async function selectForwarder(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/wms-forwarder/selectWmsForwarderList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 启用|禁用 货主信息 禁用：/wms-forwarder/disabledWmsForwarder
 * @param params
 */
export async function abledForwarder(params) {
  const { type, ids } = params;
  const url =
    type === 'disabled'
      ? '/server/api/wms-forwarder/disabledWmsForwarder'
      : '/server/api/wms-forwarder/enableWmsForwarder';
  return request(url, {
    method: 'POST',
    body: {
      ids,
    },
  });
}

/**
 * 查询详情 货主信息 /wms-forwarder/viewWmsForwarderDetails
 * @param params
 */
export async function viewForwarder(params) {

  return request('/server/api/wms-forwarder/viewWmsForwarderDetails', {
    method: 'POST',
    body: {
      ...params,
      //   method: 'post',
    },

  });
}

/**
 * 新增、修改  货主信息 /wms-forwarder/insertWmsForwarder
 * @param params
 */
export async function operateForwarder(params) {
  let url = params.id ? 'updateWmsForwarder' : 'insertWmsForwarder';
  return request(`/server/api/wms-forwarder/${url}`, {
    method: 'POST',
    body: {
      ...params,
      // method: 'post',
    },
  });
}


