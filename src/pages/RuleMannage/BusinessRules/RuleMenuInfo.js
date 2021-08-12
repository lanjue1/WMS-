import React, { Component, Fragment } from 'react';
import { Icon, Form, Input, Modal, Select, Button, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Info.less';
import _styles from './index.less';
import prompt from '@/components/Prompt';
const { TextArea } = Input;
const confirm = Modal.confirm;

@connect(({ businessRules, loading }) => ({
  businessRules,
  ruleMenuDetails: businessRules.ruleMenuDetails,
  loading: loading.effects['businessRules/ruleMenuDetails'],
}))
@Form.create()
export default class DirectoryInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handleType: 'Rule'
    };
  }
  componentDidMount() { }

  // 新增或编辑操作
  saveInfo = () => {
    const {
      form,
      dispatch,
      id,
      ruleMenuDetails,
      getRuleMenuList,
      setExpandedKeys,
      handleChildStateChange,
      handleType,
    } = this.props;
    const details = ruleMenuDetails;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { ...value } = values;
      value.parentId = id;
      // value.type = 'MENU';
      if (handleType == 'editMenu' && details.id) {
        value.id = details.id;
        value.parentId = details.parentId
      }
      dispatch({
        type: 'businessRules/ruleMenuOperate',
        payload: value,
        callback: data => {
          dispatch({
            type: 'businessRules/ruleMenuDetails',
            payload: { id: value.id ? id : data }
          })
          getRuleMenuList({ id }, 'child');
          setExpandedKeys(id);
          if (handleType == 'addMenu') {
            handleChildStateChange([
              { handleType: 'editMenu', checkId: data, selectedKeys: [data] },
            ]);
          }
        },
      });
    });
  };

  changeBtnStatus = () => {
    const { handleChildStateChange, isMenuEdit } = this.props;
    handleChildStateChange([{ isMenuEdit: !isMenuEdit }]);
  };
  //删除
  confirmDel = () => {
    const { dispatch, id, delDataFormat, handleChildStateChange } = this.props;
    // const { globalListData } = this.state;

    confirm({
      title: '确认删除这条数据吗?',
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'businessRules/deleteRuleMenu',
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
      ruleMenuDetails,
      id,
      handleType,
      handleChildStateChange,
      isMenuEdit,
    } = this.props;
    const { } = this.state;

    const modeEdit = handleType == 'editMenu' ? true : false;
    const details = modeEdit ? ruleMenuDetails : {};
    return (
      <Fragment>
        <div className={`${styles.tableListForm} ${_styles.content_right}`}>
          <Form layout="inline">
            <Row>
              <Col md={{ span: 24 }} sm={24}>
                <Form.Item label="目录名称">
                  {getFieldDecorator('menuName', {
                    rules: [{ required: true, message: '请选择' }],
                    initialValue: details.menuName,
                  })(<Input style={{ width: '100%' }} disabled={isMenuEdit} />)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('remarks', { initialValue: details.remarks })(
                    <TextArea rows={4} disabled={isMenuEdit} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <div className={_styles.btnBox} style={{ marginTop: 20 }}>
            <div className={_styles.btnBox_left}>
              {isMenuEdit && (
                <Button.Group>
                  <Button
                    onClick={() => {
                      handleChildStateChange([
                        {
                          handleType: 'addRule',
                          ruleType: 'RULE',
                          menuType: 'Rule',
                          ruleDetails: {},
                          isRuleEdit: false,
                        },
                      ]);
                      this.setState({ handleType: 'addRule' })
                    }}
                    type="primary"
                    disabled={!visible}
                  >
                    <Icon type="file-text" />
                    添加规则
                  </Button>
                  <Button
                    onClick={() => {
                      handleChildStateChange([
                        {
                          handleType: 'addRule',
                          ruleType: 'SOURCE',
                          menuType: 'Rule',
                          ruleDetails: {},
                          isRuleEdit: false,
                        },
                      ]);
                      this.setState({ handleType: 'addRule' })
                    }}
                    //   type="primary"
                    disabled={!visible}
                  >
                    <Icon type="file-exclamation" />
                    添加数据集
                  </Button>
                </Button.Group>
              )}
            </div>

            <div className={_styles.btnBox_right} style={{ display: 'flex' }}>
              {isMenuEdit && (
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
              <Button.Group>
                {isMenuEdit ? (
                  <Button.Group>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.changeBtnStatus();
                        handleChildStateChange([{ handleType: 'addMenu' }]);
                      }}
                      disabled={!visible}
                    >
                      添加目录
                    </Button>
                    <Button hidden={details.id === '1'} onClick={() => this.changeBtnStatus()} disabled={!visible}>
                      编辑
                    </Button>
                  </Button.Group>
                ) : (
                    <>
                      <Button onClick={this.saveInfo} type="primary" disabled={!visible}>
                        保存
                    </Button>
                      {id && handleType !== 'addMenu' && (
                        <Button onClick={() => this.changeBtnStatus()} disabled={!visible}>
                          取消
                        </Button>
                      )}
                    </>
                  )}
              </Button.Group>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
