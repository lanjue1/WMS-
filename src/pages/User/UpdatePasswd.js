import React, { Component } from 'react';
import { Collapse, Form, Col, Row, Input, Select, DatePicker, Modal, Icon, Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import prompt from '@/components/Prompt';
import PasswdForm from './PasswdForm';
import styles from '@/pages/Operate.less';
const dateFormat = 'YYYY-MM-DD HH:mm';
const Panel = Collapse.Panel;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ passwd, loading }) => ({
  passwd,
  loading: loading.effects['passwd/updatePasswd'],
}))
@Form.create()
export default class RepairOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: ['1'],
      fileList: [],
    };
    this.paneSize = ['1'];
  }

  // 切换收缩框
  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  // 添加 或 编辑操作
  operatePaneButton = e => {
    e.stopPropagation();
    e.preventDefault();
    // this.child.operatePaneButton();
    const { dispatch } = this.props;

    const { id } = this.state;

    this.props.form.validateFields((err, values) => {
      if (values.newPasswd !== values.newPasswd1) {
        prompt({ type: 'error', title: '温馨提示', content: '两次输入的密码不一致，请重新输入' });
        return;
      }
      if (!err) {
        let params = {};
        params.oldPasswd = values.oldPasswd;
        params.newPasswd = values.newPasswd;
        dispatch({
          type: 'passwd/updatePasswd',
          payload: params,
        });
      }
    });
  };
  onRef = ref => {
    this.child = ref;
  };

  render() {
    const {
      type,
      form: { getFieldDecorator },
      // match: { params },
    } = this.props;
    const { id, activeKey } = this.state;
    console.log('type', type);

    const genExtraBasicInfo = () => (
      <div className={styles.headerTitle}>
        <span />
        <div>
          <Button type="primary" onClick={e => this.operatePaneButton(e)}>
            保存
          </Button>
        </div>
      </div>
    );
    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse activeKey={activeKey} onChange={key => this.callback(key)} bordered={false}>
            {this.paneSize.map((item, panelId) => {
              return (
                <Panel header="" key={`${panelId + 1}`} className={styles.customPanelStyle}>
                  {panelId === 0 && (
                    // <PasswdForm type="" onRef={this.onRef} />
                    <div className={styles.tableListForm}>
                      <Form layout="inline">
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col md={{ span: 9, offset: 2 }} sm={24}>
                            <Form.Item label="原始密码">
                              {getFieldDecorator('oldPasswd', {
                                // initialValue: params && params.oldPasswd ? params.oldPasswd : '',
                              })(<Input.Password placeholder="请输入" />)}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col md={{ span: 9, offset: 2 }} sm={24}>
                            <Form.Item label="新密码">
                              {getFieldDecorator('newPasswd', {})(
                                <Input.Password placeholder="请输入" />
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col md={{ span: 9, offset: 2 }} sm={24}>
                            <Form.Item label="确认密码">
                              {getFieldDecorator('newPasswd1', {})(
                                <Input.Password placeholder="请输入" />
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </div>
                  )}
                </Panel>
              );
            })}
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
