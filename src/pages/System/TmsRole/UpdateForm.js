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
  Tree,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import AntdTree from '@/components/AntdTree';
import styles from '@/pages/Operate.less';
import { transferLanguage } from '@/utils/utils';
import prompt from '@/components/Prompt';
import SearchSelect from '@/components/SearchSelect';
import { isArray } from 'util';
import AdButton from '@/components/AdButton';
import { columnsUser } from '@/pages/Common/common';
const { TreeNode } = Tree;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
let VehicleAarr = ['code', 'name', 'remark'];
@connect(({ tmsRole, common, loading, i18n }) => ({
  tmsRole,
  ownCompany: common.ownCompany,
  dictObject: common.dictObject,
  loading: loading.effects['tmsRole/roleList'],
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
      selectedRowsAll: [],
      searchSelectVidible: false,
      auths: [],
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      ContainParentIdCheckedKeys: [],
      selectedKeys: [],
      menuList: [],
      searchValue: '',
      filterVisible: false,
      // menuRole: [],
      selectedFilter: [],
      menuId: 0,
      filterId: 0,
      disabled: false,
    };
  }
  columns = [
    {
      title: '登录账号',
      dataIndex: 'loginName',
      fixed: this.props.isMobile ? false : true,
      width: this.props.isMobile ? 'auto' : 150,
      render: (text, record) => <a onClick={() => this.showDetail(record.id)}>{text}</a>,
    },
    {
      title: transferLanguage('RoleList.field.sysName', this.props.language),
      dataIndex: 'sysName',
    },
    {
      title: transferLanguage('RoleList.field.orgId', this.props.language),
      dataIndex: 'orgId',
    },
    {
      title: transferLanguage('RoleList.field.mobile', this.props.language),
      dataIndex: 'mobile',
    },
    {
      title: transferLanguage('RoleList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
    },
    {
      title: transferLanguage('RoleList.field.createTime', this.props.language),
      dataIndex: 'createTime',
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
      this.getRoleListBind(id);
      this.selectRoleMenuList(id);
    } else {
      this.props.form.resetFields(VehicleAarr);
    }

    this.props.dispatch({
      type: 'tmsRole/authList',
      payload: {},
    });
    this.getMenuList();
  }

  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'tmsRole/selectDetails',
      payload: { id: ID },
    });
  };
  //菜单列表：
  getMenuList = () => {
    this.props.dispatch({
      type: 'tmsRole/selectAllMenuList',
      payload: {},
      callback: res => {
        this.setState({
          menuList: res,
        });
      },
    });
  };
  // 已绑定菜单列表
  selectRoleMenuList = ID => {
    this.props.dispatch({
      type: 'tmsRole/selectRoleMenuList',
      payload: { id: ID },
      callback: res => {
        let arr = [];
        let parentIds = [];
        if (res.length > 0) {
          res.map((item, i) => {
            arr.push(item.id);
            if (parentIds.indexOf(item.parentId) == -1) {
              parentIds.push(item.parentId);
            }
          });
          let newArr = arr.filter(item => !parentIds.some(ele => ele === item));
          this.setState({
            checkedKeys: newArr,
            ContainParentIdCheckedKeys: arr,
          });
        }
      },
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
  //获取角色信息：未绑定
  getRoleList = (params = {}) => {
    params.id = this.state.currentId;
    this.dispatchFun('tmsRole/selectListNoBinding', params);
  };
  //获取角色信息：已绑定
  getRoleListBind = ID => {
    this.props.dispatch({
      type: 'tmsRole/selectListBinding',
      payload: { id: ID, pageSize: 100 },
      callback: res => {
        // console.log('res===', res);
        this.setState({
          auths: res,
        });
      },
    });
  };

  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'tmsRole/selectDetails',
      payload: { id: ID },
    });
  };
  //保存基本信息：
  saveBasicInfo = e => {
    e.stopPropagation();
    const { currentId } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { auths, ...value } = values;
      if (auths) {
        value.userId = auths.map(v => v.id);
      }
      //编辑时传入id
      if (currentId) {
        value.id = currentId;
      }
      value.sysCode = '1';
      this.props.dispatch({
        type: 'tmsRole/roleOperate',
        payload: value,
        callback: res => {
          if (res.data) {
            this.setState(preState => ({
              disabled: !preState.disabled,
            }));
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
          router.push(`/system/RoleList/edit-form/${res}`);
        }
      },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  //绑定或移除用户
  handleOK = (ids, roleId) => {
    let params = {};
    params.userId = ids;
    params.roleId = roleId;
    this.props.dispatch({
      type: 'tmsRole/authOperate',
      payload: params,
      callback: res => {
        this.setState({
          visible: false,
        });
        this.getRoleListBind(roleId);
      },
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  //是自定义搜索
  onFocus = () => {
    this._input.blur();
    this.setState({ searchSelectVidible: true });
  };
  onCancel = values => {
    this.setState({ searchSelectVidible: false, auths: values });
  };
  // onSearch = value => {
  //   this.setState({ searchValue: value });
  //   this.props.dispatch({
  //     type: 'tmsRole/authList',
  //     payload: { loginName: value },
  //   });
  // };
  getValue = values => {
    const { auths } = this.state;
    this.setState({
      auths: values,
    });
  };

  onFilterChange = selectedFilter => {
    this.setState({
      selectedFilter,
    });
  };
  //设置菜单：
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    // const arr = checkedKeys.concat(e.halfCheckedKeys);
    // console.log('e.halfCheckedKeys', e.halfCheckedKeys, 'arr', arr);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    // console.log('onSelect', info);
    this.setState({ selectedKeys });
  };
  handleRoleMenu = e => {
    e.stopPropagation();
    const { currentId, checkedKeys, ContainParentIdCheckedKeys } = this.state;
    // console.log('==============', ContainParentIdCheckedKeys, checkedKeys);
    this.props.dispatch({
      type: 'tmsRole/addUserRole',
      payload: { menuId: checkedKeys, roleId: currentId },
      callback: () => {
        this.selectRoleMenuList(currentId);
      },
    });
  };

  editFilter = (filterId, menuId) => {
    const { dispatch } = this.props;
    const { currentId } = this.state;
    if (!currentId) return;
    dispatch({
      type: 'tmsRole/selectFilterDetail',
      payload: {
        menuId: filterId,
        roleId: currentId,
      },
      callback: data => {
        if (!data) return;
        this.setState({
          selectedFilter: data.filterIds.map(v => {
            return { id: v };
          }),
        });
      },
    });
    this.setState({ filterVisible: true, menuId, filterId });
  };

  renderTreeNodes = data => {
    const { currentId } = this.state;
    const newDate = isArray(data) ? data : data.menuBODetail;
    return newDate.map(item => {
      if (item.menuBODetail) {
        return (
          <TreeNode
            title={
              <span>
                {item.name}
                {item.type === 'ELEMENT' && currentId && (
                  <Button
                    size="small"
                    type="primary"
                    style={{ marginLeft: 20 }}
                    onClick={this.editFilter.bind(this, item.id, data.id)}
                  >
                    {
                      transferLanguage('RoleList.field.editFilter', this.props.language)
                    }
                  </Button>
                )}
              </span>
            }
            key={item.id}
            dataRef={item}
          >
            {this.renderTreeNodes(item)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} dataRef={item} />;
    });
  };

  handleFilterOK = () => {
    this.props.form.validateFieldsAndScroll(['filterType', 'filterRemark'], (err, values) => {
      if (err) return;
      const { dispatch } = this.props;
      const { currentId, filterId } = this.state;
      const { filterType, filterRemark } = values;
      dispatch({
        type: 'tmsRole/addFilter',
        payload: {
          menuId: filterId,
          dataPermRemarks: filterRemark,
          filterIds: filterType.map(v => v.id),
          roleId: currentId,
        },
        callback: data => {
          if (!data) return;
          this.setState({ filterVisible: false, selectedFilter: [] });
        },
      });
    });
  };
  handleFilterCancel = () => {
    this.setState({ filterVisible: false, selectedFilter: [] });
  };
  render() {
    const {
      currentId,
      visible,
      selectedRowBind,
      auths,
      menuList,
      selectedFilter,
      menuId,
      disabled,
    } = this.state;
    const {
      form,
      ownCompany,
      tmsRole: {
        selectListNoBinding,
        selectListBinding,
        authList,
        selectAllMenuList,
        filterDetail,
      },
      dictObject,
      loadingRole,
      loading,
    } = this.props;
    const { getFieldDecorator } = form;
    let selectDetails = {};
    if (currentId) {
      selectDetails = this.props.tmsRole.selectDetails[currentId];
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
      // background: '#F0F2F5',
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };

    const filterColumns = [
      {
        title: transferLanguage('RoleList.field.filterName', this.props.language),
        dataIndex: 'filterName',
        width: '50%',
      },
      {
        title:transferLanguage('RoleList.field.beActive', this.props.language),
        dataIndex: 'beActive',
        render: text => <span>{text ? '有效' : '无效'}</span>,
        width: '25%',
      },
      {
        title:transferLanguage('RoleList.field.remark', this.props.language),
        dataIndex: 'remarks',
        width: '25%',
      },
    ];
    const genExtraCertificatesInfo = () => (
      <div>
        <Button type="primary" disabled={disabled} onClick={e => this.handleRoleMenu(e, 'add')}>
          {transferLanguage('Common.field.save', this.props.language)}
        </Button>
      </div>
    );

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    return (
      <div className={styles.CollapseUpdate}>
        <Modal
          title={transferLanguage('RoleList.field.editFilter', this.props.language)}
          visible={this.state.filterVisible}
          onOk={this.handleFilterOK}
          onCancel={this.handleFilterCancel}
          width={620}
          destroyOnClose={true}
          style={{ top: 20 }}
        >
          <div className={styles.tableListForm}>
            <Form layout="inline">
              <Row>
                <Col md={24}>
                  <Form.Item label={transferLanguage('RoleList.field.filterType', this.props.language)}>
                    {getFieldDecorator('filterType', {
                      initialValue: selectedFilter,
                    })(
                      <SearchSelect
                        dataUrl="mds-data-filter/selectDataFilterByMenuId"
                        url="mds-data-filter/viewMdsDataFilterDetails" //selectedData只只有id时需要传url
                        selectedData={selectedFilter} // 选中值
                        showValue="filterName"
                        payload={{ id: menuId }}
                        multiple={false}
                        searchName="keyWord"
                        allowClear={true}
                        scrollX={500}
                        columns={filterColumns} // 表格展示列
                        onChange={this.onFilterChange} // 获取选中值
                        id="TmsRole_1"
                        disabled={disabled}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label={transferLanguage('RoleList.field.remark', this.props.language)}>
                    {getFieldDecorator('filterRemark', {
                      initialValue: filterDetail.dataPermRemarks || '',
                    })(<TextArea rows={4} disabled={disabled} />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('RoleList.field.info', this.props.language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('RoleList.field.code', this.props.language)}>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: transferLanguage('Common.field.input', this.props.language) }],
                          initialValue: selectDetails ? selectDetails.code : undefined,
                        })(
                          <Input
                            disabled={
                              disabled || (selectDetails && selectDetails.code ? true : false)
                            }
                          />
                        )}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('RoleList.field.name', this.props.language)}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: transferLanguage('Common.field.input', this.props.language) }],
                          initialValue: selectDetails ? selectDetails.name : undefined,
                        })(<Input disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('RoleList.field.auths', this.props.language)}>
                        {getFieldDecorator('auths', {
                          initialValue: auths,
                        })(
                          <SearchSelect
                            dataUrl="mds-user/selectList"
                            // url="mds-user/viewDetails" //selectedData只只有id时需要传url
                            selectedData={auths} // 选中值
                            multiple={true} // 是否多选
                            showValue="sysName"
                            searchName="keyWord"
                            columns={columnsUser} // 表格展示列
                            onChange={this.getValue} // 获取选中值
                            id="TmsRole_1_1"
                            disabled={disabled}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('RoleList.field.remark', this.props.language)}>
                        {getFieldDecorator('remarks', {
                          initialValue: selectDetails ? selectDetails.remarks : '',
                        })(<TextArea rows={4} disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>

            <Panel
              header={transferLanguage('RoleList.field.setMenu', this.props.language)}
              key="2"
              style={customPanelStyle}
              extra={genExtraCertificatesInfo()}
            >
              <div style={{ height: 400, overflowY: 'auto' }}>
                <AntdTree
                  dataUrl="mds-menu/selectAllMenuList"
                  detailId={this.state.currentId}
                  url="mds-role/selectRoleMenuList"
                  editFilter={this.editFilter}
                  onCheck={this.onCheck}
                  
                />
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
