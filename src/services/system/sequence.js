import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

/**
 * 查询列表
 */
export async function selectSequenceList(params) {
  params.pageSize = params.pageSize || 10;
  return request(`/server/api/mds-code-sequence-regex/selectMdsCodeSequenceRegexList`, {
    method: 'POST',
    body: params,
    type: 'enableEnum'
  });
}

/**
 * 查询详情
 */
export async function selectSequenceDetails(params) {
  return request(`/server/api/mds-code-sequence/viewMdsCodeSequenceDetails`, {
    method: 'POST',
    body: params,
  });
}
//保存操作
export async function saveSequence(params) {
  const { ...body } = params;
  const url = params.id ? 'updateMdsCodeSequence' : 'insertMdsCodeSequence';
  return request(`/server/api/mds-code-sequence/${url}`, {
    method: 'POST',
    body,
  });
}
//删除
export async function deleteSequence(params) {
  const { ...body } = params;
  return request(`/server/api/mds-code-sequence/deleteMdsCodeSequence`, {
    method: 'POST',
    body,
  });
}

//启用禁用
export async function ableOperate(params) {
  const url = params.type ? 'mds-code-sequence/enableMdsCodeSequence' : 'mds-code-sequence/disabledMdsCodeSequence';
  return request(
    `/server/api/${url}`,
    {
      method: 'POST',
      body: params,
    },
    true
  );
}

// 调整步长
export async function curStep(params) {
  return request(`/server/api/mds-code-sequence-regex/refreshMdsCodeSequence`, {
    method: 'POST',
    body: params,
  });
}
