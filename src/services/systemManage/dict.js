import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、字典管理
//1、字典管理查询列表
export async function DictList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds/mds-dict/selectDictList`, {
    method: 'POST',
    body: params,
  });
}
///2、字典管理新增
export async function dictAdd(params) {
  return request(
    `/server/api/mds/mds-dict/addDictInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//3、字典管理编辑
export async function dictEdit(params) {
  return request(
    `/server/api/mds/mds-dict/updateDictInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

//4、字典管理详情
export async function dictDetails(params) {
  return request(
    `/server/api/mds/mds-dict/viewDetails`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//5、字典管理禁用
export async function disabledDictInfo(params) {
  return request(
    `/server/api/mds/mds-dict/disabledDictInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//6、字典管理启用
export async function enableDictInfo(params) {
  return request(
    `/server/api/mds/mds-dict/enableDictInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

//二、字典数据管理
//1、字典数据列表查询
export async function dictDataList(params) {
  return request(`/server/api/mds/mds-dict-data/selectDictDataList`, {
    method: 'POST',
    body: params,
  });
}
export async function dictDataAdd(params) {
  return request(
    `/server/api/mds/mds-dict-data/addDictDataInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function dictDataEdit(params) {
  return request(
    `/server/api/mds/mds-dict-data/updateDictDataInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
export async function dictDataDetails(params) {
  return request(`/server/api/mds/mds-dict-data/viewDetails`, {
    method: 'POST',
    body: params,
  });
}
//5、字典数据管理禁用
export async function disabledDictDataInfo(params) {
  return request(
    `/server/api/mds/mds-dict-data/disabledDictDataInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//6、字典数据管理启用
export async function enableDictDataInfo(params) {
  return request(
    `/server/api/mds/mds-dict-data/enableDictDataInfo`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}
//7、字典数据管理字典管理列表：
export async function DictListOfData(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/mds/mds-dict/selectDictList`, {
    method: 'POST',
    body: params,
  });
}
