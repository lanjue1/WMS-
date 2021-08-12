import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 一、动态表
// 1、查询动态表列表
export async function selectDynamicTableList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/rule-table/selectRuleTableList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

// 2、查询动态表详情
export async function selectDynamicTableDetail(params) {
  return request(`/server/api/rule-table/viewRuleTableDetails`, {
    method: 'POST',
    body: params,
  });
}

//3、新增、编辑--动态表
export async function dynamicTableOperate(params) {
  let url = '';
  if (params.id) {
    url = 'updateRuleTable';
  } else {
    url = 'insertRuleTable';
  }
  return request(`/server/api/rule-table/${url}`, {
    method: 'POST',
    body: params,
  });
}

// 4、动态表 删除
export async function removeDynamicTable(params) {
  return request(`/server/api/rule-table/deleteRuleTable`, {
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

//启用禁用
export async function operationStatus(params) {
  let url = params.type === 'enable' ? 'rule-table/enableRuleTable' : 'rule-table/disableRuleTable'
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}


//添加表字段operationTableField
export async function operationTableField(params) {
  let url = params.id ? 'rule-table-field/updateRuleTableField' : 'rule-table-field/insertRuleTableField'
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}

//删除表字段operationTableField
export async function delTableField(params) {
  let url = 'rule-table-field/deleteRuleTableField'
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}

//表字段上移下移
export async function sortableField(params) {
  let url = params.type === 'moveUp' ? 'rule-table-field/moveUp' : 'rule-table-field/moveDown'
  return request(`/server/api/${url}`, {
    method: 'POST',
    body: params,
  });
}

// 导出动态表
// export async function exportTable(params) {
//   params.token=localStorage.getItem('token')
//   let url=`/server/api/wms-po/exportWmsPoBySearch?${stringify(params)}`
//   window.open(url)
// }
