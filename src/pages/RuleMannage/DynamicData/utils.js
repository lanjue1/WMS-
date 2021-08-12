import { queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';

export const formate = 'YYYY-MM-DD HH:mm:ss';
export const formateNOSecond = 'YYYY-MM-DD HH:mm';

export const codes = {
  page: 'DATASOURCEMANAGE',
  select: 'DATASOURCEMANAGE',
  showDetail: 'DATASOURCEMANAGE',
  add: 'DATASOURCEMANAGE',
  bill: 'DATASOURCEMANAGE',
  edit: 'DATASOURCEMANAGE',
  remove: 'DATASOURCEMANAGE',
};
// UNSEALED 草稿、 COMMIT 已提交、 CONFIRM 已确认
export const dynamicDataStatusList = [
  { code: 'UNSEALED', value: '草稿' },
  { code: 'CONFIRM', value: '已确认' },
  { code: 'COMMIT', value: '已提交' },
];

export const allUrl = {
  companyList: 'tms/tms-dynamicData/selectSpplierList_s',
  userList: 'mds-user/selectList', //未配权限
  supplierList: 'tms/tms-bill/selectSpplierList_s', //未配权限
  supplierDetail: 'd-customer/viewCompany',
  userDetail: 'mds-user/viewDetails',
};

export const routeUrl = {
  add: '/rules/ruleMannage/dynamicDataList/dynamicDataAdd',
  edit: '/rules/ruleMannage/dynamicDataList/dynamicDataEdit',
};

export const allDispatchType = {
  list: 'dynamicData/selectDynamicDataList',
  detail: 'dynamicData/selectDynamicDataDetail',
  remove: 'dynamicData/removeDynamicData',
  genBills: 'dynamicData/generatedBills',
  operate: 'dynamicData/dynamicDataOperate',

  value: 'dynamicData/allValus',
};

export function renderTableAdSelect({ key, data, value, props }) {
  let params = { onlyRead: true, value };
  if (key) {
    const { dictObject } = props;
    params = { data: dictObject[key], payload: { code: [key] }, ...params };
  } else {
    params = { data, ...params };
  }
  return <AdSelect {...params} />;
}

export function renderTableAdSearch({ value, props }) {
  if (!value || !searchValue) return '';
  const { searchValue } = props;
  const params = {
    onlyRead: true,
    value: searchValue[value],
    label: 'loginName',
    name: 'sysName',
  };
  return <AdSearch {...params} />;
}

export function selectDynamicDataList({ payload = {}, props } = {}) {
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

export function selectDynamicDataDetailAndInfo({ type, payload, props, callback }) {
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
    type: 'dynamicData/allValus',
    payload,
  });
}
