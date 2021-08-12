import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 替代料关联列表查询
 */
export async function itemRelationList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-part-relation/selectWmsPartRelationList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}
/**
 * 新增编辑
 */
export async function itemRelationOperate(params) {
    const url = params.id ? 'wms-part-relation/updateWmsPartRelation' : 'wms-part-relation/insertWmsPartRelation';

    return request(
        `/server/api/${url}`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
/**
 * 启用禁用
 */
export async function ableOperate(params) {
    const url = params.type ? 'wms-part-relation/disabledWmsPartRelation' : 'wms-part-relation/enableWmsPartRelation';
    return request(
        `/server/api/${url}`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
/**删除 */
export async function itemRelationDelete(params) {
    return request(
        `/server/api/wms-part-relation/deleteWmsPartRelation`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
/**详情 */
export async function itemRelationDetails(params) {
    return request(
        `/server/api/wms-part-relation/viewWmsPartRelationDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}