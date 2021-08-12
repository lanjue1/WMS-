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

@connect(({ tmsAuth, common, loading, i18n }) => ({
  tmsAuth,
  ownCompany: common.ownCompany,
  dictObject: common.dictObject,
  loading: loading.effects['tmsAuth/roleList'],
  language: i18n.language
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
      title: transferLanguage('AuthList.field.code', this.props.language),
      dataIndex: 'code',
      // fixed: this.props.isMobile ? false : true,
      // width: this.props.isMobile ? 'auto' : 150,
      // render: (text, record) => <a onClick={() => this.showDetail(record.id)}>{text}</a>,
    },
    {
      title: transferLanguage('AuthList.field.name', this.props.language),
      dataIndex: 'name',
    },
    {
      title: transferLanguage('AuthList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
    },
    {
      title: transferLanguage('AuthList.field.remark', this.props.language),
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
      this.getRoleListBind(id);
    } else {
      this.props.form.resetFields(VehicleAarr);
    }
    this.getRoleList();
  }
  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }

  //获取角色信息：已绑定
  getRoleListBind = ID => {
    this.props.dispatch({
      type: 'tmsAuth/selectListBinding',
      payload: { id: ID, pageSize: 100 },
      callback: res => {
        this.setState({
          roles: res,
        });
      },
    });
  };

  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'tmsAuth/selectDetails',
      payload: { id: ID },
      callback: res => {
        this.setState({
          organizations: [{ id: res.orgId }],
        });
      },
    });
  };
  //获取角色列表
  getRoleList = (params = {}) => {
    this.dispatchFun('tmsAuth/roleList', params);
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
      //所属组织：
      const orgId = organizations.map(v => {
        return v.id;
      });
      value.orgId = orgId.join(',');
      //编辑时传入id
      if (currentId) {
        value.id = currentId;
      }
      this.props.dispatch({
        type: 'tmsAuth/authOperate',
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
          router.push(`/system/AuthList/edit-form/${res}`);
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
  handleOK = (ids, authId) => {
    let params = {};
    params.roleId = ids;
    params.userId = authId;
    this.props.dispatch({
      type: 'tmsAuth/roleOperate',
      payload: params,
      callback: res => {
        this.setState({
          visible: false,
        });
        this.getRoleListBind(authId);
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
    const {
      form,
      ownCompany,
      tmsAuth: { selectListBinding, roleList },
      dictObject,
      loadingRole,
      loading,
    } = this.props;
    const { getFieldDecorator } = form;
    let selectDetails = {};
    if (currentId) {
      selectDetails = this.props.tmsAuth.selectDetails[currentId];
    }
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{currentId ? transferLanguage('Common.field.edit', this.props.language) : transferLanguage('Common.field.add', this.props.language)}</span>

        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('Common.field.edit', this.props.language)}
          />
        ) : (
            <Button.Group>
              <Button type="primary" onClick={e => this.saveBasicInfo(e)}>
                {transferLanguage('Common.field.save', this.props.language)}
              </Button>
              {currentId && (
                <AdButton
                  onClick={() => {
                    this.setState(preState => ({
                      disabled: !preState.disabled,
                    }));
                  }}
                  text={transferLanguage('Common.field.cancel', this.props.language)}
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

    const columns1 = [
      {
        title: transferLanguage('AuthList.field.code', this.props.language),
        dataIndex: 'code',
        width: '33.3%',
      },
      {
        title: transferLanguage('AuthList.field.name', this.props.language),
        dataIndex: 'name',
        width: '33.3%',
      },
      {
        title:  transferLanguage('AuthList.field.beActive', this.props.language),
        dataIndex: 'beActive',
        // width: '33.3%',
        render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
      },
    ];

    const columnsOrg = [
      {
        title: transferLanguage('AuthList.field.orgCode', this.props.language),
        dataIndex: 'code',
        width: '33.3%',
      },
      {
        title: transferLanguage('AuthList.field.orgName', this.props.language),
        dataIndex: 'name',
        width: '33.3%',
      },
      // {
      //   title: '业务类型',
      //   dataIndex: 'bizType',
      // },
      {
        title: transferLanguage('AuthList.field.orgParent', this.props.language),
        dataIndex: 'parentName',
        width: '33.3%',
      },
    ];

    const columns2 = [
      {
        title: transferLanguage('AuthList.field.code', this.props.language),
        dataIndex: 'code',
        render: (text, record) => (
          <div className={styles.closeIcon} onClick={() => this._searchSelect.onClose(record.id)}>
            <span>{text}</span>
            <Icon type="close" />
          </div>
        ),
      },
    ];

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
            <Panel header={transferLanguage('AuthList.field.baseInfo', this.props.language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('AuthList.field.loginName', this.props.language)}>
                        {getFieldDecorator('loginName', {
                          rules: [{ required: true}],
                          initialValue: selectDetails ? selectDetails.loginName : '',
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
                      <Form.Item label={transferLanguage('AuthList.field.sysName', this.props.language)}>
                        {getFieldDecorator('sysName', {
                          rules: [{ required: true, }],
                          initialValue: selectDetails ? selectDetails.sysName : '',
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('AuthList.field.orgId', this.props.language)}>
                        {getFieldDecorator('orgId', {
                          rules: [{ required: true }],
                          initialValue: organizations,
                        })(
                          // <Select
                          //   showSearch
                          //   filterOption={(input, option) =>
                          //     option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          //   }
                          //   placeholder="请选择"
                          //   style={{ width: '100%' }}
                          // >
                          //   <Option value="1">业务组织</Option>
                          // </Select>
                          <SearchSelect
                            dataUrl="mds-organization/selectList"
                            url="mds-organization/viewDetails"
                            selectedData={organizations} // 选中值
                            showValue="name"
                            searchName="keyWord"
                            columns={columnsOrg} // 表格展示列
                            onChange={this.getValueOrg} // 获取选中值
                            id="TmsAuth_1_1"
                            disabled={disabled}
                            multiple={false}
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('AuthList.field.mobile', this.props.language)}>
                        {getFieldDecorator('mobile', {
                          //   rules: [{ required: true, message: '请输入手机' }],
                          initialValue: selectDetails ? selectDetails.mobile : undefined,
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('AuthList.field.auths', this.props.language)}>
                        {getFieldDecorator('roles', {
                          initialValue: roles,
                        })(
                          <SearchSelect
                            dataUrl="mds-role/selectList"
                            selectedData={roles} // 选中值
                            showValue="name"
                            searchName="keyWord"
                            columns={columns1} // 表格展示列
                            scrollX={500}
                            onChange={this.getValue} // 获取选中值
                            id="TmsAuth_1_2"
                            disabled={disabled}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('AuthList.field.remark', this.props.language)}>
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
