import { func } from 'prop-types';

export const codes = {
  // select: 'ETCCHANGESELECT',
  // showDetail: 'ETCCHANGESELECT_VIEW',
  // add: 'ETCCHANGESELECT_ADD',
  // edit: 'ETCCHANGESELECT_UPD',
  // upload: 'ETCCHANGESELECT_IMPORT',
  page: 'EVENTSPAGE',
};
//通知方式
export const NoticeMode = [
  { code: 'DING-ORDINARY', value: '普通' },
  { code: 'DING-ROBOT', value: '钉钉群机器人' },
  { code: 'EMAIL', value: '邮件' },
];
//状态
export const Status = [{ code: true, value: '启用' }, { code: false, value: '禁用' }];
//请求类型
export const RequestType = [{ code: 'SEND', value: 'Common.field.send' }, { code: 'RECEIVE', value: 'Common.field.Receive' }];

//事件类型
export const EventType = [
  { code: 'INTERFACE-EXCEPTION', value: '接口异常' },
  { code: 'BUSINESS-REMINDERS', value: '业务提醒' },
];

export function formatStatus(n) {
  switch (n) {
    case true:
      return '启用';
      break;
    case false:
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
