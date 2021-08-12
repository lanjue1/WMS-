import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, Button } from 'antd';
import Login from '@/components/Login';
import prompt from '@/components/Prompt';
import DDlogin from './DDlogin';
import styles from './Login.less';
import { router } from 'umi';
import PasswdForm from './PasswdForm';
import { getQueryString } from '@/utils/common';
// import * as dd from 'dingtalk-jsapi';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    showPassPag: false,
    visible: false,
    STATE: 'LOGIN',
    gotoUrl: '',
  };
  // 登录的时候传 LOGIN    修改密码传 CHANGE
  ddLoginurl = encodeURIComponent(`${window.location.origin}/server/api/login/ddLogin`);
  appid =
    window.location.protocol === 'https:'
      ? 'dingoa3ylllifgbfn5humi'
      : window.location.hostname === 'training.hichain.com'
      ? 'dingoawwqims8e9wos90le'
      : 'dingoaetrs4drsqkoehqxd';
  LoginState = window.location.protocol === 'https:' ? 'HTTPSLOGIN' : 'LOGIN';
  changeState = window.location.protocol === 'https:' ? 'CHANGE' : 'HTTPSCHANGE';
  //dingoa3ylllifgbfn5humi(https) dingoaetrs4drsqkoehqxd (测试) dingoawwqims8e9wos90le （生产）

  componentWillMount() {
    // 触发回调时处理回调链接,举例：如果查询字符串中含有state,且为dinglogin（可自行设置）,
    // 则触发扫描登录的相应处理方法，比如登录。

    const token = getQueryString('token');
    const changeToken = getQueryString('changeToken');
    if (token) {
      localStorage.setItem('token', token);
      router.push('/');
    } else if (changeToken) {
      this.setState({
        showPassPag: true,
        visible: true,
      });
      localStorage.setItem('changeToken', changeToken);
    } else {
      if (localStorage.getItem('token')) {
        router.push('/');
        return;
      }
      const errorMsg = getQueryString('errorMsg');
      if (errorMsg) {
        prompt({
          type: 'error',
          title: `请求出错`,
          content: decodeURI(errorMsg),
        });
      }
    }
  }

  componentDidMount() {
    // 监听消息处理方法
    const { dispatch } = this.props;
    const handleMessage = event => {
      // 获取消息来源
      const origin = event.origin;
      // 如果来源为https://login.dingtalk.com，则在当前窗口打开回调链接
      // console.log('event', event);
      if (origin === 'https://login.dingtalk.com') {
        const loginTempCode = event.data;
        window.open(encodeURI(`${this.state.gotoUrl}&loginTmpCode=${loginTempCode}`), '_parent');
      }
    };
    // 监听iframe的消息
    if (typeof window.addEventListener != 'undefined') {
      window.addEventListener('message', handleMessage, false);
    } else if (typeof window.attachEvent != 'undefined') {
      window.attachEvent('onmessage', handleMessage);
    }
  }

  onTabChange = type => {
    this.setState({ type });
    if (type === 'nailCode') {
      this.setState({
        STATE: 'LOGIN',
        gotoUrl: `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${
          this.appid
        }&response_type=code&scope=snsapi_login&state=${this.LoginState}_${Math.floor(
          Math.random() * 90000
        ) + 10000}&redirect_uri=${this.ddLoginurl}`,
      });
    }
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
        callback:()=>{
        
        }
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  handlePassword = e => {
    e.preventDefault();
    this.setState({
      showPassPag: true,
      STATE: 'CHANGE',
      gotoUrl: `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${
        this.appid
      }&response_type=code&scope=snsapi_login&state=${this.changeState}_${Math.floor(
        Math.random() * 90000
      ) + 10000}&redirect_uri=${this.ddLoginurl}`,
    });
  };

  changeVal = val => {
    this.setState({
      showPassPag: false,
    });
  };

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin, showPassPag, visible, gotoUrl } = this.state;

    const options = {
      id: 'login-container',
      goto: gotoUrl,
      style: 'border:0;background-color:transparent;',
      width: '350px',
      height: '350px',
    };

    return (
      <div className={styles.main}>
        {showPassPag ? (
          <div style={{ paddingTop: '15px', margin: '0 auto' }}>
            <PasswdForm
              type="index"
              onRef={this.onRef}
              visible={visible}
              changeVal={this.changeVal}
              gotoUrl={gotoUrl}
            />
            <a onClick={this.changeVal} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              返回登录
            </a>
          </div>
        ) : (
          <Login
            defaultActiveKey={type}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
            ref={form => {
              this.loginForm = form;
            }}
          >
            <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
              {login.status === 'error' &&
                login.type === 'account' &&
                !submitting &&
                this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
              <UserName
                name="loginName"
                placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.userName.required' }),
                  },
                ]}
              />
              <Password
                name="loginPwd"
                placeholder={`${formatMessage({ id: 'app.login.password' })}`}
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'validation.password.required' }),
                  },
                ]}
                onPressEnter={e => {
                  e.preventDefault();
                  this.loginForm.validateFields(this.handleSubmit);
                }}
              />
            </Tab>
            <Tab key="nailCode" tab={formatMessage({ id: 'app.login.tab-login-nailCode' })}>
              {login.status === 'error' &&
                login.type === 'nailCode' &&
                !submitting &&
                this.renderMessage(
                  formatMessage({ id: 'app.login.message-invalid-verification-code' })
                )}

              {type === 'nailCode' && (
                <div className={styles.customDD}>
                  <DDlogin options={options} />
                </div>
              )}
              {/* <div>
            <iframe
              src={NailCode}
              style={{ width: '350px', height: '350px', border: 'none' }}
              scrolling="no"
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          </div> */}
            </Tab>
            {/* <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
          {login.status === 'error' &&
            login.type === 'mobile' &&
            !submitting &&
            this.renderMessage(
              formatMessage({ id: 'app.login.message-invalid-verification-code' })
            )}
          <Mobile
            name="mobile"
            placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.phone-number.required' }),
              },
              {
                pattern: /^1\d{10}$/,
                message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
            countDown={120}
            onGetCaptcha={this.onGetCaptcha}
            getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}
            getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.verification-code.required' }),
              },
            ]}
          />
        </Tab> */}
            <div>
              {/* <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
            <FormattedMessage id="app.login.remember-me" />
          </Checkbox> */}

              {type === 'account' && (
                <a
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                  onClick={event => this.handlePassword(event)}
                >
                  <FormattedMessage id="app.login.forgot-password" />
                </a>
              )}
            </div>
            {type == 'account' && (
              <Submit loading={submitting}>
                <FormattedMessage id="app.login.login" />
              </Submit>
            )}

            {/* <div className={styles.other}>
          <FormattedMessage id="app.login.sign-in-with" />
          <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
          <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
          <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
          <Link className={styles.register} to="/user/register">
            <FormattedMessage id="app.login.signup" />
          </Link>
        </div> */}
          </Login>
        )}
      </div>
    );
  }
}

export default LoginPage;
