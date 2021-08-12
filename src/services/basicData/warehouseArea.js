import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、仓库管理列表查询
export async function warehouseAreaList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/wms-warehouse-area/selectWmsWarehouseAreaList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 新增编辑
 */
export async function warehouseAreaOperate(params) {
  const url = params.id
    ? 'wms-warehouse-area/updateWmsWarehouseArea'
    : 'wms-warehouse-area/insertWmsWarehouseArea';
  console.log('params===()',params)
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//启用禁用
export async function ableOperate(params) {
  const url = params.type
    ? 'wms-warehouse-area/enableWmsArea'
    : 'wms-warehouse-area/disabledWmsArea';
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

/**详情 */
export async function warehouseAreaDetails(params) {
  return request(
    `/server/api/wms-warehouse-area/viewWmsWarehouseAreaDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
