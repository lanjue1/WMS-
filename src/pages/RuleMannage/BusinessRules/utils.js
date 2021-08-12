import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';

export const codes = {
  page: 'BUSINESSRULESPAGE',
};

export const allDispatchType = {
  debuglist: 'businessRules/selectDebugList',
  value: 'businessRules/allValus',
};

export function renderTableAdSelect({ key, data, value, props, type }) {
  let params = { onlyRead: true, value };
  if (key) {
    const { dictObject } = props;
    params = { data: dictObject[key], payload: { code: [key] }, ...params };
  } else {
    params = { data, ...params };
  }
  let show = { id: 'code', name: 'value' };
  if (type == 'train') {
    show = { id: 'id', name: 'trainNo' };
  }
  params.show = show;
  return <AdSelect {...params} />;
}

export function saveAllValue({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: 'businessRules/allValus',
    payload,
  });
}
