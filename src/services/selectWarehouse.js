import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 用户绑定列表查询
export async function fetchUserWarehouseList(params) {
    return request(`/server/api/wms-user-warehouse/selectRelationUserWarehouseList`, {
        method: 'POST',
        body: params,
    });
}

// 用户可选绑定列表查询
export async function fetchAuthWarehouseList(params) {
    return request(`/server/api/wms-user-warehouse/selectWmsUserWarehouseList`, {
        method: 'POST',
        body: params,
    });
}

// 用户绑定仓库
export async function fetchBindWarehouse(params) {
    return request(`/server/api/wms-user-warehouse/relationUserWarehouse`, {
        method: 'POST',
        body: params,
    });
}

// 用户绑定仓库
export async function fetchSwitchWarehouse(params) {
    return request(`/server/api/wms-user-warehouse/switchUserWarehouse`, {
        method: 'POST',
        body: params,
    });
}