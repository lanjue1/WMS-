import React, { Component } from 'react';
import { Modal } from 'antd';
const { confirm } = Modal;
export default function AdConfirm({ title = '确定要删除吗？', onOk }) {
  confirm({
    title,
    content: ' ',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    onOk: onOk,
  });
}
