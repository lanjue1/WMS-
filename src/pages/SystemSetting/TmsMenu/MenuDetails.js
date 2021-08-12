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


@connect(({ tmsMenu, loading, component }) => ({
  selectDetails: tmsMenu.selectDetails,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
}))
export default class MenulDetail extends Component {
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
    const { loading, selectDetails, detailId } = this.props;
    const {} = this.state;
    const detail = selectDetails[detailId] || {};

    const editPageParams = {
      panelValue: [{ key: transferLanguage('MenuList.field.baseInfo', this.props.language) }],
    };

    const formItem = [
      [
        <DetailPage label={transferLanguage('MenuList.field.code', this.props.language)} value={detail.code} />,
        <DetailPage label={transferLanguage('MenuList.field.name', this.props.language)} value={detail.name} />,
      ],
      [
        <DetailPage
          label={transferLanguage('MenuList.field.type', this.props.language)}
          value={renderTableAdSelect({
            props: this.props,
            value: detail.type,
            data: menuTypeData,
          })}
        />,
        <DetailPage label={transferLanguage('MenuList.field.icon', this.props.language)} value={detail.icon} />,
      ],
      [
        <DetailPage label={transferLanguage('MenuList.field.beActive', this.props.language)} value={detail.beActive ? '启用' : '禁用'} />,
        <DetailPage label={transferLanguage('MenuList.field.clazz', this.props.language)} value={detail.clazz} />,
      ],
      [
        <DetailPage label={transferLanguage('MenuList.field.trueUrl', this.props.language)} value={detail.trueUrl} />,
        <DetailPage label={transferLanguage('MenuList.field.url', this.props.language)} value={detail.url} />,
      ],
      [<DetailPage label={transferLanguage('MenuList.field.remark', this.props.language)} value={detail.remarks} />],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
      </EditPage>
    );
  }
}
