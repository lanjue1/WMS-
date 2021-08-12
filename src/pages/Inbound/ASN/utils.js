import { Modal } from 'antd';
import { queryDictData, queryPerson } from '@/utils/common';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import { keyValue } from '@/utils/utils';
import router from 'umi/router';

const { confirm } = Modal;

export const codes = {
 
  page: 'ENDORSELIST',
  manual:'Putaway_Manual_Allocate',
  cancel:'Putaway_Cancel_Allocation',
  auto:'Putaway_Auto_Allocate',
  taskPutaway:'Putaway_Task_Putaway',
  print:'Putaway_Print'
};
// UNSEALED 草稿、 SUBMITTED 已提交、 CONFIRM 已确认  CANCEL 作废

export const currencyData = [
  { code: 'USD', value: 'USD' }, 
  { code: 'RMB', value: 'RMB' }, 
];

export const formType=['BaseInfo','Traning','Customs']
  
export const routeUrl = {
  add: '/inbound/moveDoc/moveDocAdd',
  edit: '/inbound/putaway/putawayEdit',
  
  
};

export const allDispatchType = {
  //请求的url selectManualAllot
  list: 'ASN/selectMoveDoc',
  detail: 'ASN/asnDetails',
};


export const SelectColumns = [
  {
    title:'Code',
    dataIndex:'code',
    width:80,
  },
  {
    title:'Name',
    dataIndex:'name',
    width:80,
  },
]



export const columnsBill = [
  {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => (<span>{index + 1}</span>),
      width: 50
  },
  {
      title:'结算单号',
      dataIndex: 'moveNo',
      //表格列的宽度
      width: 120,
      
    },
    {
      title: '状态',
      dataIndex: 'movedQuantity',
      width: 100,
    },
    {
      title: '费用类型',
      dataIndex: 'allocatedQuantity',
      width: 100,
    },
    {
      title: '费用编码',
      dataIndex: 'binCode',
      width: 120,
    },
    {
      title: '费用名称',
      dataIndex: 'cargoOwnerName',
      width: 120,
    },
    {
      title: '结算方式',
      dataIndex: 'controlStatus',
      width: 120,
    },
    {
      title: '计费日期',
      dataIndex: 'coo',
      width: 120,
    },
    // {
    //   title: 'destCargoOwnerId',
    //   dataIndex: 'destCargoOwnerId',
    //   width: 120,
    // },
    {
      title: '结算单位',
      dataIndex: 'invoiceNo',
      width: 120,
    },
    {
      title: '计费类型',
      dataIndex: 'partName',
      width: 120,
    },{
      title: '计费单号',
      dataIndex: 'partStatus',
      width: 120,
    },{
      title: '单价',
      dataIndex: 'lotInfo',
      width: 120,
    },

    {
      title: '币种',
      dataIndex: 'lotLocation',
      width: 120,
    },{
      title: '数量',
      dataIndex: 'lotNo',
      width: 120,
    },{
      title: '金额',
      dataIndex: 'soi',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'toBinCode',
      width: 120,
    },{
      title: '更新时间',
      dataIndex: 'uom',
      width: 120,
    },{
      title: '更新人',
      dataIndex: 'vendorCode',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'vendorName',
      width: 150,
    },{
      title: '创建人',
      dataIndex: 'warehouseName',
      width: 120,
    },

];



export const columnsPackage = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: '箱号/板号',
    dataIndex: 'containerNo',
    width: 150,
  },
  {
    title: '收货状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '上架状态',
    dataIndex: 'putawayStauts',
    width: 100,
  },

  {
    title: '类型',
    dataIndex: 'containerType',
    width: 100,
  },
  {
    title: '采购单号',
    dataIndex: 'poNo',
    width: 150,
  },
  // {
  //   title: 'destCargoOwnerName',
  //   dataIndex: 'destCargoOwnerName',
  //   width: 150,
  // },
  {
    title: '明细单号',
    dataIndex: 'asnDetailId',
    width: 150,
  },
  {
    title: '板号',
    dataIndex: 'palletNo',
    width: 100,
  },
  // {
  //   title: '箱数',
  //   dataIndex: 'partName',
  //   width: 100,
  // },

  {
    title: 'PCS',
    dataIndex: 'planPcsQty',
    width: 100,
    render:(text,record)=>(<span>{text} | {record.actualPcsQty}</span>)
  }, {
    title: '长(CM)',
    dataIndex: 'length',
    width: 100,
  }, {
    title: '宽(CM)',
    dataIndex: 'width',
    width: 100,
  }, {
    title: '高(CM)',
    dataIndex: 'hight',
    width: 100,
  }, {
    title: '体积(CBM)',
    dataIndex: 'volume',
    width: 100,
  }, {
    title: '毛重(KG',
    dataIndex: 'grossWeight',
    width: 100,
  },
  // {
  //   title: '净重(KG)',
  //   dataIndex: 'movedQuantity',
  //   width: 100,
  // },

  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 100,
  },
  {
    title: '更新人',
    dataIndex: 'updateBy',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 100,
  }, {
    title: '创建人',
    dataIndex: 'createBy',
    width: 100,
  },
];



