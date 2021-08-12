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
  selectDynamicTableList,
  selectDynamicTableDetailAndInfo,
  routeUrl,
  codes,
  allDispatchType,
  dynamicTableStatusList,
  allUrl,
  formate,
  SelectColumns
} from './utils';
import RelationInfo from './RelationInfo';

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

@connect(({ dynamicTableVersions, component, loading, common }) => ({
  dynamicTableDetail: dynamicTableVersions.dynamicTableDetail,
  dictObject: component.dictObject,
  formValues: dynamicTableVersions.formValues,
  loading: loading.effects[allDispatchType.detail],
  fieldList: dynamicTableVersions.fieldList,
}))
@Form.create()
export default class DynamicTableOperate extends Component {
  state = {
    detailId: '',
    type: '',
    disabled: false,
    selectedRowsPre: [],
    showTips: false,
    tableName: []
  };

  componentWillMount() {
    // const allDict = [allDictList.mysqlType];
    // queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      dynamicTableDetail,
    } = this.props;
    this.handleStateChange([{ detailId: id }]);
    const detail = dynamicTableDetail[id];
    // if (detail) return;
    this.getDynamicTableDetails(id);
  }
  getDynamicTableDetails = id => {
    const {
      match: { params },
    } = this.props;
    const dynamicTableId = id || params.id;
    dynamicTableId &&
      selectDynamicTableDetailAndInfo({
        type: allDispatchType.detail,
        payload: { id: dynamicTableId },
        props: this.props,
        callback: data => {
          selectDynamicTableDetailAndInfo({
            type: allDispatchType.fildList,
            payload: { tableName: data.name },
            props: this.props,

          })
          this.setState({
            tableName: [{ name: data.name }]
          })
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
    const { tableName } = this.state
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (!tableName[0]) {
        return
      }
      const { effeTime, ...params } = values;
      params.name = tableName[0].name
      params.ruleTableId = tableName[0].id
      if (effeTime && effeTime.length > 0) {
        params.startDate = moment(effeTime[0]).format(formate);
        params.endDate = moment(effeTime[1]).format(formate);
      } else {
        params.startDate = ''
        params.endDate = ''
      }
      if (id) {
        params.id = id;
        delete params.name
        delete params.ruleTableId
      }
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
          this.getDynamicTableDetails(id);
        } else {
          this.setTabName({
            id: data,
            isReplaceTab: true,
          });
        }
        selectDynamicTableList({ payload: formValues, props: this.props });
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
                // code={codes.add}
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
                // code={id ? codes.edit : codes.add}
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
              // code={id ? codes.edit : codes.add}
              />
            </Button.Group>
          )}
      </div>
    );
  };

  getValue = (values, type) => {
    const { dispatch } = this.props;
    if (type === 'tableName') {
      selectDynamicTableDetailAndInfo({
        type: allDispatchType.fildList,
        payload: { tableName: values[0].name },
        props: this.props
      })
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
  //表格显示提示：
  showTipsFun = val => {
    this.setState({
      showTips: val,
    });
  };

  render() {
    const { detailId, disabled, selectedRowsPre, showTips, tableName } = this.state;

    const { form, dynamicTableDetail, loading, dictObject } = this.props;
    const getFieldDecorator = form.getFieldDecorator;
    const detail = dynamicTableDetail[detailId] || {};

    const preTitle = (
      <span>
        表字段信息
        {showTips && (
          <span style={{ color: 'red', marginLeft: 30 }}>当前数据有变化，请注意保存</span>
        )}
      </span>
    );
    const editPageParams = {
      title: detail.name || '',
      headerOperate: this.headerOperate(),
      panelValue: [
        { key: '基础信息' },
        {
          key: preTitle,
          extra: (
            <>
            </>
          ),
        },
      ],
    };
    const commonParams = {
      getFieldDecorator,
    };
    const formItem = [
      [
        <AntdFormItem
          label="表名"
          code="name"
          initialValue={detail.name}
          rules={[{ required: true }]}
          {...commonParams}
        >
          <SearchSelect
            disabled={disabled}
            dataUrl={'/rule-table/selectRuleTableList'}
            selectedData={tableName} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={SelectColumns}
            onChange={values => this.getValue(values, 'tableName')}
            id="tableName"
            allowClear={true}
            scrollX={200}
            disabled={this.props.match.params.id ? true : false}
          />
        </AntdFormItem>,
        <AntdFormItem
          label="别名"
          initialValue={
            detail.tableAliasName ? detail.tableAliasName : undefined
          }
          code="tableAliasName"
          // rules={[{ required: true }]}
          {...commonParams}
        >
          <Input />
        </AntdFormItem>,

      ],
      [<AntdFormItem
        label="有效期"
        initialValue={
          detail.startDate ? [moment(detail.startDate), moment(detail.endDate)] : undefined
        }
        code="effeTime"
        rules={[{ required: true }]}
        {...commonParams}
      >
        <AntdDatePicker mode="range" disabled={disabled} />
      </AntdFormItem>,],
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
        <Fragment>
          <RelationInfo
            curId={tableName[0] ? tableName[0].name : ''}
            selectedRows={selectedRowsPre}
            onSelectRow={selectedRowsPre => this.handleStateChange([{ selectedRowsPre }])}
            showTipsFun={this.showTipsFun}
            disabled={true}
            onlyRead={true}
            mode="detail"
          />
        </Fragment>

      </EditPage>
    );
  }
}
