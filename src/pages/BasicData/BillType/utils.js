import { func } from 'prop-types';
import AdSelect from "@/components/AdSelect";

export const codes = {
  page: 'EVENTSPAGE',
  disabled:'Bill_Type_Management_Disable',
  enable:'Bill_Type_Management_Enable',
  
};
//通知方式
export const NoticeMode = [
  { code: 'DING-ORDINARY', value: '普通' },
  { code: 'DING-ROBOT', value: '钉钉群机器人' },
  { code: 'EMAIL', value: '邮件' },
];
//状态
export const Status = [{ code: 'ENABLE', value: 'Common.field.enable' }, { code: 'DISABLE', value: 'Common.field.disable' }];
//请求类型
export const RequestType = [{ code: 'SEND', value: '发送' }, { code: 'RECEIVE', value: '接收' }];

//事件类型
export const EventType = [
  { code: 'INTERFACE-EXCEPTION', value: '接口异常' },
  { code: 'BUSINESS-REMINDERS', value: '业务提醒' },
];

export const columns1 = [
  {
    title: 'sequenceType',
    dataIndex: 'sequenceType',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 80,
  },
  {
    title: 'fix',
    dataIndex: 'fix',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 80,
  },
];

export function formatStatus(n) {
  switch (n) {
    case 'ENABLE':
      return '启用';
      break;
    case 'DISABLED':
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
