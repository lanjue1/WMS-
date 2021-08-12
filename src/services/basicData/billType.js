import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、国家管理列表查询
export async function billTypeList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/mds-bill-type/selectMdsBillTypeList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

/**
 * 新增编辑
 */
export async function billTypeOperate(params) {
    const url = params.id ? 'mds-bill-type/updateMdsBillType' : 'mds-bill-type/insertMdsBillType';
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
    const url = params.type ? 'mds-bill-type/enableMdsBillType' : 'mds-bill-type/disabledMdsBillType';
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
export async function billTypeDetails(params) {
    return request(
        `/server/api/mds-bill-type/viewMdsBillTypeDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

