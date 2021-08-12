import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Collapse,
  DatePicker,
  PageHeader,
  Radio,
} from 'antd';
import prompt from '@/components/Prompt';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import AdSelect from '@/components/AdSelect';
import SearchSelect from '@/components/SearchSelect';
import { dispatchFun, transferLanguage, columnConfiguration, } from '@/utils/utils';


import {
  Status, allDispatchType,routeUrl,
  columnsWare,
  lockStatus,
  codes,
} from './utils';
// import { languages } from 'monaco-editor';
import { Prompt } from 'dva/router';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ WarehouseBin, common, loading, i18n }) => ({
  WarehouseBin,
  warehouseBinDetail: WarehouseBin.warehouseBinDetail,
  dictObject: common.dictObject,
  loading: loading.effects[allDispatchType.detail],
  language: i18n.language,
}))
@Form.create()
export default class WarehouseBinOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: '',
      visible: false,
      activeKey: ['1', '2'],
      senders: [],
      disabled: true,
      beUseRule: true,
      requestTypeList: [],
      storageType: [],
      warehouse: [],
      warehouseArea: [{ id: '230769530139803648', name: '正常存货区' }],
      _columnsWare: [],
      _lockStatus: [],
    };
  }
  componentDidMount() {
    const { match, form, dispatch, language } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      _columnsWare: columnConfiguration(columnsWare, language),
      _lockStatus: columnConfiguration(lockStatus, language)
    });
    if (ID) {
      this.getSelectDetails(ID);
    } else {
      form.resetFields();
      this.setState({
        disabled: false
      })
    }
  }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: allDispatchType.detail,
      payload: { id: ID },
      callback: data => {
        this.setState({
          // senders: [{ id: data.senderId }],
          // beUseRule: data.beUseRule,
          warehouseArea: [{ id: data.warehouseAreaId, name: data.areaName }],
          warehouse    :[{id:data.warehouseId,name:data.warehouseName}],
          storageType:[{id:data.storageTypeId,name:data.storageTypeName}]
        });
      },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  //保存、编辑
  saveInfo = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, allvalues) => {
      if (!err) {
        const { warehouseAreaId, warehouseId, storageType, ...allvalue } = allvalues;
        const {
          match: { params },
          dispatch,
        } = this.props;
        allvalue.warehouseAreaId = warehouseAreaId && warehouseAreaId[0] ? warehouseAreaId[0].id : ""
        allvalue.warehouseId = warehouseId && warehouseId[0] ? warehouseId[0].id : ""
        allvalue.id = params.id ? params.id : "";
        allvalue.storageTypeId = storageType && storageType[0] ? storageType[0].id : ""
        console.log('values---', allvalue);
        dispatch({
          type: allDispatchType.operate,
          payload: allvalue,
          callback: (res) => {
            if (!res) return;
            this.setState(preState => ({
              disabled: !preState.disabled,
            }));

            if (params.id) {
              //编辑
              dispatchFun(allDispatchType.list, {}, this.props)
              dispatchFun(allDispatchType.detail, { id: params.id }, this.props)

            } else {
              //新建
              // dispatchFun(allDispatchType.detail, { id:res }, this.props)
              dispatch({
                type: allDispatchType.detail,
                payload: { id: res },
                callback: data => {
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.businessTypeCode,
                      isReplaceTab: true,
                    },
                    callback: result => {
                      if (result) {
                        router.push(`${routeUrl.edit}/${res}`);
                      }
                    },
                  });
                }
              })
            }
          }
        })
      }
    });
  };
  // // dispatch 方法
  // dispatchFun(type, params) {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: type,
  //     payload: params,
  //   });
  // }

  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  infoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };

  onRef = ref => {
    this.child = ref;
  };

  getValue = (type, values) => {
    this.setState({
      [type]: values,
    });
  };

  render() {
    const {
      visible,
      warehouse,
      warehouseArea,
      disabled,
      _columnsWare,
      _lockStatus,
    } = this.state;
    const {
      warehouseBinDetail,
      form: { getFieldDecorator },
      match: { params },
      loading,
      language,
      storageType,
    } = this.props;

    const currentId = params.id;
    let selectDetails = warehouseBinDetail[currentId] || {};
    // warehouseArea=selectDetails?selectDetails.warehouseAreaId:''
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : transferLanguage('Bin.field.addBin', language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            code={codes.edit}
            text={transferLanguage('base.prompt.edit', language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.saveInfo(e)}>
                {transferLanguage('base.prompt.save', language)}
              </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('base.prompt.cancel', language)}
                />
              )}
            </Button.Group>
          )}
      </div>
    );
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('Common.field.baseInfo', language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.code', this.props.language)}>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.code : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.warehouseName', this.props.language)}>
                        {getFieldDecorator('warehouseId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.warehouseName :""
                        })(
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'wms-warehouse/selectWmsWarehouseList'}
                            selectedData={warehouse} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_columnsWare}
                            onChange={values => this.getValue(values, 'warehouseId')}
                            id="warehouseId"
                            allowClear={true}
                            scrollX={200}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.warehouseAreaName', this.props.language)}>
                        {getFieldDecorator('warehouseAreaId', {
                          rules: [{ required: true }],
                          initialValue:selectDetails ? selectDetails.areaName : warehouseArea,
                        })(
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'wms-warehouse-area/selectWmsWarehouseAreaList'}
                            selectedData={warehouseArea} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_columnsWare}
                            onChange={values => this.getValue(values, 'warehouseAreaId')}
                            id="warehouseAreaId"
                            allowClear={true}
                            scrollX={200}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.beActive', this.props.language)}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails && selectDetails.status == 'DISABLE' ? transferLanguage('Common.field.disable', language) : transferLanguage('Common.field.enable', language),
                        })(
                          // <Select disabled={disabled}>
                          //   {Status.map(v => {
                          //     return <Option value={v.code}>{v.value}</Option>;
                          //   })}
                          // </Select>
                          <Input disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>

                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.typeCodeName', this.props.language)}>
                        {getFieldDecorator('binType', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.binType : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.storageType', this.props.language)}>
                        {getFieldDecorator('storageType', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails && selectDetails.status?selectDetails.storageTypeName:"",
                        })(
                          <SearchSelect
                            disabled={disabled}
                            dataUrl={'wms-storage-type/selectWmsStorageTypeList'}
                            selectedData={ storageType} // 选中值
                            showValue="name"
                            searchName="name"
                            multiple={false}
                            columns={_columnsWare}
                            onChange={values => this.getValue(values, 'storageType')}
                            id="storageTypeId"
                            allowClear={true}
                            scrollX={200}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.zoneNo', this.props.language)}>
                        {getFieldDecorator('zoneNo', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.zoneNo : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.colNo', this.props.language)}>
                        {getFieldDecorator('colNo', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.colNo : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.lineNo', this.props.language)}>
                        {getFieldDecorator('lineNo', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.lineNo : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.layerNo', this.props.language)}>
                        {getFieldDecorator('layerNo', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.layerNo : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.useRate', this.props.language)}>
                        {getFieldDecorator('useRate', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.useRate : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.weight', this.props.language)}>
                        {getFieldDecorator('weight', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.weight : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.volume', this.props.language)}>
                        {getFieldDecorator('volume', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.volume : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.palletQty', this.props.language)}>
                        {getFieldDecorator('palletQty', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.palletQty : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.boxQty', this.props.language)}>
                        {getFieldDecorator('boxQty', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.boxQty : '',
                        }
                        )(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.inLock', this.props.language)}>
                        {getFieldDecorator('inLock', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.inLock : '',
                        }
                        )(
                          <AdSelect data={_lockStatus} isExist={true} disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.outLock', this.props.language)}>
                        {getFieldDecorator('outLock', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.outLock : '',
                        }
                        )(
                          <AdSelect data={_lockStatus} isExist={true} disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.countLock', this.props.language)}>
                        {getFieldDecorator('countLock', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.countLock : '',
                        }
                        )(
                          <AdSelect data={_lockStatus} isExist={true} disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('Bin.field.sortNo', this.props.language)}>
                        {getFieldDecorator('sortNo', {
                          //  rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.sortNo : '',
                        }
                        )(
                          <Input disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('Bin.field.remarks', this.props.language)}>
                        {getFieldDecorator(
                          'remarks',
                          {}
                        )(<TextArea placeholder="" disabled={disabled} rows={4} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
