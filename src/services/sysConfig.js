import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、系统配置管理
//1、系统配置管理查询列表
export async function sysConfigList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds-sys-config/selectMdsSysConfigList`, {
    method: 'POST',
    body: params,
  });
}
///2、系统配置管理新增
export async function sysConfigAdd(params) {
  return request(
    `/server/api/mds-sys-config/insertMdsSysConfig`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//3、系统配置管理编辑
export async function sysConfigEdit(params) {
  return request(
    `/server/api/mds-sys-config/updateMdsSysConfig`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

//4、系统配置管理详情
export async function sysConfigDetails(params) {
  return request(
    `/server/api/mds-sys-config/viewMdsSysConfigDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
// reinitialize
export async function reinitialize(params) {
  return request(
    `/server/api/mds-sys-config/reinitialize`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
