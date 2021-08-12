import request from '@/utils/request';
export async function queryComponentList(payload) {
  const { params, url } = payload;
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}
export async function queryFileList(params) {
  return request(`/server/api/attachment/selectFileList`, {
    method: 'POST',
    body: params,
  });
}
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

// 报表预览
export async function querytReport(payload) {
  let {requestUrl,...params}=payload;
  return request(`/server/api/${requestUrl}`, {
    method: 'POST',
    body: params,
  });
}



