import React, { Component, Fragment } from 'react';
import { Icon, Form, Input, Modal, Select, Row, Col, Button, Radio } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Info.less';
import _styles from './index.less';
import prompt from '@/components/Prompt';
import Debug from './Debug';
import CodeEditor from './CodeEditor';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
import { saveAllValue } from './utils';

const { TextArea } = Input;
const confirm = Modal.confirm;

@connect(({ businessRules, loading }) => ({
  businessRules,
  jsonData: businessRules.jsonData,
  dataSourceList: businessRules.dataSourceList,
  ruleMenuConDetails: businessRules.ruleMenuConDetails,
  loading: loading.effects['businessRules/ruleMenuConDetails'],
}))
@Form.create()
export default class RuleContentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      debugData: '',
      visibleDebug: false,
      isRuleEdit: true,
      details: props.ruleMenuConDetails,
      isUpdate: false,
      id: '',
    };
  }

  componentDidMount() {
    this.getSourceList();
  }
  getSourceList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessRules/dataSourceList',
      payload: {},
    });
  };
  getSnapshotBeforeUpdate(prevProps, prevState) {
    const details = prevProps.ruleMenuConDetails;
    const { id } = this.state;
    if (details.id && (!id || id !== details.id)) {
      this.setState({
        id: details.id,
      });
      const { form } = this.props;
      //手动设置表单必填的值：因为编辑后再切换菜单项数据不会更新
      if (prevProps.handleType === 'addRule') {
        return
      }
      const requireArr = ['name', 'dataSource', 'content'];
      requireArr.forEach(v => {
        this.props.form.setFieldsValue({ [v]: details[v] });
      });
    }
  }

  // 新增或编辑操作
  saveInfo = () => {
    const {
      form,
      dispatch,
      id,
      ruleMenuConDetails,
      getRuleMenuList,
      setExpandedKeys,
      handleChildStateChange,
      handleType,
      ruleType,
      jsonData
    } = this.props;
    const modeEdit = handleType == 'editRule' ? true : false;
    const details = modeEdit ? ruleMenuConDetails : {};

    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { ...value } = values;
      //判断编辑、新增要传的参数
      const menuId = modeEdit ? details.menuId : id;
      value.menuId = menuId;
      if (ruleType == 'RULE') {
        if (JSON.stringify(jsonData) == '{}' || !jsonData) {
          prompt({ content: '规则不允许为空' });
          return
        }
        value.content = jsonData
      }
      if (details.id) {
        value.id = details.id;
      }
      console.log('新增测试数据', value)
      dispatch({
        type: 'businessRules/ruleMenuConOperate',
        payload: value,
        callback: data => {
          // this.handleCancel();
          saveAllValue({ payload: { jsonData: {} }, props: this.props })
          getRuleMenuList({ id: menuId }, 'child');
          setExpandedKeys(id);
          dispatch({
            type: 'businessRules/ruleMenuConDetails',
            payload: { id: details.id ? details.id : data }
          })
          this.changeBtnStatus();
          if (handleType == 'addRule') {
            handleChildStateChange([
              { handleType: 'editRule', checkId: data, selectedKeys: [data] },
            ]);
          }
        },
      });
    });
  };
  debugFn = () => {
    this.setState({
      visibleDebug: true,
    });
  };

  handleCancel = () => {
    this.setState(pre => ({
      visibleDebug: !pre.visibleDebug,
    }));
  };
  changeBtnStatus = () => {
    const { handleChildStateChange, isRuleEdit } = this.props;
    handleChildStateChange([{ isRuleEdit: !isRuleEdit }]);
    saveAllValue({ payload: { jsonData: {} }, props: this.props })
    // this.setState(pre => ({
    //   isRuleEdit: !pre.isRuleEdit,
    // }));
  };
  //发布：
  operateRuleMenuCon = type => {
    const { dispatch, id, ruleMenuConDetails, handleType, getRuleMenuList } = this.props;
    const modeEdit = handleType == 'editRule' ? true : false;
    const details = modeEdit ? ruleMenuConDetails : {};

    dispatch({
      type: 'businessRules/operateRuleMenuCon',
      payload: { id, type },
      callback: res => {
        dispatch({
          type: 'businessRules/ruleMenuConDetails',
          payload: { id },
          callback: () => {
            this.setState(pre => ({
              isUpdate: !pre.isUpdate,
            }));
          },
        });
        getRuleMenuList({ id: details.menuId }, 'child');
      },
    });
  };

  //删除
  confirmDel = () => {
    const { dispatch, id, delDataFormat, handleChildStateChange } = this.props;
    confirm({
      title: '确认删除这条数据吗?',
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'businessRules/deleteRuleMenuCon',
          payload: { id },
          callback: res => {
            //前端删除数据：
            delDataFormat('', id);
            handleChildStateChange([{ visibleRule: false }]);
          },
        });
      },
    });
  };

  render() {
    const {
      visible,
      form: { getFieldDecorator },
      dataSourceList,
      ruleMenuConDetails,
      id,
      handleType,
      handleChildStateChange,
      ruleType,
      isRuleEdit,
    } = this.props;

    const { debugData, visibleDebug } = this.state;
    const modeEdit = handleType == 'editRule' ? true : false;
    const details = modeEdit ? ruleMenuConDetails : {};
    const isRule = ruleType == 'RULE' ? true : false;
    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    return (
      <div className={`${styles.tableListForm} ${_styles.content_right}`}>
        <Form layout="inline">
          <Row gutter={_gutter}>
            <Col {..._row}>
              <div className={`${_styles.btnBox_ab} ${_styles.btnBox}`}>
                {isRuleEdit && modeEdit ? (
                  <div className={_styles.btnBox_left}>
                    <Button.Group>
                      {details && details.status && details.status == 'RELEASE' ? (
                        <Button
                          onClick={() => this.operateRuleMenuCon('cancle')}
                          type="primary"
                          disabled={!visible}
                        >
                          下线
                        </Button>
                      ) : (
                          <Button
                            onClick={() => this.operateRuleMenuCon('release')}
                            type="primary"
                            disabled={!visible}
                          >
                            发布
                          </Button>
                        )}
                      <Button onClick={this.debugFn} disabled={!visible}>
                        调试
                </Button>
                    </Button.Group>
                  </div>
                ) : (
                    <div></div>
                  )}

                <div className={_styles.btnBox_right}>
                  {isRuleEdit && modeEdit && details.status !== 'RELEASE' && (
                    <Button
                      style={{ marginRight: 8 }}
                      onClick={e => this.confirmDel(e)}
                      type="danger"
                      ghost
                      disabled={!visible}
                    >
                      删除
                    </Button>
                  )}
                  <Button.Group hidden={details.status === 'RELEASE'} >
                    {isRuleEdit && modeEdit ? (
                      <Button onClick={() => this.changeBtnStatus()} disabled={!visible}>
                        编辑
                      </Button>
                    ) : (
                        <>
                          <Button onClick={this.saveInfo} type="primary" disabled={!visible}>
                            保存
                  </Button>
                          {modeEdit && (
                            <Button onClick={() => this.changeBtnStatus()} disabled={!visible}>
                              取消
                            </Button>
                          )}
                        </>
                      )}
                    {/* <Button onClick={this.handlePublish} disabled={!visible}>
              编译测试
            </Button> */}
                  </Button.Group>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._row}>
              <Form.Item label="类型">
                {getFieldDecorator('type', {
                  initialValue: details && details.type ? details.type : ruleType,
                })(
                  <Select disabled={true}>
                    <Option value="RULE">规则</Option>
                    <Option value="SOURCE">数据集</Option>
                  </Select>
                )}
              </Form.Item>

            </Col>
          </Row>
          {isRule && (
            <Row gutter={_gutter}>
              <Col {..._row}>
                <Form.Item label="规则名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入' }],
                    initialValue: details && details.name ? details.name : '',
                  })(<Input disabled={isRuleEdit} />)}
                </Form.Item>
              </Col>
            </Row>
          )}

          {!isRule && (
            <div>
              <Row gutter={_gutter}>
                <Col {..._row}>
                  <Form.Item label={isRule ? '数据连接' : '数据源'}>
                    {getFieldDecorator('dataSource', {
                      rules: [{ required: true, message: '请输入' }],
                      initialValue: details && details.dataSource ? details.dataSource : '',
                    })(
                      <Select disabled={isRuleEdit} allowClear={true}>
                        {dataSourceList &&
                          dataSourceList.map(item => <Option key={item}>{item}</Option>)}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={_gutter}>
                <Col {..._row}>
                  <Form.Item label="数据集名称">
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入' }],
                      initialValue: details && details.name ? details.name : '',
                    })(<Input disabled={isRuleEdit} />)}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          <Row gutter={_gutter}>
            <Col {..._row}>
              <Form.Item label="备注">
                {getFieldDecorator('remarks', {
                  initialValue: details && details.remarks ? details.remarks : '',
                })(<TextArea rows={4} disabled={isRuleEdit} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._row}>
              {!isRule ? (<Form.Item label={isRule ? '规则内容' : 'SQL'}>
                {getFieldDecorator('content', {
                  rules: [{ required: true }],
                  initialValue: details && details.content ? details.content : '',
                })(<TextArea rows={isRule ? 17 : 15} disabled={isRuleEdit} />)}
              </Form.Item>)
                :
                <div style={{ paddingLeft: 30, display: 'flex' }} >
                  <label style={{ color: 'rgba(0, 0, 0, 0.85)', margin: '0 10px' }} >规则内容:</label>
                  {!isRuleEdit ? (<CodeEditor type="editRule" value={details && details.content ? details.content : ''} width={800} />)
                    : (<div style={{ width: '100%' }} ><SyntaxHighlighter language="javascript" style={docco}>
                      {details && details.content ? details.content : ''}
                    </SyntaxHighlighter></div>)}
                </div>

              }
            </Col>
          </Row>

        </Form>
        {visibleDebug && (
          <Debug visible={visibleDebug} modalOperate={this.handleCancel} isRule={isRule} id={id} />
        )}
      </div>
    );
  }
}
