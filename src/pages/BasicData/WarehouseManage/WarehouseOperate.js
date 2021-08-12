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
import SearchSelect from '@/components/SearchSelect';
import { Status, columns1,codes } from './utils';
import { transferLanguage } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ warehouse, common, loading, i18n }) => ({
  warehouse,
  dictObject: common.dictObject,
  id: warehouse.id,
  loading: loading.models.warehouse,
  language: i18n.language
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
      country: []
    };
  }
  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    if (ID) {
      this.getSelectDetails(ID);
    } else {
      form.resetFields();
      this.setState({
        disabled: false,
      });
    }
  }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'warehouse/warehouseDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
          country: [{ id: data.countryId, name: data.countryName }]
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
        value.countryId = this.state.country[0].id
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'warehouse/warehouseOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('warehouse/warehouseList', {});
              this.dispatchFun('warehouse/warehouseDetails', { id: params.id });
            },
          });
        } else {
          dispatch({
            type: 'warehouse/warehouseOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              dispatch({
                type: 'warehouse/warehouseDetails',
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
                        router.push(`/basicData/listWareHouse/editWareHouse/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('warehouse/interfaceTypeList', {});
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
      country
    } = this.state;
    const {
      warehouse: { warehouseDetails, eventReceiverList },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,
    } = this.props;

    const currentId = params.id;
    let selectDetails = warehouseDetails[currentId];
    const checkDisabled = selectDetails ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.code : '新增仓库'}</span>
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
                {transferLanguage('Common.field.save',language)}
            </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('Common.field.cancel',language)}
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
            <Panel header={transferLanguage('Common.field.baseInfo',language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.code', language)}>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.code : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.address', language)}>
                        {getFieldDecorator('address', {
                          initialValue: selectDetails ? selectDetails.address : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.contactName', language)}>
                        {getFieldDecorator('contactName', {
                          initialValue: selectDetails ? selectDetails.contactName : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.country', language)}>
                        {getFieldDecorator('countryId', {
                          rules: [{ required: true, message: 'countryId' }],
                          initialValue: selectDetails ? selectDetails.countryId : '',
                        })(<SearchSelect
                          dataUrl="mds-country/selectMdsCountryList"
                          selectedData={country} // 选中值
                          multiple={false} // 是否多选
                          showValue="name"
                          searchName="keyWord"
                          columns={columns1} // 表格展示列
                          onChange={e => this.getValue(e, 'country')} // 获取选中值
                          scrollX={160}
                          id="ArchivesList_1"
                          allowClear={true}
                          // payload={{ categoryList: ['HEADSTOCK', 'CARLOAD'] }} //筛选为整车和车头的
                          disabled={disabled}
                        />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.mobile', language)}>
                        {getFieldDecorator('mobile', {
                          initialValue: selectDetails ? selectDetails.mobile : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.name', language)}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.name : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.status', language)}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue:
                            selectDetails && selectDetails.status == 'DISABLE' ? 
                            transferLanguage('Common.field.disable',language) : transferLanguage('Common.field.enable',language),
                        })(
                          <Input disabled={true} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.postcode', language)}>
                        {getFieldDecorator('postcode', {
                          initialValue: selectDetails ? selectDetails.postcode : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.warehouseTag', language)}>
                        {getFieldDecorator('warehouseTag', {
                          initialValue: selectDetails ? selectDetails.warehouseTag : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('WarehouseList.field.timeZone', language)}>
                        {getFieldDecorator('timeZone', {
                          initialValue: selectDetails ? selectDetails.timeZone : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('WarehouseList.field.description', language)}>
                        {getFieldDecorator('description', {})(
                          <TextArea  disabled={disabled} rows={4} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>*/}
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('WarehouseList.field.remarks', language)}>
                        {getFieldDecorator('remarks', {})(
                          <TextArea  disabled={disabled} rows={4} />
                        )}
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
