import React, { Fragment } from 'react';
import { Icon, Modal, Row, Col } from 'antd';
import prompt from '@/components/Prompt';
import { editCol, editGutter, listCol, editRow, _PageSize } from '@/utils/constans';

import AdSelect from '@/components/AdSelect';

export function getPageSize(PageSize) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return _PageSize;
  return PageSize ? PageSize :
    Number(localStorage.getItem(`${user.loginName}_pageSize`)) || _PageSize;
  // return Number(localStorage.getItem(`${user.loginName}_pageSize`)) === 500
  //   ? 100
  //   : PageSize?PageSize:
  //   Number(localStorage.getItem(`${user.loginName}_pageSize`)) || _PageSize;
}

export function queryDictData({
  dispatch,
  type = 'component/querytDictByCode',
  payload = {},
  iExist = false,
}) {
  !iExist &&
    dispatch({
      type,
      payload,
    });
}

//检查图片类型
export function checkSuffix(str) {
  var strRegex = '(.jpg|.png|.gif|.bmp|.jpeg)$';
  var re = new RegExp(strRegex);
  if (re.test(str.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}

export function queryFileList({ props, params, url = 'attachment/selectFileList', callback }) {
  const { dispatch } = props;
  dispatch({
    type: 'component/queryComponentList',
    payload: { params, url },
    callback: data => {
      if (!data) return;
      callback && callback(data);
    },
  });
}

export function queryDict({ props, allDict }) {
  const { dispatch, dictObject } = props;
  allDict.map(v => {
    queryDictData({
      dispatch,
      payload: { code: v },
      isExist: dictObject[v],
    });
  });
}

//用户类表数据回显
export function queryPerson({
  props,
  data,
  url,
  key = 'loginName',
  labels = ['updateBy', 'createBy', 'commitBy'],
}) {
  const { dispatch, searchValue } = props;
  let valueList = [];
  data.map(v => {
    labels.map(item => {
      if (v[item] && !valueList.includes(v[item])) {
        valueList.push(v[item]);
        !searchValue[v[item]] &&
          dispatch({
            type: 'component/querySearchValue',
            payload: { params: { [key]: v[item] }, url },
          });
      }
    });
  });
}

/**
 * 校验具体逻辑判断
 */
export function vitifyCheck({ key, warn, selectedRows }) {
  let value = selectedRows.map(v => v[key]);
  value = Array.from(new Set(value));
  if (value.length > 1) {
    prompt({ title: '温馨提示', content: warn, type: 'warn' });
    return null;
  }
  return value;
}

export function formItemFragement(formItem) {
  return (
    <Fragment>
      {formItem.map((item, index) => {
        return (
          <Row gutter={editGutter} key={index}>
            {item &&
              item.map((v, i) => {
                const colSpan = item.length === 1 ? editRow : item.length === 2 ? editCol : listCol;
                return (
                  <Col {...colSpan} key={index + i}>
                    {v}
                  </Col>
                );
              })}
          </Row>
        );
      })}
    </Fragment>
  );
}

export function filterAddFile(fileList) {
  if (!fileList) return [];
  // const newFileList=fileList.map(v=>{
  //   if(v.fileToken){
  //     return v.fileToken
  //   }else{
  //     return v.response.data
  //   }
  // })
  const newFileList = fileList
    .filter(file => file.response && file.response.code == 0)
    .map(v => v.response.data);
  return newFileList
}

export function filterDeteteFile(newFileList, oldFileList) {
  return oldFileList
    .filter(
      item =>
        !newFileList
          .filter(item => !item.response)
          .map(v => v.id)
          .includes(item.id)
    )
    .map(item => item.id);
}

export function renderTableAdSelect({ key, data, value, props }) {
  let params = { onlyRead: true, value };
  if (key) {
    const { dictObject } = props;
    params = { data: dictObject[key], payload: { code: [key] }, ...params };
  } else {
    params = { data, ...params };
  }
  return <AdSelect {...params} />;
}

//时间格式化
export const formateDateToMin = 'YYYY-MM-DD HH:mm';
export const formateDateToSec = 'YYYY-MM-DD HH:mm:ss';

// 金额相关的格式化 ： 保留两位小数
export function formatPrice(text) {
  const val = text ? (text && Number(text) !== 0 ? Number(text).toFixed(2) : 0) : '';
  return val;
}

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

//检查附件显示类型
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
          !checkFile ? (
          <a target="_blank" href={_href}>
            <Icon type="link" style={{ marginRight: 8 }} />
          </a>
          ) : (
          <a target="_blank" href={_href}>
            <Icon type="picture" style={{ marginRight: 8 }} />
          </a>
          )}
        </span>
      );
      return _html;
    });
  }
  return null;
}
//截取路由参数
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
//获取当前日期： YY-MM-DD HH:MM:SS
export function getNowFormatDate() {
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

export function formatCodeVal(data, value) {
  let text = value;
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(v => {
      if (v.code === value) {
        text = v.value;
      }
    });
  }
  return text;
}

export const allDictList = {
  COUNTRY: 'COUNTRY',
  MESSAGE_SOURCE_TYPE: 'MESSAGE_SOURCE_TYPE',
  currency: 'currency',
  WMS_ASN_STATUS: 'WMS_ASN_STATUS',
  WMS_ASN_PUTAWAY_STATUS: 'WMS_ASN_PUTAWAY_STATUS',
  WMS_PRIORITY: 'WMS_PRIORITY',
  WMS_ORDER_TYPE: 'WMS_ORDER_TYPE',
  WMS_PO_BILL_TYPE: 'WMS_PO_BILL_TYPE',
  WMS_PO_REGULATION_TYPE: 'WMS_PO_REGULATION_TYPE',
  WMS_PO_DECLARATION_STATUS: 'WMS_PO_DECLARATION_STATUS',
  WMS_PO_PRIORITY: 'WMS_PO_PRIORITY',
  WMS_ORDER_SOURCE: 'WMS_ORDER_SOURCE',
  WMS_PO_ORDER_SOURCE: 'WMS_PO_ORDER_SOURCE',
  WMS_PO_TRANSPORT_STATUS: 'WMS_PO_TRANSPORT_STATUS',
  WMS_PO_DECLARATION_MODE: 'WMS_PO_DECLARATION_MODE',
  WMS_PO_TRADE_CLAUSE: 'WMS_PO_TRADE_CLAUSE',
}
