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
export const statusList = [{ code: 'RELEASE', value: '发布' }, { code: 'CANCEL', value: '下线' }];
// 字段类型
export const filedTypeList = [
  { code: 'QUERY', value: '查找项' },
  { code: 'VALUE', value: '值项' },
];

//变量类型
export const dataTypeList = [
  { code: 'STRING', value: '字符串' },
  { code: 'NUMBER', value: '数值' },
  { code: 'ENUM', value: '枚举' },
];

// 状态
export const statusTypeList = [
  { code: 'disable', value: '禁用' },
  { code: 'enable', value: '启用' },
];
// 是否为空
export const beEmptyList = [{ code: 'yes', value: '是' }, { code: 'no', value: '否' }];

export const menuTypeData = [
  { code: 'LEFT_OR_RIGHT', value: '左开右合（< X <=）' },
  { code: 'LEFT_OR_RIGHT_AWAY', value: '左合右开（<= X <）' },
];
export const selectData = [
  
  { code: true, value: '是' },
  { code: false, value: '否' },
];
export const allUrl = {
  companyList: 'tms/tms-dynamicTable/selectSpplierList_s',
  userList: 'mds-user/selectList', //未配权限
  supplierList: 'tms/tms-bill/selectSpplierList_s', //未配权限
  supplierDetail: 'd-customer/viewCompany',
  userDetail: 'mds-user/viewDetails',
};

export const routeUrl = {
  add: '/rules/ruleMannage/dynamicTableList/dynamicTableAdd',
  edit: '/rules/ruleMannage/dynamicTableList/dynamicTableEdit',
  dynamicData: '/rules/ruleMannage/dynamicTableList/dynamicTableData',
};

export const allDispatchType = {
  list: 'dynamicTable/selectDynamicTableList',
  detail: 'dynamicTable/selectDynamicTableDetail',
  remove: 'dynamicTable/removeDynamicTable',
  genBills: 'dynamicTable/generatedBills',
  operate: 'dynamicTable/dynamicTableOperate',
  //动态数据表：
  dataTable: 'dynamicTable/selectTable',
  osDyData: 'dynamicTable/osDyData',

  value: 'dynamicTable/allValus',
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
    type: 'dynamicTable/allValus',
    payload,
  });
}
