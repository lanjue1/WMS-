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
import SearchSelect from '@/components/SearchSelect';
import AdSelect from '@/components/AdSelect';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
import { Status } from './utils';
import { columns1,codes } from './utils';
import { transferLanguage,columnConfiguration } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
@connect(({ warehouseArea, common, loading,i18n }) => ({
  warehouseArea,
  dictObject: common.dictObject,
  id: warehouseArea.id,
  loading: loading.models.warehouseArea,
  language: i18n.language,
}))
@Form.create()
export default class WarehouseAreaOperate extends Component {
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
      _columns1:[],
    };
  }
  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
      _columns1:columnConfiguration(columns1,this.props.language)
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
      type: 'warehouseArea/warehouseAreaDetails',
      payload: { id: ID },
      callback: data => {
        this.setState({
          senders: [{ id: data.senderId }],
          beUseRule: data.beUseRule,
          warehouse:[{code:data.warehouseCode,id:data.warehouseId}]
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
        const {warehouse,currentId}=this.state
        const { senders,warehouseId, ...value } = values;
        const { dispatch,} = this.props;
        value.warehouseId = warehouseId&&warehouseId[0]?warehouseId[0].id:warehouse[0].id;
        if (currentId) {
          value.id = currentId;
          dispatch({
            type: 'warehouseArea/warehouseAreaOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('warehouseArea/warehouseAreaList', {});
              this.dispatchFun('warehouseArea/warehouseAreaDetails', { id: currentId});
            },
          });
        } else {
          dispatch({
            type: 'warehouseArea/warehouseAreaOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              // this.setState({ showRecord: true });
              dispatch({
                type: 'warehouseArea/warehouseAreaDetails',
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
                        router.push(`/basicData/listWareHouseArea/editWareHouseArea/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('warehouseArea/interfaceTypeList', {});
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
      _columns1,
    } = this.state;
    const {
      warehouseArea: { warehouseAreaDetails, eventReceiverList },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
      language,
    } = this.props;

    const currentId = params.id;
    let selectDetails = warehouseAreaDetails[currentId];
    const checkDisabled = selectDetails ? true : false;
    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.businessTypeCode : transferLanguage('Area.field.addArea',language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            code={codes.edit}
            text={transferLanguage('base.prompt.edit',language)}
          />
        ) : (
          <Button.Group>
            <Button type="primary" onClick={e => this.operatePaneButton(e)}>
            {transferLanguage('base.prompt.save',language)}
            </Button>
            {currentId && (
              <AdButton
                onClick={() => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                }}
                text={transferLanguage('base.prompt.cancel',language)}
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
                      <Form.Item label={transferLanguage('Area.field.code', this.props.language)}>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.code : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={ transferLanguage('Area.field.name', this.props.language)}>
                        {getFieldDecorator('name', {
                          initialValue: selectDetails ? selectDetails.name : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      {/* <Form.Item label="仓库">
                        {getFieldDecorator('warehouseId', {
                          initialValue: selectDetails ? selectDetails.warehouseId : '',
                        })(<Input placeholder="" disabled={disabled} />)}
                      </Form.Item> */}
                      <Form.Item label={transferLanguage('Area.field.warehouseName', this.props.language)}>
                        {getFieldDecorator('warehouseId', {
                          rules: [{ required: true, message: '请输入' }],
                          // initialValue:warehouse&&warehouse [0]?warehouse.code:''
                          initialValue:selectDetails ? selectDetails.warehouseCode : '',
                        })(
                          <SearchSelect
                            dataUrl="wms-warehouse/selectWmsWarehouseList"
                            selectedData={warehouse} // 选中值
                            multiple={false} // 是否多选
                            showValue="code"
                            searchName="code"
                            columns={_columns1} // 表格展示列
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
                      <Form.Item label={transferLanguage('Area.field.beActive', this.props.language)}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue:
                            selectDetails && selectDetails.status == 'DISABLE' ? transferLanguage('Common.field.disable',language) : transferLanguage('Common.field.enable',language),
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
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('Area.field.description', this.props.language)}>
                        {getFieldDecorator('description', {
                          initialValue: selectDetails && selectDetails.description
                        })(
                          <TextArea placeholder="" disabled={disabled} rows={4} />
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
