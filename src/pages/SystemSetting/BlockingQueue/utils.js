import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';

export const routeUrl = {
  add: '/outbound/load/AddLoad',
  edit: '/outbound/load/editLoad',
};
export const SelectColumns = [
  {
    title:'BillTypeList.field.code',
    dataIndex:'code',
    width:120,
  },
  {
    title:'BillTypeList.field.name',
    dataIndex:'name',
    width:150,
  },
]

export const allDispatchType = {
  //请求的url
  list: 'blockQueue/blockQueueList',
  
  
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

export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
},
  {
    title:'BlockQueue.field.referenceCode',
    dataIndex: 'referenceCode',
    width: 100,
    // render: (text, record) => (
    //   <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    // ),
  },
  {
    title: 'BlockQueue.field.soId',
    dataIndex: 'soId',
    width: 120,
  },
  {
    title: 'BlockQueue.field.status',
    dataIndex: 'status',
    width: 100,
   
  },
  {
    title:'BlockQueue.field.type',
    dataIndex: 'type',
    width: 100,
  },
  {
    title:'BlockQueue.field.part',
    dataIndex: 'partId',
    width: 100,
  },
  {
    title: 'BlockQueue.field.quantity',
    dataIndex: 'quantity',
    width: 100,
  },
  {
    title: 'BlockQueue.field.warehouse',
    dataIndex: 'warehouseCode',
    width: 100,
  },
  
];
