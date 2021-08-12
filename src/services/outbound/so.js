import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 确定录入|取消确定
export async function ableOperate(params) {
    const { type, ...param } = params
    let url = ''
    switch (type) {
        // 取消订单
        case 'cancelOrder':
            url = 'wms-so/updateSoStatusCancel'
            break;
        // 取消受理
        case 'cancelAccepted':
            url = 'wms-so/updateSoStatusConfirmed'
            break;
        // 确定受理
        case 'confirmAccepted':
            url = 'wms-so/updateSoStatusConfirm'
            break;
        // 新增
        case 'add':
            url = 'wms-so/insertWmsSo'
            break;
        // 修改
        case 'update':
            url = 'wms-so/updateWmsSo'
            break;

        // 删除明细
        case 'soDetailDelete':
            url = 'wms-so-detail/deleteWmsSoDetail'
            break;

        // 新增明细
        case 'addDetail':
            url = 'wms-so-detail/insertWmsSoDetail'
            break;

        // 编辑明细
        case 'updateDetail':
            url = 'wms-so-detail/updateWmsSoDetail'
            break;
    }
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: param,
    },
        true
    );
}

// 详情
export async function soDetails(params) {
    return request(
        `/server/api/wms-so/viewWmsSoDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

//so明细
export async function soDetailList(params) {
    const { type, ...param } = params
    let url = ''
    switch (type) {
        case 'soDetailList':
            url = 'wms-so-detail/selectWmsSoDetailList'
            break;
    }
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: param,
        type: 'enableEnum'
    });
}

