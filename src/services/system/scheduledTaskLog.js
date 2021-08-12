import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';


export async function scheduledTaskLogList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds-job-log/selectMdsJobLogList`, {
    method: 'POST',
    body: params,
  });
}
