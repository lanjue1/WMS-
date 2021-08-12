import React, { Component } from 'react';
import { Form, Col, Row, Input, Select, DatePicker, Modal, Icon, Button } from 'antd';
import { connect } from 'dva';
import prompt from '@/components/Prompt';
import DDlogin from './DDlogin';
import styles from '@/pages/Operate.less';

@connect(({ passwd, loading }) => ({
  passwd,
  loading: loading.effects['passwd/forgetPasswd'],
}))
@Form.create()
export default class passwdForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: ['1'],
      fileList: [],
    };
    this.paneSize = ['1'];
  }

  componentDidMount() {
    // this.props.onRef(this);
  }

  // 切换收缩框
  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  // 添加 或 编辑操作
  operatePaneButton = () => {
    const changeToken = localStorage.getItem('changeToken')
      ? localStorage.getItem('changeToken')
      : '';
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!changeToken) {
        prompt({ type: 'error', title: '温馨提示', content: '扫描获取信息不成功，请重试' });
        return;
      }
      if (values.newPasswd !== values.newPasswd1) {
        prompt({ type: 'error', title: '温馨提示', content: '两次输入的密码不一致，请重新输入' });
        return;
      }
      if (!err && changeToken) {
        let params = {};
        // params.oldPasswd = values.oldPasswd;
        params.passwd = values.newPasswd;
        params.changeToken = changeToken;
        dispatch({
          type: 'passwd/forgetPasswd',
          payload: params,
          callback: res => {
            this.props.changeVal(true);
          },
        });
      }
    });
  };

  render() {
    const {
      type,
      form: { getFieldDecorator },
      visible,
      gotoUrl,
    } = this.props;
    const colMD = type == 'index' ? '' : { span: 9, offset: 2 };

    const options = {
      id: 'login-container',
      goto: gotoUrl,
      style: 'border:0;background-color:transparent;',
      width: '350px',
      height: '350px',
    };
    // console.log('组件-----this.gotoUrl', gotoUrl);

    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          {!visible ? (
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={colMD} sm={24}>
                <div className={styles.customDD}>
                  <DDlogin options={options} />
                </div>
              </Col>
            </Row>
          ) : (
            <div style={{ marginTop: 20 }}>
              <h3 style={{ textAlign: 'center', marginBottom: 10 }}>修改密码</h3>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={colMD} sm={24}>
                  <Form.Item label="新密码">
                    {getFieldDecorator('newPasswd', {})(<Input.Password placeholder="请输入" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={colMD} sm={24}>
                  <Form.Item label="确认密码">
                    {getFieldDecorator('newPasswd1', {})(<Input.Password placeholder="请输入" />)}
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {/* <Button onClick={this.goback} style={{}}>
            返回登录
          </Button> */}
                <Button
                  onClick={() => this.operatePaneButton()}
                  type="primary"
                  style={{ width: 120, marginTop: 20, marginBottom: 10 }}
                >
                  保存
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    );
  }
}
