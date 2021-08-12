import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、列表
export async function blockQueueList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/queue/selectList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}



