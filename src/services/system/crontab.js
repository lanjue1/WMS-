import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';


export async function crontabList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds-job/selectMdsJobList`, {
    method: 'POST',
    body: params,
  });
}

export async function crontabAdd(params) {
  return request(
    `/server/api/mds-job/insertMdsJob`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

export async function crontabEdit(params) {
  return request(
    `/server/api/mds-job/updateMdsJob`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

export async function crontabDetails(params) {
  return request(
    `/server/api/mds-job/viewMdsJobDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

export async function restateAll(params) {
    return request(
      `/server/api/mds-job/reStartAllJobs`,
      {
        method: 'POST',
        body: params,
      }
    );
  }

  
  export async function deleteTask(params) {
    return request(
      `/server/api/mds-job/deleteMdsJob`,
      {
        method: 'POST',
        body: params,
      },
      true
    );
  }