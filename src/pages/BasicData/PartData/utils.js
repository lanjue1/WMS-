import { func } from 'prop-types';
import AdSelect from '@/components/AdSelect';

export const codes = {
  page: 'EVENTSPAGE',
  disabled:'Part_Data_Management_Disable',
  enable:'Part_Data_Management_Enable',
  printPN:'Part_Data_Management_Print_PartNo',
  add:'Part_Data_Management_Add',
  edit:'Part_Data_Detail_Edit',
  
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
// 仓库数据
// export const warehouseColumns = [
//   {
//     title: 'id',
//     dataIndex: 'id',
//     render: text => <AdSelect value={text} onlyRead={true} />,
//     width: 80,
//   },
//   {
//     title: 'name',
//     dataIndex: 'name',
//     render: text => <AdSelect value={text} onlyRead={true} />,
//     width: 80,
//   },
// ];
// 料号类型
export const itemTypeColumns = [
  {
    title: 'id',
    dataIndex: 'id',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 80,
  },
  {
    title: 'Common.field.name',
    dataIndex: 'name',
    render: text => <AdSelect value={text} onlyRead={true} />,
    width: 80,
  },
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
