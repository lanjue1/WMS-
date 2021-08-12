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
  Radio
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
              this.getSelectDetails(this.state.currentId)
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
        <span>{details ? details.beanName : transferLanguage('listCrontab.field.NewTimedTasks', this.props.language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('listCrontab.field.edit', this.props.language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.operatePaneButton(e)}>
                {transferLanguage('listCrontab.field.save', this.props.language)}
            </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('listCrontab.field.cancel', this.props.language)}
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
            <Panel header={transferLanguage('listCrontab.field.SystemConfigurationInformation', this.props.language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('listCrontab.field.TaskActuator', this.props.language)}>
                        {getFieldDecorator('beanName', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.beanName : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('listCrontab.field.expression', this.props.language)}>
                        {getFieldDecorator('cron', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.cron : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('listCrontab.field.TaskGroup', this.props.language)}>
                        {getFieldDecorator('jobGroup', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.jobGroup : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('listCrontab.field.TaskName', this.props.language)}>
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
                      <Form.Item label={transferLanguage('listCrontab.field.TaskDescription', this.props.language)}>
                        {getFieldDecorator('description', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.description : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('listCrontab.field.TaskExecutionArea', this.props.language)}>
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
                      <Form.Item label={transferLanguage('listCrontab.field.taskParameters', this.props.language)}>
                        {getFieldDecorator('parameter', {
                          // rules: [{ required: true, message: '请输入' }],
                          initialValue: details ? details.parameter : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('listCrontab.field.TaskStatus', this.props.language)}>
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
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('listCrontab.field.timeZone', this.props.language)}>
                        {getFieldDecorator('timeZone', {
                          initialValue: details ? details.timeZone : '',
                        })(<Select disabled={disabled} placeholder={'请选择时区'} style={{ width: '100%' }} allowClear={true}>

                          {['UTC+7', 'UTC+8', 'UTC+9'].map(v => {
                            return <Option value={v}>{v}</Option>;
                          })}
                        </Select>)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('listCrontab.field.SerializeOrNot', this.props.language)}>
                        {getFieldDecorator('isSerialization', {
                          initialValue: details ? details.isSerialization : '',
                        })(<Radio.Group>
                          <Radio value={true}>yes</Radio>
                          <Radio value={false}>no</Radio>
                        </Radio.Group>)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('listCrontab.field.remark', this.props.language)}>
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
