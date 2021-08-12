import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Spin, Modal, Button } from 'antd';
import EditPage from '@/components/EditPage';
import AntdForm from '@/components/AntdForm';
import router from 'umi/router';
import AdSearch from '@/components/AdSearch';
import AdSelect from '@/components/AdSelect';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import AdButton from '@/components/AdButton';
import SearchSelect from '@/components/SearchSelect';
import { formItemFragement, queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';
import { allDispatchType, sequenceDetail, routeUrl, codes, selectSequenceList } from './utils';
import { transferLanguage } from '@/utils/utils';


@connect(({ sequence, component, loading, i18n }) => ({
  sequenceDetail: sequence.sequenceDetail,
  dictObject: component.dictObject,
  formValues: sequence.formValues,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language

}))
@Form.create()
export default class SequenceOperate extends Component {
  state = {
    detailId: '',
    type: '',
    visible: false,
    disabled: false,
  };

  componentWillMount() {
    const allDict = [allDictList.sequenceType];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if (!id) return;
    this.handleStateChange([{ detailId: id }]);
    this.getDetails(id);
  }
  getDetails = id => {
    sequenceDetail({
      type: allDispatchType.detail,
      payload: { id },
      props: this.props,
      callback: data => {},
    });
  };

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };

  setTabName = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/setTabsName',
      payload,
      callback: data => {
        if (!data) return;
        router.push(`${routeUrl.edit}/${payload.id}`);
      },
    });
  };

  /**
   * 保存数据
   */
  saveInfo = () => {
    const {
      form,
      match: {
        params: { id },
      },
    } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      const { ...params } = values;
      if (id) {
        params.id = id;
      }
      this.operateDispatch(params);
    });
  };

  operateDispatch = params => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.save,
      payload: params,
      callback: data => {
        this.setState(preState => ({
          disabled: !preState.disabled,
        }));
        if (params.id) {
          this.getDetails(params.id);
        } else {
          this.setTabName({
            id: data,
            isReplaceTab: true,
          });
        }
        selectSequenceList({ props: this.props });
      },
    });
  };

  headerOperate = () => {
    const { disabled, detailId } = this.state;
    return disabled ? (
      <AdButton
        type="primary"
        onClick={() => {
          this.setState(preState => ({
            disabled: !preState.disabled,
          }));
        }}
        text="编辑"
      />
    ) : (
      <Button.Group>
        <AdButton type="primary" onClick={e => this.saveInfo(e)} text="保存" />
        {detailId && (
          <AdButton
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text="取消"
          />
        )}
      </Button.Group>
    );
  };

  render() {
    const { detailId, disabled } = this.state;
    const { form, sequenceDetail, loading, dictObject, language } = this.props;
    const getFieldDecorator = form.getFieldDecorator;
    const detail = sequenceDetail[detailId] || {};

    const editPageParams = {
      title: detail.sequenceType || transferLanguage('SequenceList.field.NewSerialNumber', this.props.language),
      headerOperate: this.headerOperate(),
      panelTitle: [transferLanguage('SequenceList.field.baseInfo', this.props.language)],
    };
    const commonParams = {
      getFieldDecorator,
    };

    const formItem = [
      [
        <AntdFormItem
          label={transferLanguage('SequenceList.field.TypeName', this.props.language)}
          code="sequenceType"
          initialValue={detail.sequenceType}
          rules={[{ required: true }]}
          {...commonParams}
        >
          <AdSelect
            disabled={disabled}
            data={dictObject[allDictList.sequenceType]}
            payload={{ code: allDictList.sequenceType }}
          />
        </AntdFormItem>,
        <AntdFormItem
          rules={[{ required: true }]}
          label={transferLanguage('SequenceList.field.currentValue', this.props.language)}
          code="curStep"
          initialValue={detail.curStep}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('SequenceList.field.lengthOfTheNumber', this.props.language)}
          code="codeLength"
          initialValue={detail.codeLength}
          {...commonParams}
        >
          <AntdInput mode="number" disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('SequenceList.field.prefix', this.props.language)} code="fix" initialValue={detail.fix} {...commonParams}>
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('SequenceList.field.dateFormat', this.props.language)}
          code="formatStr"
          initialValue={detail.formatStr}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('SequenceList.field.GrowthStep', this.props.language)}
          code="incrementStep"
          initialValue={detail.incrementStep}
          {...commonParams}
        >
          <AntdInput mode="number" disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('SequenceList.field.maximum', this.props.language)}
          code="maxValue"
          initialValue={detail.maxValue}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage('SequenceList.field.BaseUnit', this.props.language)} code="scale" initialValue={detail.scale} {...commonParams}>
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
    ];

    return (
      <EditPage {...editPageParams}>
        <Spin spinning={detailId ? loading : false}>
          <AntdForm>{formItemFragement(formItem)}</AntdForm>
        </Spin>
      </EditPage>
    );
  }
}
