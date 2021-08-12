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
import AntdSelect from '@/components/AntdSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import TableFiledsModal from "./TableFiledsModal";
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
  menuTypeData,
  selectData
} from './utils';
import RelationInfo from './RelationInfo';

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

@connect(({ dynamicTable, component, loading, common }) => ({
  dynamicTableDetail: dynamicTable.dynamicTableDetail,
  dictObject: component.dictObject,
  formValues: dynamicTable.formValues,
  loading: loading.effects[allDispatchType.detail],
  fieldList: dynamicTable.fieldList,
}))
@Form.create()
export default class DynamicTableOperate extends Component {
  state = {
    detailId: '',
    type: '',
    disabled: false,
    selectedRowsPre: [],
    showTips: false,
    beFindRange: false,
    urlId: '',
    modalVisible: false,
    clickDetails: {}
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
    if (this.props.location.query.type == 'link') this.setState({ disabled: true })
    this.handleStateChange([{ detailId: id }, { urlId: id }]);
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
          console.log('data', data.beFindRange)
          this.setState({ beFindRange: data.beFindRange })
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
      fieldList,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { ...params } = values;
      // if (effeTime && effeTime.length > 0) {
      //   params.startDate = moment(effeTime[0]).format(formate);
      //   params.endDate = moment(effeTime[1]).format(formate);
      // } else {
      //   params.startDate = ''
      //   params.endDate = ''
      // }
      if (id) {
        params.id = id;
        const infoForm = this.child.props.form;
        let relationVOS = [];

        infoForm.validateFieldsAndScroll(errors => {
          if (err || errors) return;
          if (id) {
            relationVOS = fieldList[id].list.map(item => {
              const { ...restd } = item;
              if (item.id.includes('isNew')) {
                const { id, ...rest } = restd;
                return rest;
              }
              return restd;
            });
          } else {
            relationVOS =
              Object.keys(fieldList).length > 0
                ? fieldList[""] || fieldList[undefined].list.map(item => {
                  const { ...restd } = item;
                  if (item.id.includes('isNew')) {
                    const { id, ...rest } = restd;
                    return rest;
                  }
                  return restd;
                })
                : [];
          }
          params.fieldList = relationVOS; //压夜
          // return; //测试
          this.dispatchOperate(params);
        });
        return
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
          router.push(`/rules/ruleMannage/dynamicTableList/dynamicTableEdit/${data}?type=link`);
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

  onRef = ref => {
    this.child = ref;
  };
  //添加字段
  addInfoPre = e => {
    e.stopPropagation();
    // this.child.addInfoPre();
    this.setState({ modalVisible: true })
  };
  //移除字段
  removeInfoPre = e => {
    e.stopPropagation();
    const { detailId, selectedRowsPre } = this.state;
    const { dispatch } = this.props;
    const deleteIds = selectedRowsPre.map(v => v.id);
    // this.deleteInfoIds = selectedRowsPre.filter(item => !item.id.includes('isNew')).map(v => v.id);
    // const newData = fieldList[detailId].list.filter(item => !deleteIds.includes(item.id));
    // this.saveAllValue({ fieldList: { [detailId]: { list: newData } } });
    // this.handleStateChange([{ selectedRowsPre: [], showTips: true }]);
    dispatch({
      type: 'dynamicTable/delTableField',
      payload: { ids: deleteIds },
      callback: () => {
        this.getDynamicTableDetails()
      }
    })
  };
  //表格显示提示：
  showTipsFun = val => {
    this.setState({
      showTips: val,
    });
  };

  closeModal = () => {
    this.setState({ modalVisible: false, clickDetails: {} })
  }
  fieldSort = (params) => {
    this.props.dispatch({
      type: 'dynamicTable/sortableField',
      payload: params,
      callback: () => {
        this.getDynamicTableDetails()
      }
    })
  }

  render() {
    const { detailId, disabled, clickDetails, modalVisible, selectedRowsPre, showTips, beFindRange, urlId } = this.state;

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
              <AdButton
                onClick={e => {
                  this.removeInfoPre(e);
                }}
                ghost
                // code={codes.delPressure}
                disabled={disabled || selectedRowsPre.length === 0}
                text="移除"
                type="danger"
              />
              <AdButton
                type="primary"
                disabled={disabled}
                onClick={e => {
                  this.addInfoPre(e);
                }}
                style={{ marginLeft: 8 }}
                text="添加字段"
              />
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
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label="是否允许多值"
          code="beMultiValue"
          initialValue={detail.beMultiValue ? detail.beMultiValue : false}
          rules={[{ required: true }]}
          {...commonParams}
        >
          <AntdSelect
            data={selectData}
            disabled={disabled}
            show={{ id: 'code', name: 'value' }}
          />
        </AntdFormItem>,
      ], [<AntdFormItem
        label="是否允许范围查找"
        code="beFindRange"
        initialValue={detail.beFindRange ? detail.beFindRange : beFindRange}
        rules={[{ required: true }]}
        {...commonParams}
      >
        <AntdSelect
          data={selectData}
          disabled={disabled}
          show={{ id: 'code', name: 'value' }}
          onChange={(value) => { this.setState({ beFindRange: value }) }}
        />
      </AntdFormItem>,
      <div>
        {beFindRange && <AntdFormItem
          label="范围类型"
          initialValue={
            detail.rangeType ? detail.rangeType : 'OPEN_CLOSE'
          }
          code="rangeType"
          rules={[{ required: true }]}
          {...commonParams}
        >
          {/* <AntdDatePicker mode="range" disabled={disabled} /> */}
          <AntdSelect
            data={menuTypeData}
            disabled={disabled}
            show={{ id: 'code', name: 'value' }}
          />
        </AntdFormItem>}
      </div>
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
        <Fragment>
          {urlId && <RelationInfo
            curId={detailId}
            onlyRead={false}
            onRef={this.onRef}
            selectedRows={selectedRowsPre}
            disabled={disabled}
            onSelectRow={selectedRowsPre => this.handleStateChange([{ selectedRowsPre }])}
            onlyRead={true}
            showTipsFun={this.showTipsFun}
            fieldSort={(params) => this.fieldSort(params)}
            showModal={(clickDetails) => this.setState({ modalVisible: true, clickDetails })}
          />}
          {modalVisible && <TableFiledsModal
            visible={modalVisible}
            modalEmpty={() => this.closeModal()}
            detailId={urlId}
            ediDetails={clickDetails}
            getDynamicTableDetails={() => this.getDynamicTableDetails()}
          />}
        </Fragment>
      </EditPage>
    );
  }
}
