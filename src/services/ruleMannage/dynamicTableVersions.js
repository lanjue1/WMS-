import request from '@/utils/request';
import { getPageSize } from '@/utils/common';
import {stringify} from 'qs'


// 1、查询动态表列表
export async function selectDynamicTableList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/rule-table-version/selectRuleTableVersionList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

// 2、查询动态表详情
export async function selectDynamicTableDetail(params) {
  return request(`/server/api/rule-table-version/viewRuleTableVersionDetails`, {
    method: 'POST',
    body: params,
  });
}

//查询规则表字段
export async function requestRuleTableFieldList(params) {
  return request(`/server/api/rule-table-version/selectRuleTableFieldList`, {
    method: 'POST',
    body: params,
  });
}


//3、新增、编辑--动态表
export async function dynamicTableOperate(params) {
  let url = '';
  if (params.id) {
    url = 'updateRuleTableVersion';
  } else {
    url = 'insertRuleTableVersion';
  }
  return request(`/server/api/rule-table-version/${url}`, {
    method: 'POST',
    body: params,
  });
}

// 4、动态表 删除
export async function removeDynamicTable(params) {
  return request(`/server/api/rule-table-version/deleteRuleTableVersion`, {
    method: 'POST',
    body: params,
  });
}
// 二、
// 1 动态表数据
export async function selectTable(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/rule-table-query/selectTable`, {
    method: 'POST',
    body: params,
  });
}
//2 添加修改动态表
export async function osDyData(params) {
  return request(`/server/api/rule-table-query/changeData`, {
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


//新增动态表数据
export async function operationTableData(params) {
  let url = params.id ? 'rule-table-query/changeData' : 'rule-table-query/changeData'
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}

//删除动态表数据
export async function delTableData(params) {
  return request(`/server/api/rule-table-query/deleteData`, {
    method: 'POST',
    body: params,
  });
}


//上线 、下线
export async function operationStatus(params) {
  let url = params.type === 'downLine' ? 'rule-table-version/downLine' : 'rule-table-version/upLine'
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}

// 导出动态表
export async function exportTableVersions(params) {
  params.token = localStorage.getItem('token')
  let url = `/server/api/rule-table-version/exportRuleTableVersionData?${stringify(params)}`
  console.log('params', url)
  window.open(url)
}

//清空数据表emptyTableData
export async function emptyTableData(params) {
  return request(`/server/api/rule-table-version/deleteTableData`, {
    method: 'POST',
    body: params,
  });
}
