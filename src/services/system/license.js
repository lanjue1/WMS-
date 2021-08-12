import request from '@/utils/request';

/**
 * 获取客户反馈列表
 */
export async function selectCustomerTypes(params) {
  return request(`/server/api/track-order/selectCustomerTypes`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询配件报价明细
 */
export async function selectPartsOfferInfo(params) {
  return request(`/server/api/tms/tms-parts-offer-relation/selectTmsPartsOfferDetailsList`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 向后台发送导入xls 文件请求
 */
export async function selectimportExcel(params) { POST /track-order/General/importExcel
  return request(`/server/api/track/track-order/General/importExcel`, {
    method: 'POST',
    body: params,
  });
}




