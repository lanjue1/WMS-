import request from '@/utils/request';

// export async function selectList(params) {
//   return request(`/server/api/mds-organization/selectList`, {
//     method: 'POST',
//     body: params,
//   });
// }
//层级路径
export async function selectList(params) {
  return request(`/server/api/mds-organization/selectFirstOrg`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

export async function selectDetails(params) {
  return request(`/server/api/mds-organization/viewDetails`, {
    method: 'POST',
    body: params,
  });
}

export async function orgAdd(params) {
  return request(`/server/api/mds-organization/addOrgInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function orgEdit(params) {
  return request(`/server/api/mds-organization/updateOrgInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function disabledOrg(params) {
  return request(
    `/server/api/mds-organization/disableOrgInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function enableOrg(params) {
  return request(
    `/server/api/mds-organization/enableOrgInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
