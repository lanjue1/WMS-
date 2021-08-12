import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Button, Modal, Row, Col } from 'antd';
import { connect } from 'dva';
import Media from 'react-media';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import StandardTable from '@/components/StandardTable';
import ClientDetails from './ClientDetails';
import SearchSelect from '@/components/SearchSelect';
import moment from 'moment';
import router from 'umi/router';
import styles from '@/pages/Operate.less';
import prompt from '@/components/Prompt';
import { transferLanguage } from '@/utils/utils';
import { codes, SelectColumns } from './utils';


const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@ManageList
@connect(({ client, loading, common, i18n }) => ({
  client,
  treeData: client.treeData,
  loading: loading.models.client,
  ownCompany: common.ownCompany,
  language: i18n.language,
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
  className = 'CliList';
  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
    },
    {
      title: transferLanguage('Client.field.name', this.props.language),
      dataIndex: 'name',
      render: (text, record) => <a onClick={e => this.showDetail(e, record.id)}>{text}</a>,
    },
    {
      title: transferLanguage('Client.field.code', this.props.language),
      dataIndex: 'code',
    },
    {
      title: transferLanguage('Client.field.simpleName', this.props.language),
      dataIndex: 'simpleName',
    },
    {
      title: transferLanguage('Client.field.classification', this.props.language),
      dataIndex: 'classification',
    },
    {
      title: transferLanguage('Client.field.createBy', this.props.language),
      dataIndex: 'createBy',
    },
    {
      title: transferLanguage('Client.field.status', this.props.language),
      dataIndex: 'status',
    },
    {
      title: transferLanguage('Client.field.createTime', this.props.language),
      dataIndex: 'createTime',
    },
    {
      title: transferLanguage('RoleList.field.remark', this.props.language),
      dataIndex: 'remarks',
    },
  ];

  componentDidMount() {
    this.dispatchFun('client/selectList', {});
  }
  // 分页操作
  handleStandardTableChange = param => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.dispatchFun('client/selectList', params);
  };

  // 重置条件查询表单
  handleFormReset = () => {
    this.setState({ formValues: {} });
    this.dispatchFun('client/selectList', {});
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
    this.dispatchFun('client/selectList', value);
  };

  // 跳转 新增页面
  handleAdd = () => {
    router.push('/system/ClientList/add-form');
  };

  // 跳转 编辑页面
  handleEdit = () => {
    const { id } = this.state;
    this.closeDetail();
    router.push(`/system/ClientList/edit-form/${id}`);
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
    //获取角色信息：已绑定
    this.dispatchFun('client/selectListBinding', { id });
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
    let urlType = 'client/enableCli';
    if (type == 'disabled') {
      urlType = 'client/disabledCli';
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
            type: 'client/selectDetails',
            payload: { id: checkId },
          });
        } else {
          dispatch({
            type: 'client/selectList',
            payload: this.state.formValues,
          });
        }
      },
    });
  };

  handlePassOk = () => {
    const { dispatch } = this.props;
    const { checkIds } = this.state;
    const id = checkIds.length > 0 ? checkIds.join(',') : '';
    this.props.form.validateFields((err, values) => {
      if (values.password !== values.passwordAssgin) {
        prompt({
          type: 'error',
          title: transferLanguage('Client.field.warmPrompt', this.props.language),
          content: transferLanguage('Client.field.pswPrompt', this.props.language),
        });
        return;
      }
      if (!err) {
        let params = {};
        params.id = id;
        params.passwd = values.password;
        this.props.dispatch({
          type: 'client/resetPasswd',
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
      warehouseVisible: true,
    });
  };
  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };
  //删除
  deleteTask = () => {
    this.props.dispatch({
      type: 'client/deleteTask',
      payload: { id: this.state.checkIds[0] },
      callback: res => {
        this.dispatchFun('client/selectList', {});
      },
    });
  };
  render() {
    const {
      form,
      loading,
      client: { selectList },
      isMobile,
      ownCompany,
    } = this.props;
    const {
      id,
      visible,
      selectedRows,
      btnAbled,
      checkId,
      visiblePass,
      expandForm,
      warehouseVisible,
      checkIds,
    } = this.state;
    const { getFieldDecorator } = form;
    // firstForm 参数   登录账号  用户名   所属业务组织	手机
    const firstFormItem = (
      <FormItem label={transferLanguage('Client.field.keyWord', this.props.language)}>
        {getFieldDecorator('keyWord')(<Input />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('Client.field.code', this.props.language)}>
        {getFieldDecorator('code')(<Input />)}
      </FormItem>
    );
    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('Client.field.name', this.props.language)}>
          {getFieldDecorator('name')(<Input />)}
        </FormItem>,
      ],
      ['operatorButtons'],
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
      Object.keys(this.props.client.selectDetails).length > 0 && id
        ? this.props.client.selectDetails[id]
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
            {transferLanguage('Client.field.enable', this.props.language)}
          </Button>
          <Button
            onClick={() => this.useVehicleType('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('Client.field.disable', this.props.language)}
          </Button>
          <Button
            onClick={() => this.deleteTask()}
            disabled={selectedRows.length === 1 ? false : true}
          >
            {transferLanguage('Client.field.delete', this.props.language)}
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: transferLanguage('Client.field.sysName', this.props.language),
      closeDetail: this.closeDetail,
      buttons: (
        <Button.Group>
          {!vehicleAbled_check && (
            <Button onClick={() => this.useVehicleType('abled', 1)}>{transferLanguage('CliList.field.enable', this.props.language)}启用</Button>
          )}
          {vehicleAbled_check && (
            <Button onClick={() => this.useVehicleType('disabled', 1)}>{transferLanguage('CliList.field.disable', this.props.language)}禁用</Button>
          )}
          <Button type="primary" onClick={this.handleEdit}>
          {transferLanguage('CliList.field.edit', this.props.language)}编辑
          </Button>
        </Button.Group>
      ),
    };

    const warehouseParams = {
      visible: warehouseVisible,
      id: checkIds[0],
      onCancel: () => this.setState({ warehouseVisible: false }),
    };

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
          <ClientDetails detailId={id} isMobile={isMobile} />
        </RightDraw>
        {warehouseVisible && <WarehouseBindModal visible={true} {...warehouseParams} />}
        {visiblePass && (
          <Modal
            title={transferLanguage('CliList.field.resetPwd', this.props.language)}
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
                    <Form.Item
                      label={transferLanguage('CliList.field.newPwd', this.props.language)}
                    >
                      {getFieldDecorator('password', {
                        rules: [{ required: true }],
                        // initialValue: infoDetail ? infoDetail.code : '',
                      })(<Input.Password />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item
                      label={transferLanguage('CliList.field.confirmPwd', this.props.language)}
                    >
                      {getFieldDecorator('passwordAssgin', {
                        rules: [{ required: true }],
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
