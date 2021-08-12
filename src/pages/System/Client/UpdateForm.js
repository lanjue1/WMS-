import React, { Component } from 'react';
import { connect } from 'dva';
import moment, { isDate } from 'moment';
import router from 'umi/router';
import {
  Modal,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Collapse,
  DatePicker,
  Upload,
  PageHeader,
  Divider,
  Table,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import styles from '@/pages/Operate.less';
import prompt from '@/components/Prompt';
import SearchSelect from '@/components/SearchSelect';
import AdButton from '@/components/AdButton';
import { transferLanguage } from '@/utils/utils';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
let VehicleAarr = ['loginName', 'sysName', 'mobile', '所属业务组织', 'remarks'];

@connect(({ client, common, loading, i18n }) => ({
  client,
  ownCompany: common.ownCompany,
  dictObject: common.dictObject,
  loading: loading.effects['client/roleList'],
  language: i18n.language,
}))
@Form.create()
export default class UpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: '',
      activeKey: ['1', '2'],
      visible: false,
      roles: [],
      selectedRows: [],
      organizations: [],
      disabled: false,
    };
  }

  columns = [
    {
      title: transferLanguage('RoleList.field.code', this.props.language),
      dataIndex: 'code',
      // fixed: this.props.isMobile ? false : true,
      // width: this.props.isMobile ? 'auto' : 150,
      // render: (text, record) => <a onClick={() => this.showDetail(record.id)}>{text}</a>,
    },
    {
      title: transferLanguage('RoleList.field.name', this.props.language),
      dataIndex: 'name',
    },
    {
      title: transferLanguage('RoleList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
    },
    {
      title: transferLanguage('RoleList.field.remark', this.props.language),
      dataIndex: 'remark',
    },
  ];

  componentDidMount() {
    const {
      dispatch,
      dictObject,
      match: {
        params: { id },
      },
    } = this.props;

    this.setState({
      currentId: id,
    });
    if (id) {
      this.getSelectDetails(id);
    } else {
      this.props.form.resetFields(VehicleAarr);
    }
  }

  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'client/selectDetails',
      payload: { id: ID },
      callback: res => {
        this.setState({
          organizations: [{ id: res.orgId }],
        });
      },
    });
  };
  //保存基本信息：
  saveBasicInfo = e => {
    e.stopPropagation();
    const { currentId, organizations } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { roles, ...value } = values;
      if (roles) {
        value.roleId = roles.map(v => v.id);
      }
      //编辑时传入id
      if (currentId) {
        value.id = currentId;
      }
      this.props.dispatch({
        type: 'client/cliOperate',
        payload: value,
        callback: res => {
          this.setState(preState => ({
            disabled: !preState.disabled,
          }));
          if (res.data) {
            this.setState({
              currentId: res.data, //新增成功，获取id
            });
            this.detailCallback(res.data);
          }
        },
      });
    });
  };

  detailCallback = res => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/setTabsName',
      payload: {
        id: res,
        // name: data.oilNo,
        isReplaceTab: true,
      },
      callback: result => {
        if (result) {
          router.push(`/system/CliList/edit-form/${res}`);
        }
      },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  //确认绑定或移除角色
  handleOK = (ids, cliId) => {
    let params = {};
    params.roleId = ids;
    params.userId = cliId;
    this.props.dispatch({
      type: 'client/roleOperate',
      payload: params,
      callback: res => {
        this.setState({
          visible: false,
        });
        this.getRoleListBind(cliId);
      },
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  getValue = values => {
    this.setState({
      roles: values,
    });
  };
  getValueOrg = values => {
    this.setState({
      organizations: values,
    });
  };

  render() {
    const { currentId, visible, disabled, roles, selectedRows, organizations } = this.state;
    const { form, ownCompany, dictObject, loadingRole, loading } = this.props;
    const { getFieldDecorator } = form;
    let selectDetails = {};
    if (currentId) {
      selectDetails = this.props.client.selectDetails[currentId];
    } else {
      selectDetails.status = 'ENABLE';
    }
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {currentId
            ? transferLanguage('Client.field.edit', this.props.language)
            : transferLanguage('Client.field.add', this.props.language)}
        </span>

        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('Client.field.edit', this.props.language)}
          />
        ) : (
          <Button.Group>
            <Button type="primary" onClick={e => this.saveBasicInfo(e)}>
              {transferLanguage('Client.field.save', this.props.language)}
            </Button>
            {currentId && (
              <AdButton
                onClick={() => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                }}
                text={transferLanguage('Client.field.cancel', this.props.language)}
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
            <Panel
              header={transferLanguage('Client.field.baseInfo', this.props.language)}
              key="1"
              style={customPanelStyle}
            >
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item
                        label={transferLanguage('Client.field.name', this.props.language)}
                      >
                        {getFieldDecorator('name', {
                          rules: [{ required: true }],
                          initialValue: selectDetails ? selectDetails.name : '',
                        })(
                          <Input
                            disabled={
                              disabled || (selectDetails && selectDetails.category ? true : false)
                            }
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item
                        label={transferLanguage('Client.field.code', this.props.language)}
                      >
                        {getFieldDecorator('code', {
                          rules: [{ required: true }],
                          initialValue: selectDetails ? selectDetails.code : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item
                        label={transferLanguage(
                          'Client.field.simpleName',
                          this.props.language
                        )}
                      >
                        {getFieldDecorator('simpleName', {
                          initialValue: selectDetails ? selectDetails.simpleName : '',
                        })(
                          <Input
                            disabled={
                              disabled || (selectDetails && selectDetails.category ? true : false)
                            }
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item
                        label={transferLanguage('Client.field.status', this.props.language)}
                      >
                        {getFieldDecorator('status', {
                          initialValue: selectDetails ? selectDetails.status : 'ENABLE',
                        })(
                          <Select disabled={disabled}>
                            <Option value="ENABLE">ENABLE</Option>
                            <Option value="DISABLE">DISABLE</Option>
                          </Select>
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item
                        label={transferLanguage(
                          'Client.field.classification',
                          this.props.language
                        )}
                      >
                        {getFieldDecorator('classification', {
                          initialValue: selectDetails ? selectDetails.classification : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item
                        label={transferLanguage('RoleList.field.remark', this.props.language)}
                      >
                        {getFieldDecorator('remarks', {
                          initialValue: selectDetails ? selectDetails.remarks : '',
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
