import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
} from 'antd';
import prompt from '@/components/Prompt';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import { columns1 } from '@/pages/Common/common';
import styles from '@/pages/Operate.less';
import AdButton from '@/components/AdButton';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(({ sysConfig, common, loading }) => ({
  sysConfig,
  dictObject: common.dictObject,
  id: sysConfig.id,
  loading: loading.models.sysConfig,
}))
@Form.create()
export default class ETCOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      currentId: '',
      selectedRows: [],
      visible: false,
      activeKey: ['1', '2'],
      disabled: false,
    };
  }
  componentDidMount() {
    const {
      match,
      form,
      dispatch,
      sysConfig: { sysConfigDetails },
    } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
    });
    if (sysConfigDetails[ID]) return;
    if (ID) {
      this.getSelectDetails(ID);
    } else {
      form.resetFields();
    }
  }
  componentWillReceiveProps(nextProps) {}
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'sysConfig/sysConfigDetails',
      payload: { id: ID },
      callback: data => {},
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
        const { ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'sysConfig/SysConfigOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('sysConfig/sysConfigList', {});
            },
          });
        } else {
          dispatch({
            type: 'sysConfig/SysConfigOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              dispatch({
                type: 'sysConfig/sysConfigDetails',
                payload: { id: res },
                callback: data => {
                  //新增变编辑页面：
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.configKey,
                      isReplaceTab: true,
                    },
                    callback: result => {
                      if (result) {
                        router.push(`/system/SysConfigList/SysConfigEdit/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('sysConfig/sysConfigList', {});
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

  abledStatus = (e, type) => {
    e.stopPropagation();
    this.child.abledStatus(type);
  };

  render() {
    const { selectedRowKeys, disabled, selectedRows, visible } = this.state;
    const {
      sysConfig: { sysConfigDetails },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      loading,
    } = this.props;

    const currentId = params.id;
    let details = sysConfigDetails[currentId];

    const checkDisabled = details ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{details && currentId ? details.dictType : '新增系统配置'}</span>
        {disabled ? (
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
            <Button type="primary" onClick={e => this.operatePaneButton(e)}>
              保存
            </Button>
            {currentId && (
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
            <Panel header="系统配置信息" key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="配置编码">
                        {getFieldDecorator('configKey', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.configKey : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="名称">
                        {getFieldDecorator('configName', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.configName : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label="配置值">
                        {getFieldDecorator('configValue', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.configValue : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label="系统内置">
                        {getFieldDecorator('beSys', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.beSys : '',
                        })(
                          <Select placeholder="请选择" disabled={disabled}>
                            <Option value={true} key={true}>
                              是
                            </Option>
                            <Option value={false} key={false}>
                              否
                            </Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label="备注信息">
                        {getFieldDecorator('remark', {
                          initialValue: details ? details.remark : '',
                        })(<TextArea  rows={4} disabled={disabled} />)}
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
