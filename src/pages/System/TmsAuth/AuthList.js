import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Button, Modal, Row, Col, } from 'antd';
import { connect } from 'dva';
import Media from 'react-media';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import StandardTable from '@/components/StandardTable';
import AuthDetails from './AuthDetails';
import SearchSelect from '@/components/SearchSelect'
import moment from 'moment';
import router from 'umi/router';
import styles from '@/pages/Operate.less';
import prompt from '@/components/Prompt';
import { transferLanguage } from '@/utils/utils';
import { codes, SelectColumns } from './utils';
import WarehouseBindModal from './WarehouseBindModal'

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@ManageList
@connect(({ tmsAuth, loading, common, i18n }) => ({
  tmsAuth,
  treeData: tmsAuth.treeData,
  loading: loading.models.tmsAuth,
  ownCompany: common.ownCompany,
  language: i18n.language
}))
@Form.create()
export default class InsuranceList extends Component {
  state = {
    visible: false,
    id: '',
    formValues: {},
    selectedRows: [],
    btnAbled: '',
    checkId: '',
    visiblePass: false,
    checkIds: [],
    expandForm: false,
    warehouseVisible: false,
    orgId: [],

  };
  className = 'authList';
  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
    },
    {
      title: transferLanguage('AuthList.field.loginName', this.props.language),
      dataIndex: 'loginName',
      // fixed: this.props.isMobile ? false : true,
      render: (text, record) => <a onClick={e => this.showDetail(e, record.id)}>{text}</a>,
    },
    {
      title: transferLanguage('AuthList.field.sysName', this.props.language),
      dataIndex: 'sysName',
    },
    {
      title: transferLanguage('AuthList.field.orgId', this.props.language),
      dataIndex: 'orgName',
    },
    {
      title: transferLanguage('AuthList.field.mobile', this.props.language),
      dataIndex: 'mobile',
    },
    {
      title: transferLanguage('AuthList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
      width: 100,
    },
    {
      title: transferLanguage('AuthList.field.createTime', this.props.language),
      dataIndex: 'createTime',
    },
    {
      title: transferLanguage('AuthList.field.remark', this.props.language),
      dataIndex: 'remarks',
    },
  ];

  componentDidMount() {
    this.dispatchFun('tmsAuth/selectList', {});
  }
  // 分页操作
  handleStandardTableChange = param => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.dispatchFun('tmsAuth/selectList', params);
  };

  // 重置条件查询表单
  handleFormReset = () => {
    this.setState({ formValues: {} });
    this.dispatchFun('tmsAuth/selectList', {});
  };

  // 执行条件查询表单
  handleSearch = values => {
    if (!values) {
      return;
    }
    const { expiryTime, ...value } = values;
    if (expiryTime) {
      value.expiryStartTime = moment(expiryTime[0]).format(dateFormat);
      value.expiryEndTime = moment(expiryTime[1]).format(dateFormat);
    }
    this.setState({
      formValues: value,
    });
    this.dispatchFun('tmsAuth/selectList', value);
  };

  // 跳转 新增页面
  handleAdd = () => {
    router.push('/system/AuthList/add-form');
  };

  // 跳转 编辑页面
  handleEdit = () => {
    const { id } = this.state;
    this.closeDetail();
    router.push(`/system/AuthList/edit-form/${id}`);
  };

  // 关闭右抽屉
  closeDetail = () => {
    this.setState({
      visible: false,
    });
  };
  // 打开右抽屉
  showDetail = (e, id) => {
    e.stopPropagation();
    this.setState({
      visible: true,
      id,
      checkId: id,
    });
    // this.dispatchFun('tmsAuth/selectDetails', { id });
    //获取角色信息：已绑定
    this.dispatchFun('tmsAuth/selectListBinding', { id });
  };

  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }
  handleSelectRows = rows => {
    let ids = [];
    if (Array.isArray(rows) && rows.length > 0) {
      rows.map((item, i) => {
        ids.push(item.id);
      });
    }
    this.setState({
      selectedRows: rows,
      checkIds: ids,
    });
  };

  //启用、禁用：
  useVehicleType = (type, single) => {
    const { dispatch } = this.props;
    const { checkIds, checkId } = this.state;
    let urlType = 'tmsAuth/enableAuth';
    if (type == 'disabled') {
      urlType = 'tmsAuth/disabledAuth';
    }
    dispatch({
      type: urlType,
      payload: { ids: single ? [checkId] : checkIds },
      callback: res => {
        if (single) {
          this.setState({
            btnAbled: type == 'disabled' ? false : true,
          });
          dispatch({
            type: 'tmsAuth/selectDetails',
            payload: { id: checkId },
          });
        } else {
          dispatch({
            type: 'tmsAuth/selectList',
            payload: this.state.formValues,
          });
        }
      },
    });
  };
  //密码重置：
  resetPassword = () => {
    const { checkIds } = this.state;
    if (checkIds && checkIds.length > 1) {
      prompt({ type: 'warn', content: transferLanguage('AuthList.field.resetPwdPrompt', this.props.language) });
      return;
    }
    this.setState({
      visiblePass: true,
    });
  };
  handlePassOk = () => {
    const { dispatch } = this.props;
    const { checkIds } = this.state;
    const id = checkIds.length > 0 ? checkIds.join(',') : '';
    this.props.form.validateFields((err, values) => {
      if (values.password !== values.passwordAssgin) {
        prompt({ type: 'error', title: transferLanguage('Common.field.warmPrompt', this.props.language), content: transferLanguage('Common.field.pswPrompt', this.props.language) });
        return;
      }
      if (!err) {
        let params = {};
        params.id = id;
        params.passwd = values.password;
        this.props.dispatch({
          type: 'tmsAuth/resetPasswd',
          payload: params,
          callback: () => {
            this.handleCancel();
          },
        });
      }
    });
  };
  handleCancel = () => {
    this.setState({
      visiblePass: false,
    });
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  //仓库绑定
  bindWarehouse = () => {
    this.setState({
      warehouseVisible: true
    })
  }
  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };
  render() {
    const {
      form,
      loading,
      tmsAuth: { selectList },
      isMobile,
      ownCompany,
    } = this.props;
    const { id, visible, selectedRows, btnAbled, checkId, visiblePass, expandForm, warehouseVisible, checkIds } = this.state;
    const { getFieldDecorator } = form;
    // firstForm 参数   登录账号  用户名   所属业务组织	手机
    const firstFormItem = (
      <FormItem label={transferLanguage('AuthList.field.loginName', this.props.language)}>
        {getFieldDecorator('loginName')(<Input />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('AuthList.field.sysName', this.props.language)}>
        {getFieldDecorator('sysName')(<Input />)}
      </FormItem>
    );
    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('AuthList.field.mobile', this.props.language)}>
          {getFieldDecorator('mobile')(<Input />)}
        </FormItem>,
      ],
      [
        <FormItem label={transferLanguage('AuthList.field.orgId', this.props.language)}>
          {getFieldDecorator('orgId')(
            <SearchSelect
              dataUrl={'/mds-organization/selectList'}
              selectedData={this.state.orgId} // 选中值
              showValue="name"
              searchName="name"
              multiple={false}
              columns={SelectColumns}
              onChange={values => this.getValue(values, 'orgId')}
              id="orgId"
              allowClear={true}
              scrollX={200}
            />
          )}
        </FormItem>,
        'operatorButtons',
      ],
    ];
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      className: this.className,
      toggleForm: this.toggleForm,
    };
    const selectDetails =
      Object.keys(this.props.tmsAuth.selectDetails).length > 0 && id
        ? this.props.tmsAuth.selectDetails[id]
        : {};
    const vehicleAbled_check = btnAbled !== '' ? btnAbled : selectDetails && selectDetails.beActive;
    const tableButtonsParams = {
      show: true,
      handleAdd: this.handleAdd,
      buttons: (
        <Button.Group>
          <Button
            onClick={() => this.useVehicleType('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
             {transferLanguage('Common.field.enable', this.props.language)}
          </Button>
          <Button
            onClick={() => this.useVehicleType('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
          {transferLanguage('Common.field.disable', this.props.language)}
          </Button>
          <Button
            onClick={this.resetPassword}
            disabled={selectedRows.length > 0 && selectedRows.length === 1 ? false : true}
          >
            {transferLanguage('AuthList.field.resetPwd', this.props.language)}
          </Button>
          <Button
            onClick={this.bindWarehouse}
            disabled={selectedRows.length > 0 && selectedRows.length === 1 ? false : true}
          >
            {transferLanguage('AuthList.field.withClient', this.props.language)}
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: transferLanguage('AuthList.field.sysName', this.props.language),
      closeDetail: this.closeDetail,
      buttons: (
        <Button.Group>
          {!vehicleAbled_check && (
            <Button onClick={() => this.useVehicleType('abled', 1)}>{transferLanguage('AuthList.field.enable', this.props.language)}</Button>
          )}
          {vehicleAbled_check && (
            <Button onClick={() => this.useVehicleType('disabled', 1)}>{transferLanguage('AuthList.field.disabled', this.props.language)}</Button>
          )}
          <Button type="primary" onClick={this.handleEdit}>
            {transferLanguage('AuthList.field.edit', this.props.language)}
          </Button>
        </Button.Group>
      ),
    };

    const warehouseParams = {
      visible: warehouseVisible,
      id: checkIds[0],
      onCancel: () => this.setState({ warehouseVisible: false }),
    }

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          disabledRowSelected={false}
          selectedRows={selectedRows}
          loading={loading}
          data={selectList}
          columns={this.columns}
          // scrollX={3000}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          // code={codes.page}
          expandForm={expandForm}
          className={this.className}
        />
        <RightDraw {...rightDrawParams}>
          <AuthDetails detailId={id} isMobile={isMobile} />
        </RightDraw>
        {warehouseVisible && <WarehouseBindModal visible={true} {...warehouseParams} />}
        {visiblePass && (
          <Modal
            title={transferLanguage('AuthList.field.resetPwd', this.props.language)}
            visible={visiblePass}
            onOk={() => this.handlePassOk()}
            onCancel={this.handleCancel}
            width={450}
            style={{ top: 20 }}
            destroyOnClose={true}
          >
            <div className={styles.tableListForm}>
              <Form layout="inline">
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label={transferLanguage('AuthList.field.newPwd', this.props.language)}>
                      {getFieldDecorator('password', {
                        rules: [{ required: true }],
                        // initialValue: infoDetail ? infoDetail.code : '',
                      })(<Input.Password />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label={transferLanguage('AuthList.field.confirmPwd', this.props.language)}>
                      {getFieldDecorator('passwordAssgin', {
                        rules: [{ required: true}],
                        // initialValue: infoDetail ? infoDetail.value : '',
                      })(<Input.Password />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
        )}
      </Fragment>
    );
  }
}
