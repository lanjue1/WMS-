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
			url = 'wms-po/updatePoStatusCancel'
			break;
		// 取消受理
		case 'cancelAccepted':
			url = 'wms-po/updatePoStatusConfirmed'
			break;
		// 确定受理
		case 'confirmAccepted':
			url = 'wms-po/updatePoStatusConfirm'
			break;
		// 新增
		case 'add':
			url = 'wms-po/insertWmsPo'
			break;
		// 修改
		case 'update':
			url = 'wms-po/updateWmsPo'
			break;

		// 删除明细
		case 'poDetailDelete':
			url = 'wms-po-detail/deleteWmsPoDetail'
			break;

		// 新增明细
		case 'addDetail':
			url = 'wms-po-detail/insertWmsPoDetail'
			break;

		// 编辑明细
		case 'updateDetail':
			url = 'wms-po-detail/updateWmsPoDetail'
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
export async function poDetails(params) {
	return request(
		`/server/api/wms-po/viewWmsPoDetails`,
		{
			method: 'POST',
			body: params,
		},
		true
	);
}

//asn明细
export async function poDetailList(params) {
	const { type, ...param } = params
	let url = ''
	switch (type) {
		case 'poDetailList':
			url = 'wms-po-detail/selectWmsPoDetailList'
			break;
	}
	params.pageSize = params.pageSize || getPageSize();
	return request(`/server/api/${url}`, {
		method: 'POST',
		body: param,
		type: 'enableEnum'
	});
}

