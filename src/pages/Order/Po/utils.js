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
  manual: 'Putaway_Manual_Allocate',
  cancel: 'Putaway_Cancel_Allocation',
  auto: 'Putaway_Auto_Allocate',
  taskPutaway: 'Putaway_Task_Putaway',
  print: 'Putaway_Print'
};
// UNSEALED 草稿、 SUBMITTED 已提交、 CONFIRM 已确认  CANCEL 作废

export const currencyData = [
  { code: 'USD', value: 'USD' },
  { code: 'RMB', value: 'RMB' },
];

export const status = [
  { code: 'confirm', value: '待确认' },
  { code: 'confirmed', value: '已确认' },
  { code: 'processing', value: '进行中' },
  { code: 'confirm', value: '已完成' },
];

export const formType = ['BaseInfo', 'Traning', 'Customs']

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
    title: 'Code',
    dataIndex: 'code',
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'shortName',
    width: 80,
  },
]

export const typeColumns=[
  {
    title: 'Code',
    dataIndex: 'code',
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 80,
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
    title: '结算单号',
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
  }, {
    title: '计费单号',
    dataIndex: 'partStatus',
    width: 120,
  }, {
    title: '单价',
    dataIndex: 'lotInfo',
    width: 120,
  },

  {
    title: '币种',
    dataIndex: 'lotLocation',
    width: 120,
  }, {
    title: '数量',
    dataIndex: 'lotNo',
    width: 120,
  }, {
    title: '金额',
    dataIndex: 'soi',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'toBinCode',
    width: 120,
  }, {
    title: '更新时间',
    dataIndex: 'uom',
    width: 120,
  }, {
    title: '更新人',
    dataIndex: 'vendorCode',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'vendorName',
    width: 150,
  }, {
    title: '创建人',
    dataIndex: 'warehouseName',
    width: 120,
  },

];


export const columnsParts = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: '明细单号',
    dataIndex: 'lineNo',
    width: 150,
  },
  {
    title: '收货状态',
    dataIndex: 'status',
    width: 100,
  },
  {
    title: '货主',
    dataIndex: 'putawayStauts',
    width: 100,
  },
  {
    title: '料号',
    dataIndex: 'qualityTag',
    //表格列的宽度
    width: 100,
  },

  {
    title: '料号描述',
    dataIndex: 'beSn',
    width: 100,
  },

  {
    title: '货物类型',
    dataIndex: 'cargoOwnerId',
    width: 120,
  },

  {
    title: '供应商编码',
    dataIndex: 'lotVendorCode',
    width: 100,
  },
  {
    title: '供应商',
    dataIndex: 'lotVendorName',
    width: 100,
  },
  {
    title: '供应料号',
    dataIndex: 'lotVendorPart',
    width: 100,
  },
  {
    title: '预计|实际PCS',
    dataIndex: 'planPcsQty',
    width: 120,
    render: (text, record) => (<span>{text} | {record.actualPcsQty}</span>)
  },
  {
    title: '预计|实际内包装数',
    dataIndex: 'planInnerQty',
    width: 120,
    render: (text, record) => (<span>{text} | {record.actualInnerQty}</span>)
  },

  {
    title: '预计|实际箱数',
    dataIndex: 'planBoxQty',
    width: 120,
    render: (text, record) => (<span>{text} | {record.actualBoxQty}</span>)

  },
  {
    title: '预计|实际板数',
    dataIndex: 'planPalletQty',
    width: 120,
    render: (text, record) => (<span>{text} | {record.actualPalletQty}</span>)

  },
  {
    title: '预计 | 实际体积(CBM)',
    dataIndex: 'planVolume',
    width: 120,
    render: (text, record) => (<span>{text} | {record.actualVolume}</span>)

  },
  {
    title: '预计 | 实际毛重(KG)',
    dataIndex: 'planGrossWeight',
    width: 120,
    render: (text, record) => (<span>{text} | {record.actualGrossWeight}</span>)

  }, {
    title: '预计 | 实际净重(KG)',
    dataIndex: 'planNetWeight',
    width: 120,
    render: (text, record) => (<span>{text} | {record.actualNetWeight}</span>)

  },
  {
    title: '币种',
    dataIndex: 'lotCurrency',
    width: 120,
  },
  {
    title: '单价',
    dataIndex: 'lotUnitPrice',
    width: 100,
  },
  {
    title: '原产国',
    dataIndex: 'lotCoo',
    width: 100,
  },
  {
    title: 'Plant',
    dataIndex: 'lotPlant',
    width: 100,
  },
  {
    title: 'Location',
    dataIndex: 'lotSapLocation',
    width: 100,
  },

  {
    title: 'DN',
    dataIndex: 'lotDnNo',
    width: 100,
  },
   /*  {
      title: '送检时间',
      dataIndex: 'inspectTime',
      width: 100,
    },
    {
      title: '还检时间',
      dataIndex: 'inspectFinishedTime',
      width: 100,
    }, */{
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 100,
  }, {
    title: '更新人',
    dataIndex: 'updateBy',
    width: 100,
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    width: 100,
  },

];




