import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import FileReader from '@/components/FileReader';

import { formItemFragement, queryDict, queryPerson, formatPrice } from '@/utils/common';
import { allDictList, billStateOnlyReadList } from '@/utils/constans';
import {
  renderTableAdSelect,
  dynamicDataStatusList,
  allUrl,
  allDispatchType,
  selectDynamicDataDetailAndInfo,
} from './utils';

@connect(({ dynamicData, loading, component }) => ({
  dynamicDataDetail: dynamicData.dynamicDataDetail,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
}))
export default class DynamicDataDetail extends Component {
  state = {};
  componentWillMount() {
    // 查询字典项
    const allDict = [allDictList.mysqlType];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const { detailId } = this.props;
    const id = detailId;
    if (!id) return;
    selectDynamicDataDetailAndInfo({
      type: allDispatchType.detail,
      payload: { id },
      props: this.props,
      callback: data => {},
    });
  }

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };

  render() {
    const { loading, dynamicDataDetail, detailId } = this.props;
    const {} = this.state;
    const detail = dynamicDataDetail[detailId] || {};

    const editPageParams = {
      panelValue: [{ key: '基础信息' }],
    };

    const formItem = [
      [
        <DetailPage label="数据库名称" value={detail.pollName} />,
        <DetailPage
          label="数据库类型"
          value={renderTableAdSelect({
            props: this.props,
            value: detail.type,
            key: allDictList.mysqlType,
          })}
        />,
      ],
      [
        <DetailPage label="账号" value={detail.username} />,
        <DetailPage label="密码" value={detail.password} />,
      ],
      [
        // <DetailPage label="数据库驱动" value={detail.trainName} />,
        <DetailPage label="数据库连接" value={detail.url} />,
      ],
      [<DetailPage label="备注" value={detail.remarks} />],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
      </EditPage>
    );
  }
}
