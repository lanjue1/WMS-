import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';



export const formate = 'YYYY-MM-DD HH:mm:ss';
export const formateNOSecond = 'YYYY-MM-DD HH:mm';
const { confirm } = Modal;

export const codes = {
  page: 'ENDORSELIST',
  disabled:'Contact_Unit_Management_Disable',
  enable:'Contact_Unit_Management_Enable',
  add:'Contact_Unit_Management_Add',
  edit:'Contact_Unit_Detail_Edit',
};
// UNSEALED 草稿、 SUBMITTED 已提交、 CONFIRM 已确认  CANCEL 作废
export const archivesStatusList = [
  { code: 'CANCEL', value: '作废' },
  { code: 'UNSEALED', value: '草稿' },
  { code: 'CONFIRM', value: '已确认' },
  { code: 'SUBMITTED', value: '已提交' },
];
export const Status = [
  { code: 'ENABLE', value: '启用' }, 
  { code: 'ENABLED', value: '启用' }, 
{ code: 'DISABLE', value: '禁用' },
];
export const columns1=[
  {
    title:'Code',
    dataIndex:'code',
    width:120,
  },
  {
    title:'Name',
    dataIndex:'name',
    width:100,
  },
]
export const isTrue=[
  {code:false,value:'否'},
  {code:true,value:'是'},
]

export const routeUrl = {
  add: '/basicData/listContactUnit/addContactUnit',
  edit: '/basicData/listContactUnit/editContactUnit',
  
  
};

export const allDispatchType = {
  //请求的url
  list: 'ContactUnit/selectContactUnit',
  detail: 'ContactUnit/viewContactUnit',
  operate:'ContactUnit/operateContactUnit',

  abled: 'ContactUnit/abledContactUnit',

  
};



export function selectList({ payload = {}, props,typeUrl } = {}) {
  const { dispatch, searchValue } = props;
  dispatch({
    type:allDispatchType.list ,
    payload,
    callback: data => {
      if (!data) return;
      queryPerson({ data, props: props, url: allUrl.userList });
    },
  });
  
}



export function saveAllValues({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: 'WarehouseBin/allValus',
    payload,
  });
}


export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
},
  {
    title:'ContactUnit.field.code',
    dataIndex: 'code',
    width: 100,
    render: (text, record) => (
      <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    ),
  },
  {
    title: 'Common.field.status',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: 'ContactUnit.field.name',
    dataIndex: 'name',
    width: 180,
  },
  {
    title: 'partData.field.warehouse',
    dataIndex: 'warehouseCode',
    width: 100,
   
  },
  {
    title: 'ContactUnit.field.contactType',
    dataIndex: 'contactType',
    width: 100,
  },
  {
    title: 'ContactUnit.field.country',
    dataIndex: 'country',
    width: 150,
  },
  {
    title: 'ContactUnit.field.city',
    dataIndex: 'city',
    width: 100,
   
  },
  {
    title: 'ContactUnit.field.state',
    dataIndex: 'state',
    width: 100,
  },
  
  {
    title: 'ContactUnit.field.postcode',
    dataIndex: 'postcode',
    render: (text) => <span>{text}</span>,
    width: 200,
  },
  {
    title: 'ContactUnit.field.contact',
    dataIndex: 'contact',
    width: 120,
  },
  {
    title: 'ContactUnit.field.phone',
    dataIndex: 'phone',
    render: (text) => <span>{text}</span>,
    width: 100,
  },
  {
    title:'ContactUnit.field.address',
    dataIndex: 'address',
    width: 150,
  },
  {
    title: 'CargoOwner.field.createBy',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: 'CargoOwner.field.createTime',
    dataIndex: 'createTime',
    width: 200,
  },{
    title: 'CargoOwner.field.updateBy',
    dataIndex: 'updateBy',
    width: 100,
  },
  {
    title: 'CargoOwner.field.updateTime',
    dataIndex: 'updateTime',
    width: 200,
  },
  
  {
    title: 'CargoOwner.field.remarks',
    dataIndex: 'remarks',
    width: 200,
  },
 
];
