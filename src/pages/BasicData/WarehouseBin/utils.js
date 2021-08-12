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

export const typeStatus = [
  { code: 'RECEIVE', value: 'RECEIVE' },
  { code: 'STORAGE', value: 'STORAGE' },
  { code: 'PICKED', value: 'PICKED' },
  { code: 'SHIPPED', value: 'SHIPPED' },
  // { code: 'QUALITY', value: 'QUALITY' },
]
export const Status = [
  { code: 'ENABLE', value: '启用' },
  { code: 'ENABLED', value: '启用' },
  { code: 'DISABLE', value: '禁用' },
];
export const lockStatus = [
  { code: '0', value: 'Bin.field.unlock' },
  { code: '1', value: 'Bin.field.lock' },
];
export const isTrue = [
  { code: false, value: '否' },
  { code: true, value: '是' },
]
export const ExceptStatus=[
  { code: 1, value: 'Yes' },
  { code: 0, value: 'No' },
]
export const isDecimal = [
  { code: 'DECIMALISM', value: 'DECIMALISM' },
  { code: 'HEXADECIMAL', value: 'HEXADECIMAL' },
]

export const routeUrl = {
  add: '/basicData/warehouseBin/warehouseBinAdd',
  edit: '/basicData/warehouseBin/warehouseBinEdit',
};

export const allDispatchType = {
  //请求的url
  list: 'WarehouseBin/selectWarehouseBin',
  detail: 'WarehouseBin/viewWarehouseBin',
  operate: 'WarehouseBin/operateWarehouseBin',
  abled: 'WarehouseBin/abledWarehouseBin',
};
export const codes = {
  page: 'ENDORSELIST',
  disabled:'Bin_Management_Disable',
  enabled:'Bin_Management_Enable',
  add:'Bin_Management_Add',
  print:'Bin_Management_Print',
  printSmall:'Bin_Management_Print_Small_Lable',
  printBig:'Bin_Management_Print_Big_Lable',
  resetExcept:'Bin_Management_ResetException',
  addBatch:'Bin_Management_Add_Batch',
  edit:'Bin_Detail_Edit',
};

export function selectList({ payload = {}, props, typeUrl } = {}) {
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



export function saveAllValues({ payload = {}, props } = {}) {
  const { dispatch } = props;
  dispatch({
    type: 'WarehouseBin/allValus',
    payload,
  });
}

//时间判断：  date1:小日期   date2:大日期
export function DateMinus(date1, date2) {
  if (date1 && date2) {
    var sdate = new Date(date1);
    var now = new Date(date2);
    var days = Number(now.getTime()) - Number(sdate.getTime());
    var day = parseFloat(days / (1000 * 60 * 60 * 24));
    return day.toString();
  }
}

export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    //列名
    // title: transferLanguage('storeMange.code'),
    title: 'Bin.field.code',
    //对应后端返回的数据字段
    dataIndex: 'code',
    //在新增编辑中输入条件是否为必填
    rules: [
      {
        required: true,
        message: '规则名称为必填项',
      },
    ],
    //表格列的宽度
    width: 120,
    //是否显示顶部查询搜索，不写默认不显示搜索
    hideInSearch: false,
    //自定义 /baseDataManage/cargoOwnerAdd
    render: (text, record) => (
      <a onClick={() => router.push(`${routeUrl.edit}/${record.id}`)}>{text}</a>
    ),
  },
  {
    title: 'Bin.field.name',
    dataIndex: 'warehouseName',
    width: 120,
  },
  {
    title: 'Bin.field.warehouseAreaName',
    dataIndex: 'areaName',
    width: 120,
  },
  {
    title: 'PutAwayDetail.field.status',
    dataIndex: 'status',
    width: 120,
  },
  {
    title: 'Bin.field.exception',
    dataIndex: 'exceptionFlag',
    width: 120,
  render:(text)=>(<span>{text===1?'Abnormal ':'Normal'}</span>)
  },
  {
    title: 'Bin.field.typeCode',
    dataIndex: 'binType',
    width: 120,
  },
  {
    title: 'Bin.field.zoneNo',
    dataIndex: 'zoneNo',
    width: 120,
  },
  {
    title: 'Bin.field.lineNo',
    dataIndex: 'lineNo',
    width: 120,

  },
  {
    title: 'Bin.field.colNo',
    dataIndex: 'colNo',
    width: 120,

  },
  {
    title: 'Bin.field.layerNo',
    dataIndex: 'layerNo',
    //是否显示type为from时的输入框，不写默认显示（用在新增编辑）
    width: 120,
  },
  {
    title: 'Bin.field.routeNo',
    dataIndex: 'routeNo',
    width: 120,
  }, {
    title: 'Bin.field.inLock',
    dataIndex: 'inLock',
    render: (text) => (<span>{text === true ? 'true' : 'false'}</span>),
    width: 120,
  }, {
    title: 'Bin.field.outLock',
    dataIndex: 'outLock',
    render: (text) => (<span>{text === true ? 'true' : 'false'}</span>),

    width: 120,
  }, {
    title: 'Bin.field.countLock',
    dataIndex: 'countLock',
    render: (text) => (<span>{text === true ? 'true' : 'false'}</span>),

    width: 120,
  }, 
  {
    title: 'Bin.field.exceptionFlag',
    dataIndex: 'exceptionFlag',
    render: (text) => (<span>{text === true ? 'true' : 'false'}</span>),

    width: 120,
  }, {
    title: 'Bin.field.touchDate',
    dataIndex: 'touchDate',
    width: 120,
  },


  {
    title: 'Bin.field.useRate',
    dataIndex: 'useRate',
    width: 120,
  },
  {
    title: 'Bin.field.weight',
    dataIndex: 'weight',
    width: 120,
  }, {
    title: 'Bin.field.volume',
    dataIndex: 'volume',
    width: 120,
  }, {
    title: 'Bin.field.palletQty',
    dataIndex: 'palletQty',
    width: 120,
  },
  {
    title: 'Bin.field.boxQty',
    dataIndex: 'boxQty',
    width: 120,
  },
  {
    title: 'Bin.field.createBy',
    dataIndex: 'createBy',
    width: 120,
  },
  {
    title: 'Bin.field.createTime',
    dataIndex: 'createTime',
    width: 120,
  },
  {
    title: 'Bin.field.updateBy',
    dataIndex: 'updateBy',
    width: 120,
  },
  {
    title: 'Bin.field.updateTime',
    dataIndex: 'updateTime',
    width: 120,
  },
  {
    title: 'Bin.field.remarks',
    dataIndex: 'remarks',
    width: 120,
  },

];

export const columnsWare = [
  {
    title: 'Common.field.name',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: 'Common.field.code',
    dataIndex: 'code',
    width: 120,
  }
]
