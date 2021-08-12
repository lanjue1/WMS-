import { func } from 'prop-types';

export const codes = {
  disabled:'Warehouse_Management_Disabled',
  enable:'Warehouse_Management_Enable',
  add:'Warehouse_Management_Add',
  edit:'Warehouse_Detail_Edit',
  page: 'EVENTSPAGE',
};
//通知方式
export const NoticeMode = [
  { code: 'DING-ORDINARY', value: '普通' },
  { code: 'DING-ROBOT', value: '钉钉群机器人' },
  { code: 'EMAIL', value: '邮件' },
];
//状态
export const Status = [{ code: 'ENABLE', value: '启用' }, { code: 'DISABLE', value: '禁用' }];
//请求类型
export const RequestType = [{ code: 'SEND', value: '发送' }, { code: 'RECEIVE', value: '接收' }];

//事件类型
export const EventType = [
  { code: 'INTERFACE-EXCEPTION', value: '接口异常' },
  { code: 'BUSINESS-REMINDERS', value: '业务提醒' },
];

export function formatStatus(n) {
  switch (n) {
    case 'ENABLE':
      return '启用';
      break;
    case 'DISABLE':
      return '禁用';
      break;
    default:
      return '';
  }
}

export function formatRequestType(n) {
  switch (n) {
    case 'SEND':
      return '发送';
      break;
    case 'RECEIVE':
      return '接收';
      break;
    default:
      return '';
  }
}

export const columns1 = [
  {
    title: 'Code',
    dataIndex: 'code',
    render: text => <span>{text}</span>,
    width: 80
  },
  {
    title: 'Name',
    dataIndex: 'name',
    render: text => <span>{text}</span>,
    width: 80
  }
]