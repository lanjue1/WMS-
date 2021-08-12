import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询 仓库库位列表 /wms-warehouse-bin/selectWmsWarehouseBinList
 * @param params
 */
export async function selectWarehouseBin(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/wms-warehouse-bin/selectWmsWarehouseBinList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 启用|禁用 仓库库位 禁用：/wms-warehouse-bin/disabledWmsBin、/wms-warehouse-bin/enableWmsBin
 * @param params
 */
export async function abledWarehouseBin(params) {
  const { type, ids } = params;
  let url=''
  switch(type){
    case 'disabled':
      url='wms-warehouse-bin/disabledWmsBin'
      break;
    case 'enable':
      url='wms-warehouse-bin/enableWmsBin'
      break;
    case 'resetException':
      url='wms-warehouse-bin/resetExceptionBin'
      break;
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: {
      ids,
    },
  });
}

/**
 * 查询详情 仓库库位 /wms-warehouse-bin/viewWmsWarehouseBinDetails
 * @param params
 */
export async function viewWarehouseBin(params) {
  return request('/server/api/wms-warehouse-bin/viewWmsWarehouseBinDetails', {
    method: 'POST',
    body: {
      ...params,
      //   method: 'post',
    },
  });
}

/**
 * 新增、修改  仓库库位 /wms-warehouse-bin/insertWmsWarehouseBin、/wms-warehouse-bin/updateWmsWarehouseBin
 * @param params
 */
export async function operateWarehouseBin(params) {
  let url = params.id ? 'updateWmsWarehouseBin' : 'insertWmsWarehouseBin';
  return request(`/server/api/wms-warehouse-bin/${url}`, {
    method: 'POST',
    body: {
      ...params,
      // method: 'post',
    },
  });
}
//wms-warehouse-bin/generateWmsBinBatch
export async function addBatch(params) {
  return request('/server/api/wms-warehouse-bin/generateWmsBinBatch', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

