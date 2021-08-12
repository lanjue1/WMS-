import request from '@/utils/request';
import { getPageSize } from '@/utils/common';


/**
 * 查询 货主信息列表 mds-cargo-owner/selectMdsCargoOwnerList
 * @param params
 */
export async function selectCargoOwner(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request('/server/api/mds-cargo-owner/selectMdsCargoOwnerList', {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 启用|禁用 货主信息 禁用：/mds-cargo-owner/disabledMdsCargoOwner
 * @param params
 */
export async function abledCargoOwner(params) {
  const { type, ids } = params;
  const url =
    type === 'disabled'
      ? '/server/api/mds-cargo-owner/disabledMdsCargoOwner'
      : '/server/api/mds-cargo-owner/enableMdsCargoOwner';
  return request(url, {
    method: 'POST',
    body: {
      ids,
    },
  });
}

/**
 * 查询详情 货主信息 /mds-cargo-owner/viewMdsCargoOwnerDetails
 * @param params
 */
export async function viewCargoOwner(params) {
  
  return request('/server/api/mds-cargo-owner/viewMdsCargoOwnerDetails', {
    method: 'POST',
    body: {
      ...params,
    //   method: 'post',
    },
     
  });
}

/**
 * 新增、修改  货主信息 /mds-cargo-owner/insertMdsCargoOwner
 * @param params
 */
export async function operateCargoOwner(params) {
  let url= params.id ? 'updateMdsCargoOwner' : 'insertMdsCargoOwner';
  return request(`/server/api/mds-cargo-owner/${url}`, {
    method: 'POST',
    body: {
      ...params,
      // method: 'post',
    },
  });
}


