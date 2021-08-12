import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、货品管理列表查询
export async function goodsList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-part/selectWmsPartList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

/**
 * 新增编辑
 */
export async function goodsOperate(params) {
    const url = params.id ? 'wms-part/updateWmsPart' : 'wms-part/insertWmsPart';

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
    const url = params.type === 'disabled' ? 'wms-part/disabledWmsPart' : 'wms-part/enableWmsPart';
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
export async function goodsDetails(params) {
    return request(
        `/server/api/wms-part/viewWmsPartDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

