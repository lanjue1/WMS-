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
import { transferLanguage } from '@/utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(({ crontab, common, loading, i18n }) => ({
  crontab,
  dictObject: common.dictObject,
  id: crontab.id,
  loading: loading.models.crontab,
  language: i18n.language

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
      crontab: { crontabDetails },
    } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
    });
    if (crontabDetails[ID]) return;
    if (ID) {
      this.getSelectDetails(ID);
    } else {
      form.resetFields();
    }
  }
  componentWillReceiveProps(nextProps) { }
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'crontab/crontabDetails',
      payload: { id: ID },
      callback: data => { },
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
            type: 'crontab/crontabOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('crontab/crontabList', {});
            },
          });
        } else {
          dispatch({
            type: 'crontab/crontabOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              dispatch({
                type: 'crontab/crontabDetails',
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
                        router.push(`/system/crontabList/crontabEdit/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('crontab/crontabList', {});
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
      crontab: { crontabDetails },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      loading,
      language
    } = this.props;

    const currentId = params.id;
    let details = crontabDetails[currentId];

    const checkDisabled = details ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{details && currentId ? details.dictType : transferLanguage('ScheduledTaskLogList.field.addScheduledTaskLogList', this.props.language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('ScheduledTaskLogList.field.edit', this.props.language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
                {transferLanguage('ScheduledTaskLogList.field.save', this.props.language)}
            </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('ScheduledTaskLogList.field.cancel', this.props.language)}
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
            <Panel header={transferLanguage('ScheduledTaskLogList.field.SystemConfigurationInformation', this.props.language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.TaskActuator', this.props.language)}>
                        {getFieldDecorator('beanName', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.beanName : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.cronExpression', this.props.language)}>
                        {getFieldDecorator('cron', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.cron : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.TaskGroup', this.props.language)}>
                        {getFieldDecorator('jobGroup', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.jobGroup : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.name', this.props.language)}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.name : '',
                        })(
                          <Input disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.TaskDdescription', this.props.language)}>
                        {getFieldDecorator('description', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.description : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.TaskExecutionArea', this.props.language)}>
                        {getFieldDecorator('executionArea', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.executionArea : '',
                        })(
                          <Input disabled={disabled} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.taskParameters', this.props.language)}>
                        {getFieldDecorator('parameter', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.parameter : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.taskStatus', this.props.language)}>
                        {getFieldDecorator('status', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.status : '',
                        })(
                          <Select placeholder="请选择" disabled={disabled}>
                            <Option value={'OPEN'} key={'OPEN'}>
                            OPEN 
                          </Option>
                            <Option value={'CLOSE'} key={'CLOSE'}>
                              CLOSE
                          </Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.timeZone', this.props.language)}>
                        {getFieldDecorator('timeZone', {
                          initialValue: details ? details.timeZone : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('ScheduledTaskLogList.field.remark', this.props.language)}>
                        {getFieldDecorator('remark', {
                          initialValue: details ? details.remark : '',
                        })(<TextArea rows={4} disabled={disabled} />)}
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
