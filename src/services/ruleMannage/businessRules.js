import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、规则菜单//
//1、规则菜单列表
export async function ruleMenuList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/rule-menu/selectRuleMenuList`, {
    method: 'POST',
    body: params,
  });
}
//2、规则菜单详情
export async function ruleMenuDetails(params) {
  return request(
    `/server/api/rule-menu/viewRuleMenuDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
/**
 * 3、新增编辑规则菜单
 */
export async function ruleMenuOperate(params) {
  const url = params.id ? 'rule-menu/updateRuleMenu' : 'rule-menu/insertRuleMenu';
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//4、删除规则菜单表：
export async function deleteRuleMenu(params) {
  return request(`/server/api/rule-menu/deleteRuleMenu`, {
    method: 'POST',
    body: params,
  });
}

//二、规则菜单内容表

/**
 * 1、新增编辑规则菜单内容
 */
export async function ruleMenuConOperate(params) {
  const url = params.id
    ? 'rule-menu-content/updateRuleMenuContent'
    : 'rule-menu-content/insertRuleMenuContent';
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//2、规则菜单内容详情
export async function ruleMenuConDetails(params) {
  return request(
    `/server/api/rule-menu-content/viewRuleMenuContentDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//3、删除规则内容表：
export async function deleteRuleMenuCon(params) {
  return request(`/server/api/rule-menu-content/deleteRuleMenuContent`, {
    method: 'POST',
    body: params,
  });
}
//5、发布\下线规则内容
export async function operateRuleMenuCon(params) {
  const { type, ...body } = params;
  const url = type == 'release' ? 'releaseRuleMenuContent' : 'cancelRuleMenuContent';
  return request(`/server/api/rule-menu-content/${url}`, {
    method: 'POST',
    body,
  });
}
//6、数据源列表：
export async function dataSourceList(params) {
  return request(`/server/api/rule-menu-content/selectDataSourceList`, {
    method: 'POST',
    body: params,
  });
}
//调试：
export async function debug(params) {
  return request(`/server/api/rule-menu-content/debug`, {
    method: 'POST',
    body: params,
  });
}
//调试列表：
export async function selectDebugList(params) {
  return request(`/server/api/rule-menu-content/debug`, {
    method: 'POST',
    body: params,
  });
}
