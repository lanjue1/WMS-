import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import moment from 'moment';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import FileReader from '@/components/FileReader';
import StandardTable from '@/components/StandardTable';

import { formItemFragement, queryDict, queryPerson, formatPrice } from '@/utils/common';
import { allDictList, billStateOnlyReadList } from '@/utils/constans';
import { allDispatchType, menuTypeData, selectDetailAndInfo, renderTableAdSelect } from './utils';
import { transferLanguage } from '@/utils/utils';


@connect(({ tmsOrg, loading, component }) => ({
  selectDetails: tmsOrg.selectDetails,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
}))
export default class MenulDetail extends Component {
  state = {};
  componentWillMount() {}

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
    const { loading, selectDetails, detailId } = this.props;
    const {} = this.state;
    const detail = selectDetails[detailId] || {};

    const editPageParams = {
      panelValue: [{ key: transferLanguage('OrgList.field.baseInfo', this.props.language) }],
    };

    const formItem = [
      [
        <DetailPage label={transferLanguage('OrgList.field.code', this.props.language)} value={detail.code} />,
        <DetailPage label={transferLanguage('OrgList.field.name', this.props.language)} value={detail.name} />,
      ],
      [
        <DetailPage label={transferLanguage('OrgList.field.bizType', this.props.language)} value={detail.bizType} />,
        <DetailPage label={transferLanguage('OrgList.field.parentName', this.props.language)} value={detail.parentName} />,
      ],
      [<DetailPage label={transferLanguage('OrgList.field.beActive', this.props.language)} value={detail.beActive ? '启用' : '禁用'} />],
      [<DetailPage label={transferLanguage('OrgList.field.remark', this.props.language)} value={detail.remarks} />],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
      </EditPage>
    );
  }
}
