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

@connect(({ tmsAuth, loading, component, i18n }) => ({
  selectDetails: tmsAuth.selectDetails,
  selectListBinding: tmsAuth.selectListBinding,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language
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
      callback: data => { },
    });
  }
  columns = [
    {
      title: transferLanguage('AuthList.field.code', this.props.language),
      dataIndex: 'code',
    },
    {
      title: transferLanguage('AuthList.field.name', this.props.language),
      dataIndex: 'name',
    },
    {
      title: transferLanguage('AuthList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
    },
    {
      title: transferLanguage('AuthList.field.remark', this.props.language),
      dataIndex: 'remark',
    },
  ];

  render() {
    const { loading, selectDetails, detailId, selectListBinding } = this.props;
    const { } = this.state;
    const detail = selectDetails[detailId] || {};

    const editPageParams = {
      panelValue: [{ key: transferLanguage('AuthList.field.baseInfo', this.props.language) }, { key: transferLanguage('AuthList.field.details', this.props.language) }],
    };

    const formItem = [
      [
        <DetailPage label={transferLanguage('AuthList.field.loginName', this.props.language)} value={detail.loginName} />,
        <DetailPage label={transferLanguage('AuthList.field.sysName', this.props.language)} value={detail.sysName} />,
      ],
      [
        <DetailPage label={transferLanguage('AuthList.field.orgId', this.props.language)} value={detail.orgName} />,
        <DetailPage label={transferLanguage('AuthList.field.mobile', this.props.language)} value={detail.mobile} />,
      ],
      [<DetailPage label={transferLanguage('AuthList.field.beActive', this.props.language)} value={detail.beActive ? '启用' : '禁用'} />, <></>],
      [<DetailPage label={transferLanguage('AuthList.field.remark', this.props.language)} value={detail.remarks} />],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
        <Fragment>
          <StandardTable
            disabledRowSelected={true}
            loading={loading}
            data={selectListBinding}
            columns={this.columns}
            scrollY={200}
            scrollX={500}
          />
        </Fragment>
      </EditPage>
    );
  }
}
