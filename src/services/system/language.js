import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、国家管理列表查询
export async function languageList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/mds-message-source/selectMdsMessageSourceList`, {
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
    const {type,...param}=params
    let url=''
    switch(type){
        case "editLang":
            url='mds-message-source/updateMdsMessageSourceBatch'
            break;
        case "addLang":
            url='mds-message-source/insertMdsMessageSourceBatch'
            break;
        case 'disable':
            url='mds-message-source/disableMdsMessageSource'
            break;
        case 'enable':
            url='mds-message-source/enableMdsMessageSource'
            break;
        case 'allImport':
            url='mds-message-source/importMdsMessageSource'
            break;
    }
    
    return request(
        `/server/api/${url}`,
        {
            method: 'POST',
            body: param,
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

