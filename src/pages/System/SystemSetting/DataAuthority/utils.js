import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import router from 'umi/router';

export const beActiveList = [
  { code: 0, value: '否' },
  { code: 1, value: '是' },
];
export const statusMap = {
  'PUSH-FAIL': 'error',
  'PUSH-QUEUE': 'processing',
  'PUSH-SUCCESS': 'success',
};

export const codes = {
  select: 'DATAPERM_SELECT',
  add: 'DATAPERM_ADD',
  edit: 'DATAPERM_UPA',
  showDetail: 'DATAPERM_VIEW',
  page: 'DATAPERM',
  disabled: 'DATAPERM_DISABLED',
  abled: 'DATAPERM_ABLED',
};

export const allUrl = {
  userList: 'mds-user/selectList',
  userDetail: 'mds-user/viewDetails',
};

export const routeUrl = {
  add: '/system/DataAuthorityList/DataAuthorityAdd',
  edit: '/system/DataAuthorityList/DataAuthorityEdit',
};

export const allDispatchType = {
  list: 'dataAuthority/selectDataPermList', //报关列表
  detail: 'dataAuthority/selectDetails', //报关详情
  value: 'dataAuthority/allValus',
  save: 'dataAuthority/saveSequence',
  delete: 'dataAuthority/deleteSequence',
  enable: 'dataAuthority/enableDataAuthority',
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

export function dataDetail({ type, payload, props, callback }) {
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
