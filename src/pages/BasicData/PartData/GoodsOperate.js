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
import { Status,itemTypeColumns ,codes} from './utils';
import SearchSelect from '@/components/SearchSelect';
import AdSelect from '@/components/AdSelect';
import { transferLanguage,columnConfiguration } from '@/utils/utils';
// import { languages } from 'monaco-editor';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ goods, common, loading, i18n }) => ({
  goods,
  dictObject: common.dictObject,
  id: goods.id,
  loading: loading.models.goods,
  language: i18n.language,
}))
@Form.create()
export default class TypeOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      currentId: '',
      selectedRows: [],
      visible: false,
      activeKey: ['1', '2'],
      showRecord: true, //init:false
      senders: [],
      disabled: true,
      beUseRule: true,
      requestTypeList: [],
      warehouse: [],
      partType:[],
      _itemTypeColumns:[],
    };
  }
  componentDidMount() {
    const { match, form, dispatch,language } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
      _itemTypeColumns:columnConfiguration(itemTypeColumns,language)
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
      type: 'goods/goodsDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
          warehouse:[{name:data.warehouseName}],
          partType:[{name:data.partTypeName}]
        });
      },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  operatePaneButton = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { senders, ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;

        if (params.id) {
          value.id = params.id;
          value.warehouseId = this.state.warehouse[0].id;
          value.itmeTypeId=this.state.partType[0].id;
          dispatch({
            type: 'goods/goodsOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('goods/warehouseList', {});
              this.dispatchFun('goods/goodsDetails', { id: params.id });
            },
          });
        } else {
          value.warehouseId = this.state.warehouse[0].id;
          value.itmeTypeId=this.state.partType[0].id;
          dispatch({
            type: 'goods/goodsOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              dispatch({
                type: 'goods/goodsDetails',
                payload: { id: res },
                callback: data => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                  // 新增变编辑页面：
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.businessTypeCode,
                      isReplaceTab: true,
                    },
                    callback: result => {
                      if (result) {
                        router.push(`/basicData/listGoods/editGoods/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('goods/interfaceTypeList', {});
            },
          });
        }
      }
    });
  };
  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }
  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  infoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };
  handleSelectRows = rows => {
    // console.log('选择', rows);
    let ids = [];
    if (Array.isArray(rows) && rows.length > 0) {
      rows.map((item, i) => {
        ids.push(item.id);
      });
    }
    this.setState({
      selectedRows: rows,
      checkIds: ids,
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  getValue = (values, type) => {
		this.setState({
			[type]: values,
		});
	};

  render() {
    const {
      selectedRowKeys,
      selectedRows,
      visible,
      previewImage,
      fileList,
      papersDetails,
      cars,
      showRecord,
      senders,
      disabled,
      warehouse,
      partType,
      _itemTypeColumns
    } = this.state;
    const {
      goods: { goodsDetails, eventReceiverList },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,
    } = this.props;

    const currentId = params.id;
    let selectDetails = goodsDetails[currentId];
    const checkDisabled = selectDetails ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : '新增货品'}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            code={codes.edit}
            text={transferLanguage('Common.field.edit',language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
              {transferLanguage('partData.button.save',language)}
            </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('partData.button.cancel',language)}
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
    };;

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
            <Panel header={transferLanguage('Common.field.baseInfo',language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.code', language)}>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.code : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.name', language)}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.name : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.shortName', language)}>
                        {getFieldDecorator('shortName', {
                          initialValue: selectDetails ? selectDetails.shortName : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.enName', language)}>
                        {getFieldDecorator('enName', {
                          initialValue: selectDetails ? selectDetails.enName : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.barCode', language)}>
                        {getFieldDecorator('barCode', {
                          initialValue: selectDetails ? selectDetails.barCode : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.itmeType', language)}>
                        {getFieldDecorator('itmeTypeId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.itmeTypeId : '',
                        })(
                          <SearchSelect
                            dataUrl="wms-part-type/selectWmsPartTypeList"
                            selectedData={partType} // 选中值
                            multiple={false} // 是否多选
                            showValue="name"
                            searchName="name"
                            columns={_itemTypeColumns} // 表格展示列
                            onChange={e => this.getValue(e, 'partType')} // 获取选中值
                            scrollX={160}
                            id="ArchivesList_1"
                            allowClear={true}
                            // payload={{ categoryList: ['HEADSTOCK', 'CARLOAD'] }} //筛选为整车和车头的
                            disabled={disabled}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.warehouseId', language)}>
                        {getFieldDecorator('warehouseId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.warehouseId : '',
                        })(
                          <SearchSelect
                            dataUrl="wms-warehouse/selectWmsWarehouseList"
                            selectedData={warehouse} // 选中值
                            multiple={false} // 是否多选
                            showValue="name"
                            searchName="name"
                            columns={_itemTypeColumns} // 表格展示列
                            onChange={e => this.getValue(e, 'warehouse')} // 获取选中值
                            scrollX={160}
                            id="ArchivesList_1"
                            allowClear={true}
                            // payload={{ categoryList: ['HEADSTOCK', 'CARLOAD'] }} //筛选为整车和车头的
                            disabled={disabled}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                    <Form.Item label={transferLanguage('partData.field.status', language)}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails && selectDetails.status == 'DISABLE' ? transferLanguage('Common.field.disable',language) : transferLanguage('Common.field.enable',language),
                        })(
                          // <Select disabled={disabled}>
                          //   {Status.map(v => {
                          //     return <Option value={v.code}>{v.value}</Option>;
                          //   })}
                          // </Select>
                          <Input  disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.werks', language)}>
                        {getFieldDecorator('werks', {
                          initialValue: selectDetails ? selectDetails.werks : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.externalPartNumber', language)}>
                        {getFieldDecorator('externalPartNumber', {
                          initialValue: selectDetails ? selectDetails.externalPartNumber : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.coo', language)}>
                        {getFieldDecorator('coo', {
                          initialValue: selectDetails ? selectDetails.coo : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.spec', language)}>
                        {getFieldDecorator('spec', {
                          initialValue: selectDetails ? selectDetails.spec : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.storageType', language)}>
                        {getFieldDecorator('storageType', {
                          initialValue: selectDetails ? selectDetails.storageType : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.uom', language)}>
                        {getFieldDecorator('uom', {
                          initialValue: selectDetails ? selectDetails.uom : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    
                    
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.length', language)}>
                        {getFieldDecorator('length', {
                          initialValue: selectDetails ? selectDetails.timeZone : '',
                        })(
                          <Input placeholder="" type='number' disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.width', language)}>
                        {getFieldDecorator('width', {
                          initialValue: selectDetails ? selectDetails.width : '',
                        })(
                          <Input placeholder="" type='number' disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                  <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.heigth', language)}>
                        {getFieldDecorator('heigth', {
                          initialValue: selectDetails ? selectDetails.heigth : '',
                        })(
                          <Input placeholder="" type='number' disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.price', language)}>
                        {getFieldDecorator('price', {
                          initialValue: selectDetails ? selectDetails.price : '',
                        })(
                          <Input placeholder="" type='number' disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.grossWeight', language)}>
                        {getFieldDecorator('grossWeight', {
                          initialValue: selectDetails ? selectDetails.grossWeight : '',
                        })(
                          <Input placeholder="" type='number' disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.grossWeightUnit', language)}>
                        {getFieldDecorator('grossWeightUnit', {
                          initialValue: selectDetails ? selectDetails.grossWeightUnit : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.netWeight', language)}>
                        {getFieldDecorator('netWeight', {
                          initialValue: selectDetails ? selectDetails.netWeight : '',
                        })(
                          <Input placeholder="" type='number' disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.netWeightUnit', language)}>
                        {getFieldDecorator('netWeightUnit', {
                          initialValue: selectDetails ? selectDetails.netWeightUnit : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                   
                  </Row>
                  <Row gutter={_gutter}>
                  <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.volume', language)}>
                        {getFieldDecorator('volume', {
                          initialValue: selectDetails ? selectDetails.volume : '',
                        })(
                          <Input placeholder="" type='number' disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('partData.field.volumeUnit', language)}>
                        {getFieldDecorator('volumeUnit', {
                          initialValue: selectDetails ? selectDetails.volumeUnit : '',
                        })(
                          <Input placeholder="" disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('partData.field.description', language)}>
                        {getFieldDecorator('description', {
                        })(<TextArea placeholder="" disabled={disabled} rows={4} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('partData.field.remarks', language)}>
                        {getFieldDecorator('remarks', {
                        })(<TextArea placeholder="" disabled={disabled} rows={4} />)}
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
