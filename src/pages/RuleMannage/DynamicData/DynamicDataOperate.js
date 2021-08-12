import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Spin, Button, Input, Radio } from 'antd';
import EditPage from '@/components/EditPage';
import AntdForm from '@/components/AntdForm';
import router from 'umi/router';
import AdSelect from '@/components/AdSelect';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import FileReader from '@/components/FileReader';
import AdButton from '@/components/AdButton';
import SearchSelect from '@/components/SearchSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import moment from 'moment';
import {
  formItemFragement,
  queryDict,
  filterAddFile,
  filterDeteteFile,
  formatPrice,
} from '@/utils/common';
import { columnsUser, columnsDriver, supplierColumns, checkStrLength } from '@/pages/Common/common';
import { allDictList } from '@/utils/constans';
import {
  selectDynamicDataList,
  selectDynamicDataDetailAndInfo,
  routeUrl,
  codes,
  allDispatchType,
  dynamicDataStatusList,
  allUrl,
} from './utils';

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

@connect(({ dynamicData, component, loading, common }) => ({
  dynamicDataDetail: dynamicData.dynamicDataDetail,
  dictObject: component.dictObject,
  formValues: dynamicData.formValues,
  loading: loading.effects[allDispatchType.detail],
}))
@Form.create()
export default class DynamicDataOperate extends Component {
  state = {
    detailId: '',
    type: '',
    disabled: false,
  };

  componentWillMount() {
    const allDict = [allDictList.mysqlType];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dynamicDataDetail,
    } = this.props;
    this.handleStateChange([{ detailId: id }]);
    const detail = dynamicDataDetail[id];
    // if (detail) return;
    this.getDynamicDataDetails(id);
  }
  getDynamicDataDetails = id => {
    const {
      match: { params },
    } = this.props;
    const dynamicDataId = id || params.id;
    dynamicDataId &&
      selectDynamicDataDetailAndInfo({
        type: allDispatchType.detail,
        payload: { id: dynamicDataId },
        props: this.props,
        callback: data => {
          this.handleStateChange([{ detailId: record.id }, { visible: true }]);
        },
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
   * 操作数据
   */
  saveInfo = () => {
    const {
      form,
      match: {
        params: { id },
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { ...params } = values;
      if (id) {
        params.id = id;
      }

      // console.log('params==', params)
      // return; //测试
      this.dispatchOperate(params);
    });
  };

  dispatchOperate = params => {
    const { dispatch, formValues } = this.props;
    dispatch({
      type: allDispatchType.operate,
      payload: params,
      callback: data => {
        if (!data) return;
        const id = params.id;
        this.setState(preState => ({
          disabled: !preState.disabled,
        }));

        if (id) {
          this.getDynamicDataDetails(id);
        } else {
          this.setTabName({
            id: data,
            isReplaceTab: true,
          });
        }
        selectDynamicDataList({ payload: formValues, props: this.props });
      },
    });
  };

  headerOperate = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { disabled } = this.state;
    return (
      <div>
        {!disabled ? (
          <>
            <Button.Group>
              <AdButton
                text="保存"
                type="primary"
                code={codes.add}
                onClick={() => this.saveInfo()}
              />
              {id && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text="取消"
                  code={id ? codes.edit : codes.add}
                />
              )}
            </Button.Group>
          </>
        ) : (
          <Button.Group>
            <AdButton
              onClick={() => {
                this.setState(preState => ({
                  disabled: !preState.disabled,
                }));
              }}
              text="编辑"
              type="primary"
              code={id ? codes.edit : codes.add}
            />
          </Button.Group>
        )}
      </div>
    );
  };

  getValue = (values, type) => {
    if (type === 'company') {
      this.setState({
        drivers: [],
      });
    }
    this.setState({
      [type]: values,
    });
  };

  saveAllValue = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.value,
      payload: payload || {},
    });
  };

  render() {
    const { detailId, disabled } = this.state;

    const { form, dynamicDataDetail, loading, dictObject } = this.props;
    const getFieldDecorator = form.getFieldDecorator;
    const detail = dynamicDataDetail[detailId] || {};

    const editPageParams = {
      title: detail.pollName || '新增动态数据源',
      headerOperate: this.headerOperate(),
      panelValue: [{ key: '基础信息' }],
    };
    const commonParams = {
      getFieldDecorator,
    };
    const formItem = [
      [
        <AntdFormItem
          label="数据库名称"
          code="pollName"
          initialValue={detail.pollName}
          rules={[{ required: true }]}
          {...commonParams}
        >
          <AntdInput disabled={disabled}  />
        </AntdFormItem>,
        <AntdFormItem
          label="数据库类型"
          rules={[{ required: true }]}
          code="type"
          initialValue={detail.type}
          {...commonParams}
        >
          <AdSelect
            disabled={disabled}
            isExist={true}
            data={dictObject[allDictList.mysqlType]}
            payload={{ code: allDictList.mysqlType }}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="账号"
          rules={[{ required: true }]}
          code="username"
          initialValue={detail.username}
          {...commonParams}
        >
          <AntdInput disabled={disabled}  />
        </AntdFormItem>,
        <AntdFormItem
          label="密码"
          rules={[{ required: true }]}
          code="password"
          initialValue={detail.password}
          {...commonParams}
        >
          <AntdInput disabled={disabled}  />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label="数据库连接"
          code="url"
          rules={[{ required: true }]}
          initialValue={detail.url}
          {...commonParams}
        >
          <TextArea disabled={disabled} rows={3} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label="备注" code="remarks" initialValue={detail.remarks} {...commonParams}>
          <TextArea disabled={disabled} rows={4} />
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
