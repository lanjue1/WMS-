import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、国家管理列表查询
export async function countryList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/mds-country/selectMdsCountryList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

/**
 * 新增编辑
 */
export async function countryOperate(params) {
    const url = params.id ? 'mds-country/updateMdsCountry' : 'mds-country/insertMdsCountry';
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
    const url = params.type ? 'mds-country/enableMdsCountry' : 'mds-country/disabledMdsCountry';
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
export async function countryDetails(params) {
    return request(
        `/server/api/mds-country/viewMdsCountryDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

