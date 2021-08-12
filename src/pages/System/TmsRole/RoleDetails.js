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

@connect(({ tmsRole, loading, component, i18n }) => ({
  selectDetails: tmsRole.selectDetails,
  selectListBinding: tmsRole.selectListBinding,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language
}))
export default class RoleDetail extends Component {
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
      title: transferLanguage('RoleList.field.loginName', this.props.language),
      dataIndex: 'loginName',
      fixed: this.props.isMobile ? false : true,
      width: this.props.isMobile ? 'auto' : 150,
      // render: (text, record) => <a onClick={() => this.showDetail(record.id)}>{text}</a>,
    },
    {
      title: transferLanguage('RoleList.field.sysName', this.props.language),
      dataIndex: 'sysName',
    },
    {
      title: transferLanguage('RoleList.field.orgId', this.props.language),
      dataIndex: 'orgId',
    },
    {
      title: transferLanguage('RoleList.field.mobile', this.props.language),
      dataIndex: 'mobile',
    },
    {
      title:  transferLanguage('RoleList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
    },
    {
      title: transferLanguage('RoleList.field.createTime', this.props.language),
      dataIndex: 'createTime',
    },
    {
      title: transferLanguage('RoleList.field.remark', this.props.language),
      dataIndex: 'remark',
    },
  ];

  handleStandardTableChange = param => {
    const { detailId } = this.props;
    const params = {
      ...param,
    };
    params.id = detailId;
    this.dispatchFun('tmsRole/selectListBinding', params);
  };
  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }

  render() {
    const { loading, selectDetails, detailId, selectListBinding } = this.props;
    const { } = this.state;
    const detail = selectDetails[detailId] || {};

    const editPageParams = {
      panelValue: [{ key: transferLanguage('RoleList.field.info', this.props.language) }, { key: transferLanguage('RoleList.field.userDetails', this.props.language) }],
    };

    const formItem = [
      [
        <DetailPage label={transferLanguage('RoleList.field.code', this.props.language)} value={detail.code} />,
        <DetailPage label={transferLanguage('RoleList.field.name', this.props.language)} value={detail.name} />,
      ],
      [<DetailPage label={transferLanguage('RoleList.field.beActive', this.props.language)} value={detail.beActive ? '启用' : '禁用'} />, <></>],
      [<DetailPage label={transferLanguage('RoleList.field.remark', this.props.language)} value={detail.remarks} />],
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
            scrollX={1000}
            scrollY={200}
            onPaginationChange={this.handleStandardTableChange}
          />
        </Fragment>
      </EditPage>
    );
  }
}
