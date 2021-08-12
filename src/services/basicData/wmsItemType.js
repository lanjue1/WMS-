import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、货品类型列表查询
export async function wmsItemTypeList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/wms-part-type/selectWmsPartTypeList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 新增编辑
 */
export async function wmsItemTypeOperate(params) {
  const url = params.id ? 'wms-part-type/updateWmsPartType' : 'wms-part-type/insertWmsPartType';
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
  const url = params.type ? 'wms-part-type/enableWmsPart' : 'wms-part-type/disabledWmsPart';
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
export async function wmsItemTypeDetails(params) {
  return request(
    `/server/api/wms-part-type/viewWmsPartTypeDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
