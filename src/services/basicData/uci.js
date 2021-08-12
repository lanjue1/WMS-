import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/** 
 * 查询 库存列表 /wms-inventory/selectWmsInventoryList
 * @param params
 */
export async function selectUCI(params) {
  params.pageSize = params.pageSize || getPageSize();

  return request('/server/api/dpe-uci/selectDpeUciList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}



