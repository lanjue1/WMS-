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
import { allDispatchType, selectDetailAndInfo } from './utils';
import DictInfo from './DictInfo';
import { transferLanguage } from '@/utils/utils';


@connect(({ Dict, loading, component }) => ({
  dictDetails: Dict.dictDetails,
  dictDataList: Dict.dictDataList,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
}))
export default class DictDetail extends Component {
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
    const { loading, dictDetails, detailId, dictDataList } = this.props;
    const {} = this.state;
    const detail = dictDetails[detailId] || {};
    const editPageParams = {
      panelValue: [{ key: transferLanguage('dictList.field.dictionaryInfo', this.props.language) }, { key: transferLanguage('dictList.field.dictionaryDetail', this.props.language) }],
    };
    const infoParams = {
      id: detailId,
      type: 'details',
      loading,
    };
    const formItem = [
      [
        <DetailPage label={transferLanguage('dictList.field.dictionaryType', this.props.language)} value={detail.dictType} />,
        [<DetailPage label={transferLanguage('dictList.field.beActive', this.props.language)} value={detail.beActive ? transferLanguage('dictList.field.enable', this.props.language) : transferLanguage('dictList.field.disabled', this.props.language)} />, <></>],
      ],
      [<DetailPage label={transferLanguage('dictList.field.remark', this.props.language)} value={detail.remarks} />],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
        <Fragment>
          <DictInfo {...infoParams} data={dictDataList} onRef={this.onRef} />
        </Fragment>
      </EditPage>
    );
  }
}
