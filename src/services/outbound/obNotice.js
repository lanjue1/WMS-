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
            url = 'wms-outbound-notice/orderCancel'
            break;
        // 取消受理
        case 'cancelAccepted':
            url = 'wms-outbound-notice/cancelConfirm'
            break;
        // 确定受理
        case 'confirmAccepted':
            url = 'wms-outbound-notice/orderConfirm'
            break;
        // 新增
        case 'add':
            url = 'wms-outbound-notice/insertWmsOutboundNotice'
            break;
        // 修改
        case 'update':
            url = 'wms-outbound-notice/updateWmsOutboundNotice'
            break;

        // 删除明细
        case 'poDetailDelete':
            url = 'wms-outbound-notice-detail/deleteWmsOutboundNoticeDetail'
            break;

        // 新增明细
        case 'addDetail':
            url = 'wms-outbound-notice-detail/insertWmsOutboundNoticeDetail'
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
export async function obNoticeDetails(params) {
    return request(
        `/server/api/wms-outbound-notice/viewWmsOutboundNoticeDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

//so明细
export async function obNoticeDetailList(params) {
    const { type, ...param } = params
    let url = ''
    switch (type) {
        case 'obNoticeDetailList':
            url = 'wms-outbound-notice-detail/selectWmsOutboundNoticeDetailList'
            break;
    }
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: param,
        type: 'enableEnum'
    });
}

