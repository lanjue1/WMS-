import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import EditPage from '@/components/EditPage';
import DetailPage from '@/components/DetailPage';
import { formItemFragement, queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';
import { sequenceDetail, renderTableAdSelect, allDispatchType, IcCardStatus } from './utils';
import { transferLanguage } from '@/utils/utils';


@connect(({ sequence, loading, component, i18n }) => ({
  sequenceDetail: sequence.sequenceDetail,
  dictObject: component.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language
}))
export default class DeclareDetail extends Component {
  state = {
    detailId: '',
  };

  componentWillMount() {
    // 查询字典项
    const allDict = [allDictList.manifest_transport, allDictList.manifest_goods];
    queryDict({ props: this.props, allDict });
  }
  componentDidMount() {
    const { detailId, match } = this.props;
    const currentId = match && match.params.id ? match.params.id : detailId;
    if (!currentId) return;
    this.handleStateChange([{ detailId: currentId }]);
    this.sequenceDetail();
  }

  sequenceDetail = () => {
    const { detailId, match } = this.props;
    const currentId = match && match.params.id ? match.params.id : detailId;
    currentId &&
      sequenceDetail({
        type: allDispatchType.detail,
        payload: { id: currentId },
        props: this.props,
      });
  };

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };

  render() {
    const { loading, sequenceDetail, language } = this.props;
    const { detailId } = this.state;
    const detail = sequenceDetail[detailId] || {};

    const editPageParams = {
      title: detail.sequenceType || '',
      panelTitle: [transferLanguage('SequenceList.field.baseInfo', this.props.language)],
    };

    const formItem = [
      [
        <DetailPage label={transferLanguage('SequenceList.field.TypeName', this.props.language)} value={detail.sequenceType} />,
        <DetailPage label={transferLanguage('SequenceList.field.currentValue', this.props.language)} value={detail.curStep} />,
      ],
      [
        <DetailPage label={transferLanguage('SequenceList.field.lengthOfTheNumber', this.props.language)} value={detail.codeLength} />,
        <DetailPage label={transferLanguage('SequenceList.field.prefix', this.props.language)} value={detail.fix} />,
      ],
      [
        <DetailPage label={transferLanguage('SequenceList.field.dateFormat', this.props.language)} value={detail.formatStr} />,
        <DetailPage label={transferLanguage('SequenceList.field.BaseUnit', this.props.language)} value={detail.scale} />,
      ],
      [
        <DetailPage label={transferLanguage('SequenceList.field.GrowthStep', this.props.language)} value={detail.incrementStep} />,
        <DetailPage label={transferLanguage('SequenceList.field.maximum', this.props.language)} value={detail.maxValue} />,
      ],
    ];

    return (
      <Fragment>
        <EditPage {...editPageParams}>
          <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
        </EditPage>
      </Fragment>
    );
  }
}
