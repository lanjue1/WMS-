import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 一、动态数据源
// 1、查询动态数据源列表
export async function selectDynamicDataList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/rule-data-source/selectDataSourceList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

// 2、查询动态数据源详情
export async function selectDynamicDataDetail(params) {
  return request(`/server/api/rule-data-source/selectDetail`, {
    method: 'POST',
    body: params,
  });
}

//3、新增、编辑--动态数据源
export async function dynamicDataOperate(params) {
  let url = '';
  if (params.id) {
    url = 'updateDataSource';
  } else {
    url = 'addDataSource';
  }
  return request(`/server/api/rule-data-source/${url}`, {
    method: 'POST',
    body: params,
  });
}

// 4、动态数据源 删除
export async function removeDynamicData(params) {
  return request(`/server/api/rule-data-source/deleteDataSource`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询附件
 */
export async function selectFileList(params) {
  return request(`/server/api/tms/attachment/selectFileList`, {
    method: 'POST',
    body: params,
  });
}
