import request from '@/utils/request';
import { stringify } from 'qs';
import { getPageSize } from '@/utils/common';

export async function queryOwnCompany() {
  return request(`/server/api/d-customer/selectCompany`, {
    method: 'POST',
    body: {},
  });
}
export async function querytDictByCode(params) {
  return request(`/server/api/mds-dict-data/selectDictByCode`, {
    method: 'POST',
    body: params,
  });
}
export async function selectAreaById(params) {
  return request(`/server/api/mds-location-area/selectAreaById`, {
    method: 'POST',
    body: params,
  });
}

export async function selectOrgById(params) {
  return request(`/server/api/mds-organization/selectAreaById`, {
    method: 'POST',
    body: params,
  });
}

export async function viewAreaById(params) {
  return request(`/server/api/mds-location-area/viewAreaById`, {
    method: 'POST',
    body: params,
  });
}

export async function querySelectSearch(payload) {
  const { params, url } = payload;
  if(params.needPages){
    params.pageSize = params.pageSize || getPageSize();
  }
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}

//导出 
export async function globalExportFn(payload) {
  const { url, params } = payload
  params.token = localStorage.getItem('token')
  let exportUrl = `/server/api/${url}?${stringify(params)}`
  window.open(exportUrl)
}

//铃铛信息
export async function logTips(params){
  return request(`/server/api/mds-operation-log/selectList`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询附件
 */
export async function selectFileList(params) {
  return request(`/server/api/attachment/selectFileList`, {
    method: 'POST',
    body: params,
  });
}
