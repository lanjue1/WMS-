import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import router from 'umi/router';

export const SequenceStatus = [{ code: 1, value: '是' }, { code: 0, value: '否' }];

export const codes = {
  select: 'SEQUENCEPAGE_SELECT',
  add: 'SEQUENCEPAGE_ADD',
  edit: 'SEQUENCEPAGE_UPA',
  showDetail: 'SEQUENCEPAGE_VIEW',
  page: 'SEQUENCEPAGE',
  remove: 'SEQUENCEPAGE_DEL',
};

export const allUrl = {
  userList: 'mds-user/selectList',
  userDetail: 'mds-user/viewDetails',
};

export const routeUrl = {
  add: '/system/SequenceList/SequenceAdd',
  edit: '/system/SequenceList/SequenceEdit',
};

export const allDispatchType = {
  list: 'sequence/selectSequenceList', //报关列表
  detail: 'sequence/selectSequenceDetails', //报关详情
  value: 'sequence/allValus',
  save: 'sequence/saveSequence',
  delete: 'sequence/deleteSequence',
};

export function renderTableAdSelect({ key, data, value, props }) {
  let params = { onlyRead: true, value };
  if (key) {
    const { dictObject } = props;
    params = { data: dictObject[key], payload: { code: [key] }, ...params };
  } else {
    params = { data, ...params };
  }
  // params.show = { id: 'value', name: 'code' };
  return <AdSelect {...params} />;
}

export function selectSequenceList({ payload = {}, props, call }) {
  const { dispatch, searchValue } = props;
  dispatch({
    type: allDispatchType.list,
    payload,
    callback: data => {
      if (!data) return;
      queryPerson({ data, props: props, url: allUrl.userList });
    },
  });
}

export function sequenceDetail({ type, payload, props, callback }) {
  const { dispatch } = props;
  dispatch({
    type,
    payload,
    callback: data => {
      if (!data) return;
      callback && callback(data);
    },
  });
}

export function saveAllValues({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: allDispatchType.value,
    payload,
  });
}
