import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import FileReader from '@/components/FileReader';
import RelationInfo from './RelationInfo';
import { formItemFragement, queryDict, queryPerson, formatPrice } from '@/utils/common';
import { allDictList, billStateOnlyReadList } from '@/utils/constans';
import {
  renderTableAdSelect,
  dynamicTableStatusList,
  allUrl,
  allDispatchType,
  selectDynamicTableDetailAndInfo,
  statusList,
} from './utils';

@connect(({ dynamicTableVersions, loading, component }) => ({
  dynamicTableDetail: dynamicTableVersions.dynamicTableDetail,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
}))
export default class DynamicTableDetail extends Component {
  state = {};
  componentWillMount() {
    // 查询字典项
    // const allDict = [allDictList.mysqlType];
    // queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const { detailId } = this.props;
    const id = detailId;
    if (!id) return;
    selectDynamicTableDetailAndInfo({
      type: allDispatchType.detail,
      payload: { id },
      props: this.props,
      callback: data => {
        selectDynamicTableDetailAndInfo({
          type: allDispatchType.fildList,
          payload: { tableName: data.name },
          props: this.props,
        })
      },
    });
  }



  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };

  render() {
    const { loading, dynamicTableDetail, detailId } = this.props;
    const { } = this.state;
    const detail = dynamicTableDetail[detailId] || {};

    const editPageParams = {
      panelValue: [{ key: '基础信息' }, { key: '字段信息' }],
    };

    const formItem = [
      [
        <DetailPage label="表名" value={detail.name} />,
        <DetailPage
          label="状态"
          value={renderTableAdSelect({
            props: this.props,
            value: detail.status,
            data: statusList,
          })}
        />,
      ],
      [
        <DetailPage label="字段数" value={detail.fieldCount} />,
        <DetailPage label="数据量" value={detail.dataCount} />,
      ],
      [<DetailPage label="有效期" value={`${detail.startDate} ~ ${detail.endDate}`} />, <></>],
      [<DetailPage label="备注" value={detail.remarks} />],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
        <Fragment>
          <RelationInfo curId={detail.name || ''} onlyRead={true} mode="detail" disabled={true} />
        </Fragment>
      </EditPage>
      
    );
  }
}
