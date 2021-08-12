import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import FileReader from '@/components/FileReader';
import StandardTable from '@/components/StandardTable';
import { transferLanguage } from '@/utils/utils';

import { formItemFragement, queryDict, queryPerson, formatPrice } from '@/utils/common';
import { allDictList, billStateOnlyReadList } from '@/utils/constans';
import { allDispatchType, selectDetailAndInfo } from './utils';

@connect(({ client, loading, component, i18n }) => ({
  selectDetails: client.selectDetails,
  selectListBinding: client.selectListBinding,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language,
}))
export default class IncidentalDetail extends Component {
  state = {};
  componentWillMount() {
    // 查询字典项
    // const allDict = [allDictList.otherFeeType, allDictList.currencyType];
    // queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const { detailId } = this.props;
    const id = detailId;
    if (!id) return;
    selectDetailAndInfo({
      type: allDispatchType.detail,
      payload: { id },
      props: this.props,
      callback: data => {},
    });
  }

  render() {
    const { loading, selectDetails, detailId, selectListBinding } = this.props;
    const {} = this.state;
    const detail = selectDetails[detailId] || {};

    const editPageParams = {
      panelValue: [
        { key: transferLanguage('Client.field.baseInfo', this.props.language) },
        { key: transferLanguage('Client.field.details', this.props.language) },
      ],
    };

    const formItem = [
      [
        <DetailPage
          label={transferLanguage('Client.field.code', this.props.language)}
          value={detail.code}
        />,
        <DetailPage
          label={transferLanguage('Client.field.name', this.props.language)}
          value={detail.name}
        />,
      ],
      [
        <DetailPage
          label={transferLanguage('Client.field.simpleName', this.props.language)}
          value={detail.simpleName}
        />,
        <DetailPage
          label={transferLanguage('Client.field.status', this.props.language)}
          value={detail.status}
        />,
      ],
      [
        <DetailPage
          label={transferLanguage('Client.field.classification', this.props.language)}
          value={detail.classification}
        />,
        <DetailPage
          label={transferLanguage('Client.field.remark', this.props.language)}
          value={detail.remarks}
        />,
      ],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
        <Fragment></Fragment>
      </EditPage>
    );
  }
}
