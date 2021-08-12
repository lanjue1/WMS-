import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、仓库管理列表查询
export async function warehouseList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/wms-warehouse/selectWmsWarehouseList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

/**
 * 新增编辑
 */
export async function warehouseOperate(params) {
    const url = params.id ? 'wms-warehouse/updateWmsWarehouse' : 'wms-warehouse/insertWmsWarehouse';
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
        case 'abled':
            url='wms-warehouse/enableWmsWarehouse'
            break;
        case 'disabled':
            url='wms-warehouse/disabledWmsWarehouse'
            break;
        case 'autoLock':
            url='wms-warehouse/changeAutoLock'
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
export async function warehouseDetails(params) {
    return request(
        `/server/api/wms-warehouse/viewWmsWarehouseDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

