import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { connect } from 'dva';
import Media from 'react-media';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import StandardTable from '@/components/StandardTable';
import RoleDetails from './RoleDetails';
import moment from 'moment';
import { transferLanguage } from '@/utils/utils';
import router from 'umi/router';
import prompt from '@/components/Prompt';
import { codes } from './utils';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { Option } = Select;

@ManageList
@connect(({ tmsRole, loading, common, i18n }) => ({
  tmsRole,
  loading: loading.models.tmsRole,
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
    checkId: '',
    btnAbled: '',
    expandForm: false,
  };
  className = 'roleList';
  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
      // fixed: this.props.isMobile ? false : true,
    },
    {
      title: transferLanguage('RoleList.field.code', this.props.language),
      dataIndex: 'code',
      // fixed: this.props.isMobile ? false : true,
      // width: this.props.isMobile ? 'auto' : 150,
      render: (text, record) => <a onClick={e => this.showDetail(e, record.id)}>{text}</a>,
    },
    {
      title: transferLanguage('RoleList.field.name', this.props.language),
      dataIndex: 'name',
    },
    {
      title: transferLanguage('RoleList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
      width: 100,
    },
    {
      title:transferLanguage('RoleList.field.remark', this.props.language),
      dataIndex: 'remarks',
    },
  ];

  componentDidMount() {
    this.dispatchFun('tmsRole/selectList', {});
  }

  // 分页操作
  handleStandardTableChange = param => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.dispatchFun('tmsRole/selectList', params);
  };

  // 重置条件查询表单
  handleFormReset = () => {
    this.setState({ formValues: {} });
    this.dispatchFun('tmsRole/selectList', {});
  };

  // 执行条件查询表单
  handleSearch = values => {
    if (!values) {
      return;
    }
    const { ...value } = values;
    this.setState({
      formValues: value,
    });
    this.dispatchFun('tmsRole/selectList', value);
  };

  // 跳转 新增页面
  handleAdd = () => {
    router.push('/system/RoleList/add-form');
  };

  // 跳转 编辑页面
  handleEdit = () => {
    const { id } = this.state;
    this.closeDetail();
    router.push(`/system/RoleList/edit-form/${id}`);
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
    // console.log('id', id);
    this.setState({
      visible: true,
      id,
      checkId: id,
    });
    // this.dispatchFun('tmsRole/selectDetails', { id });
    //获取用户信息：已绑定
    this.dispatchFun('tmsRole/selectListBinding', { id });
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
  ableStatus = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tmsRole/ableStatus',
      payload: { type },
    })
  }
  //启用、禁用：
  useVehicleType = (type, single) => {
    const { dispatch } = this.props;
    const { checkIds, checkId } = this.state;
    // console.log('checkId', checkId);
    let urlType = 'tmsRole/enableRole';
    if (type == 'disabled') {
      urlType = 'tmsRole/disabledRole';
    }
    dispatch({
      type: urlType,
      payload: { ids: single ? [checkId] : checkIds }, //统一传数组，分单个和多个操作
      callback: res => {
        if (single) {
          this.setState({
            btnAbled: type == 'disabled' ? false : true,
          });
          dispatch({
            type: 'tmsRole/selectDetails',
            payload: { id: checkId },
          });
        } else {
          dispatch({
            type: 'tmsRole/selectList',
            payload: this.state.formValues,
          });
        }
      },
    });
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  render() {
    const {
      form,
      loading,
      tmsRole: { selectList },
      isMobile,
      ownCompany,
    } = this.props;
    const { id, visible, selectedRows, checkId, btnAbled, expandForm } = this.state;
    const { getFieldDecorator } = form;
    // firstForm 参数
    const firstFormItem = (
      <FormItem label={transferLanguage('RoleList.field.code', this.props.language)}>
        {getFieldDecorator('code')(<Input />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('RoleList.field.name', this.props.language)}>
        {getFieldDecorator('name')(<Input />)}
      </FormItem>
    );
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      form,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      className: this.className,
      toggleForm: this.toggleForm,
    };

    const selectDetails =
      Object.keys(this.props.tmsRole.selectDetails).length > 0 && checkId
        ? this.props.tmsRole.selectDetails[checkId]
        : {};
    const vehicleAbled_check = btnAbled !== '' ? btnAbled : selectDetails && selectDetails.beActive;

    const tableButtonsParams = {
      show: true,
      handleAdd: this.handleAdd,
      rightButtons: (
        <Button.Group>
          <Button
            onClick={() => this.ableStatus('refreash')}
          > {transferLanguage('RoleList.field.flushPrivileges', this.props.language)}</Button>
        </Button.Group>
      ),
      buttons: (
        <Button.Group>
          <Button
            onClick={() => this.useVehicleType('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('RoleList.field.enable', this.props.language)}
          </Button>
          <Button
            onClick={() => this.useVehicleType('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
           {transferLanguage('RoleList.field.disable', this.props.language)}
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: transferLanguage('RoleList.field.details', this.props.language),
      closeDetail: this.closeDetail,
      buttons: (
        <span>
          <Button.Group>
            {!vehicleAbled_check && (
              <Button onClick={() => this.useVehicleType('abled', 1)}> {transferLanguage('RoleList.field.enable', this.props.language)}</Button>
            )}
            {vehicleAbled_check && (
              <Button onClick={() => this.useVehicleType('disabled', 1)}>{transferLanguage('RoleList.field.disable', this.props.language)}</Button>
            )}
            <Button type="primary" onClick={this.handleEdit}>
            {transferLanguage('RoleList.field.edit', this.props.language)}
            </Button>
          </Button.Group>
        </span>
      ),
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
          // scrollX={1200}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          code={codes.page}
          expandForm={expandForm}
          className={this.className}
        />
        <RightDraw {...rightDrawParams}>
          <RoleDetails detailId={id} isMobile={isMobile} />
        </RightDraw>
      </Fragment>
    );
  }
}
