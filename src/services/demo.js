import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

export async function carList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/tms/tms-vehicle/selectList`, {
    method: 'POST',
    body: params,
  });
}
export async function selectDetails(params) {
  return request(`/server/api/tms/tms-vehicle/selectDetails`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 新增编辑车辆
 */
export async function vehicleOperate(params) {
  const url = params.id ? 'tms-vehicle/updateVehicle' : 'tms-vehicle/insertVehicle';
  return request(
    `/server/api/tms/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
/**
 * 新增编辑证件
 */
export async function paperOperate(params) {
  const url = params.id ? 'tms-vehicle-papers/updatePapers' : 'tms-vehicle-papers/insertPapers';
  return request(
    `/server/api/tms/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function selectPapersDetails(params) {
  return request(`/server/api/tms/tms-vehicle-papers/selectPapersDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function selectDictByCode(params) {
  return request(`/server/api/tms/tms-dictionary/selectDictByCode`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 启用禁用车辆
 */
export async function ableVehicle(params) {
  console.log('params', params);
  const url = params.type ? 'tms-vehicle/enableVehicle' : 'tms-vehicle/disabledVehicle';
  return request(
    `/server/api/tms/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//查询司机
export async function selectListDriver(params) {
  return request(`/server/api/tms/tms-vehicle/selectDriverList`, {
    method: 'POST',
    body: params,
  });
}

// 通过车辆ID查询车辆-司机关系表列表
export async function vehicleDriverList(params) {
  return request(`/server/api/tms/tms-vehicle-driver/selectTmsVehicleDriverList`, {
    method: 'POST',
    body: params,
  });
}
export async function vehicleDriverDetails(params) {
  return request(`/server/api/tms/tms-vehicle-driver/viewTmsVehicleDriverDetails`, {
    method: 'POST',
    body: params,
  });
}
export async function vehicleDriverOperate(params) {
  const url = params.id
    ? 'tms-vehicle-driver/updateTmsVehicleDriver'
    : 'tms-vehicle-driver/insertTmsVehicleDriver';
  return request(
    `/server/api/tms/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function deleteVehicleDriver(params) {
  return request(`/server/api/tms/tms-vehicle-driver/deleteTmsVehicleDriver`, {
    method: 'POST',
    body: params,
  });
}
