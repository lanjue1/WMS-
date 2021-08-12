import moment from 'moment';
import AdSelect from '@/components/AdSelect';
import {  Badge } from 'antd';


export const codes = {
  // select: 'ETCCHANGESELECT',
  // showDetail: 'ETCCHANGESELECT_VIEW',
  // add: 'ETCCHANGESELECT_ADD',
  // edit: 'ETCCHANGESELECT_UPD',
  // upload: 'ETCCHANGESELECT_IMPORT',
  page: 'MSGCONTENTPAGE',
};
export const SelectColumns=[
    {
        title:'Common.field.code',
        dataIndex:'businessTypeCode',
        width:120,
      },
      {
        title:'Common.field.name',
        dataIndex:'businessTypeName',
        width:150,
      },
]
//事件类型
export const EventType = [
  { code: 'INTERFACE-EXCEPTION', value: '接口异常' },
  { code: 'BUSINESS-REMINDERS', value: '业务提醒' },
];

export const statusMap = {
  'FAIL': 'error',
  'LOADFAIL': 'error',
  'READY': 'processing',
  'OPEN': 'processing',
  'NOTlOAD': 'processing',
  'SUCCESS': 'success',
};

//状态
export const STATUS = [
  { code: 'READY', value: 'Content.field.ready' },
  { code: 'OPEN', value: 'Content.field.OPEN' },
  { code: 'SUCCESS', value: 'Content.field.success' },
  { code: 'FAIL', value: 'Content.field.fail' },
  { code: 'IGNORE', value: 'Content.field.IGNORE' },
 
];

//通知方式
export const NoticeMode = [
  { code: 'DING-ORDINARY', value: '普通' },
  { code: 'DING-ROBOT', value: '钉钉群机器人' },
  { code: 'EMAIL', value: '邮件' },
];

export const columns = [
  {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
    },
  {
      title: 'Content.field.businessCode',
      dataIndex: 'businessCode',
      render: (text, record) => <a onClick={e => this.showDetail(e, record)} title={text}>
          {text}
      </a>,
      width: 200,
  },
  {
      title: 'Content.field.businessId',
      dataIndex: 'businessId',
      render: text => <span title={text}>{text}</span>,
      width: 250,
  },
  {
      title: 'Content.field.businessTypeCode',
      dataIndex: 'businessTypeCode',
      render: text => <span title={text}>{text}</span>,
      width: 200,
  },
  {
      title: 'Content.field.businessType',
      dataIndex: 'businessType',
      render: text => <span title={text}>{text}</span>,
      width: 200,
  },
  
  {
      title: 'Content.field.senderSys',
      dataIndex: 'senderSys',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'Content.field.receiverSys',
      dataIndex: 'receiverSys',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'Content.field.dealStatus',
      dataIndex: 'dealStatus',
      render: (text) => {
          const val = <AdSelect data={STATUS} value={text} onlyRead={true} />;
          return <Badge status={statusMap[text]} text={val} />
      },
      width: 100,
  },
  {
      title: 'Content.field.requestData',
      dataIndex: 'requestData',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'Content.field.responseData',
      dataIndex: 'responseData',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'Content.field.retryCount',
      dataIndex: 'retryCount',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'Content.field.execTime',
      dataIndex: 'execTime',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'Content.field.createBy',
      dataIndex: 'createBy',
      render: text => <AdSelect data={NoticeMode} value={text} onlyRead={true} />,
  },
  {
      title: 'Content.field.createTime',
      dataIndex: 'createTime',
      render: text => <span title={text}>{text}</span>,
  },

  {
      title: 'Content.field.updateBy',
      dataIndex: 'updateBy',
      render: text => <span title={text}>{text}</span>,
  },
  {
      title: 'Content.field.updateTime',
      dataIndex: 'updateTime',
      render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : ''}</span>,
  },
];