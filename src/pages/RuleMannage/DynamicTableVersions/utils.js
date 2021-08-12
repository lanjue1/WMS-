import { queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';

export const formate = 'YYYY-MM-DD';
export const formateNOSecond = 'YYYY-MM-DD HH:mm';

export const codes = {
  page: 'DYNAMICTABLEMANAGE',
  select: 'MISCELLANEOUS_SELECT',
  showDetail: 'MISCELLANEOUS_VIEW',
  add: 'MISCELLANEOUS_ADD',
  bill: 'MISCELLANEOUS_GENERATEBILL',
  edit: 'MISCELLANEOUS_UPD',
  remove: 'MISCELLANEOUS_DEL',
};
// RELEASE 发布 CANCLE 下线
export const statusMap = {
  '下线': 'error',
  '上线': 'success'
};
// 字段类型
export const filedTypeList = [
  { code: 'QUERY', value: '查询项' },
  { code: 'VALUE', value: '普通值' },
];
// 是否为空
export const beEmptyList = [{ code: 'true', value: '是' }, { code: 'false', value: '否' }];

export const allUrl = {
  companyList: 'tms/tms-dynamicTableVersions/selectSpplierList_s',
  userList: 'mds-user/selectList', //未配权限
  supplierList: 'tms/tms-bill/selectSpplierList_s', //未配权限
  supplierDetail: 'd-customer/viewCompany',
  userDetail: 'mds-user/viewDetails',
};

export const routeUrl = {
  add: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsAdd',
  edit: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsEdit',
  dynamicData: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsData',
};

export const allDispatchType = {
  list: 'dynamicTableVersions/selectDynamicTableList',
  detail: 'dynamicTableVersions/selectDynamicTableDetail',
  remove: 'dynamicTableVersions/removeDynamicTable',
  genBills: 'dynamicTableVersions/generatedBills',
  operate: 'dynamicTableVersions/dynamicTableOperate',
  //动态数据表：
  dataTable: 'dynamicTableVersions/selectTable',
  osDyData: 'dynamicTableVersions/osDyData',

  value: 'dynamicTableVersions/allValus',

  fildList: 'dynamicTableVersions/requestRuleTableFieldList'
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

export function selectDynamicTableList({ payload = {}, props } = {}) {
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

export function selectDynamicTableDetailAndInfo({ type, payload, props, callback }) {
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
    type: 'dynamicTableVersions/allValus',
    payload,
  });
}

// 规则表列表显示字段
export const SelectColumns = [
  {
    title: 'DynamicTableVersions.field.name',
    dataIndex: 'name',
    width: 120,
  }, {
    title: 'DynamicTableVersions.field.status',
    dataIndex: 'status',
    width: 120,
  },
]
