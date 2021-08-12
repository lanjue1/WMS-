import { Icon, Modal } from 'antd';
import prompt from '@/components/Prompt';
import { formItemFragement, queryDict ,formatPrice} from '@/utils/common';


//验证输入的字符长度：
export function checkStrLength(rule, value, callback, num, text) {
  if (value && value.length >= num) {
    prompt({
      content: `"${text}"输入的字数不能超过${num}位`,
      title: '温馨提示',
      duration: 2,
      type: 'warn',
    });
    callback('输入字数不能超过' + num + '位');
  } else {
    callback();
  }
}

export function checkSuffix(str) {
  // jpg,.jpeg,.png,.gif,,.bmp
  var strRegex = '(.jpg|.png|.gif|.bmp|.jpeg)$';
  var re = new RegExp(strRegex);
  if (re.test(str.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}

export function formatFile(text, url) {
  const _url = url ? url : 'tms/tms-attachment';
  if (Array.isArray(text) && text.length > 0) {
    return text.map(v => {
      const fileName = v.fileUrl.substring(v.fileUrl.lastIndexOf('.'), v.fileUrl.length);
      const checkFile = checkSuffix(fileName);
      const _href = `/server/api/${_url}/readFile?path=${v.fileUrl}&token=${localStorage.getItem(
        'token'
      )}`;
      const _html = (
        <span>
          {// v.fileUrl.substring(v.fileUrl.lastIndexOf('.'), v.fileUrl.length) === '.pdf'
          !checkFile ? (
            <a target="_blank" href={_href}>
              <Icon type="link" style={{ marginRight: 8 }} />
            </a>
          ) : (
            <a target="_blank" href={_href}>
              {/* // <a href="javascript:void(0)" onClick={showImg}> */}
              <Icon type="picture" style={{ marginRight: 8 }} />
              {/* <Modal
                visible={visibleImg}
                footer={null}
                // onCancel={handleCancel}
              >
                <img alt="example" style={{ width: '100%' }} src={_href} />
              </Modal> */}
            </a>
          )}
        </span>
      );
      return _html;
    });
  }
  return null;
}
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
export function getNowFormatDate() {
  // let date = new Date();
  // let seperator1 = '-';
  // let year = date.getFullYear();
  // let month = date.getMonth() + 1;
  // let strDate = date.getDate();
  // if (month >= 1 && month <= 9) {
  //   month = '0' + month;
  // }
  // if (strDate >= 0 && strDate <= 9) {
  //   strDate = '0' + strDate;
  // }
  // let currentdate = year + seperator1 + month + seperator1 + strDate;
  // return currentdate;

  var date = new Date();
  var seperator1 = '-';
  var seperator2 = ':';
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  var strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var currentdate =
    date.getFullYear() +
    seperator1 +
    month +
    seperator1 +
    strDate +
    ' ' +
    date.getHours() +
    seperator2 +
    date.getMinutes() +
    seperator2 +
    date.getSeconds();
  return currentdate;
}
export function formatYesOrNo(n) {
  switch (n) {
    case true:
      return '是';
      break;
    case false:
      return '否';
      break;
    default:
      return '';
  }
}
//数值保留两位小数：
export function formarNumToFixed(val) {
  let _val = '';
  if (val) {
    _val = Number(val).toFixed(2);
  }
  return _val;
}
//车辆
export const columns1 = [
  {
    title: '主车牌',
    dataIndex: 'cartPlateOneNo',
    width: '25%',
  },
  {
    title: '副车牌',
    dataIndex: 'cartPlateTwoNo',
    width: '25%',
  },
  {
    title: '所属公司',
    dataIndex: 'ownCompanyName',
    width: '50%',
    render: text => <span title={text}>{text}</span>,
  },
];
//车辆
export const columns2 = [
  {
    title: '车次',
    dataIndex: 'shipmentNo',
    width: '25%',
  },
  {
    title: '路线',
    dataIndex: 'lineName',
    width: '25%',
  },
  {
    title: '价格',
    dataIndex: 'payStandardLineCost',
    width: '15%',
    render: text => <span title={text}>{formatPrice(text)}</span>,
  },
  {
    title: '计划发车时间',
    dataIndex: 'planStartTime',
    width: '35%',
    render: text => <span title={text}>{text}</span>,
  },
];
export const columnsEtcCard = [
  {
    title: '卡号',
    dataIndex: 'cardNo',
    width: '30%',
  },
  {
    title: '车牌号',
    dataIndex: 'cartPlateNo',
    width: '25%',
  },
  {
    title: '所属公司',
    dataIndex: 'ownCompanyName',
    width: '45%',
    render: text => <span title={text}>{text}</span>,
  },
];
export const columnsDriver = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: '25%',
  },
  {
    title: '工号',
    dataIndex: 'No',
    width: '25%',
  },
  {
    title: '所属公司',
    dataIndex: 'mdsCompanyName',
    render: text => <span title={text}>{text}</span>,
    // width: '33.3%',
  },
];
export const columnsBank = [
  {
    title: '卡号',
    dataIndex: 'id',
    width: '50%',
  },
  {
    title: '开户行',
    dataIndex: 'name',
  },
];
export const columnsIC = [
  {
    title: 'IC卡号',
    dataIndex: 'name',
    width: '15%',
  },
  {
    title: '别名',
    dataIndex: 'alias',
    width: '15%',
  },

  {
    title: '类型',
    dataIndex: 'type',
    // width: '20%',
  },
];
export const columnsUser = [
  {
    title: '用户名',
    dataIndex: 'sysName',
    width: '33.3%',
  },
  {
    title: '登录账号',
    dataIndex: 'loginName',
    width: '33.3%',
  },

  {
    title: '所属业务组织',
    dataIndex: 'orgName',
  },
];
export const supplierColumns = [
  {
    title: '公司名称',
    dataIndex: 'customerName',
    width: '50%',
  },
  {
    title: '公司代码',
    dataIndex: 'customerCode',
  },
];
export const columnsBillNo = [
  {
    title: '账单号',
    dataIndex: 'billNo',
    width: '100%',
  },
];
export const columnsRole = [
  {
    title: '角色代码',
    dataIndex: 'code',
    width: '33.3%',
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    width: '33.3%',
  },
  {
    title: '状态',
    dataIndex: 'beActive',
    render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
  },
];

export function formatCodeVal(data, value, show = { id: 'code', name: 'value' }) {
  let text = value;
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(v => {
      if (v[show.id] === value) {
        text = v[show.name];
      }
    });
  }
  return text;
}
