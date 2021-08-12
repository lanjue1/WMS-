import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 确定录入|取消确定
export async function ableOperate(params) {
    const {type,...param}=params
    let url = ''
    switch (params.type) {
        case 'confirm':
            url = 'wms-asn/confirmWmsAsn'
            break;
        case 'cancel':
            url = 'wms-asn/cancelConfirmWmsAsn'
            break;
        case 'cancelASN':
            url = 'wms-asn/createAsnReceipt'
            break;
        case 'receiveItem':
            url = ''
            break;
        case 'cancelReceive':
            url = ''
            break;
        case 'putaway':
            url = 'wms-move/generatePutaway'
            break;
        case 'cancelPutaway':
            url = 'wms-move/cancelPutaway'
            break;


        case 'saveAll':
            url='wms-asn/updateWmsAsn'
            break;
        case 'insert':
            url='wms-asn/insertWmsAsn'
            break;
        case 'removeParts':
            url='wms-asn-detail/deleteWmsAsnDetail'
            break;
        case 'insertDetail':
            url='wms-asn-detail/insertWmsAsnDetail'
            break;
        case 'updateDetail':
            url='wms-asn-detail/updateWmsAsnDetail'
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
export async function asnDetails(params) {
    return request(
        `/server/api/wms-asn/viewWmsAsnDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

//asn明细
export async function asnDetailList(params) {
    const { type, ...param } = params
    let url = ''
    switch (type) {
        case 'parts':
            url = 'wms-asn-detail/selectWmsAsnDetailList'
            break;
        case 'package':
            url = 'wms-asn-package-detail/selectWmsAsnPackageDetailList'
            break;
    }
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: param,
        type: 'enableEnum'

    });
}

