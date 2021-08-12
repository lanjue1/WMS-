import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import SysConfigDetails from './SysConfigDetails';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import SearchSelect from '@/components/SearchSelect';
import AdSearch from '@/components/AdSearch';
import { columns1 } from '@/pages/Common/common';
import ButtonGroup from 'antd/lib/button/button-group';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ sysConfig, common, loading, component }) => ({
  sysConfig,
  ownCompany: common.ownCompany,
  loading: loading.effects['sysConfig/sysConfigList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
}))
@Form.create()
export default class sysConfigList extends Component {
  state = {
    updateModalVisible: false,
    expandForm: false,
    stepFormValues: {},
    visible: false,
    formValues: {},
    rowDetails: {},
  };
  className = 'sysConfigList';

  columns = [
    {
      title: '配置编码',
      dataIndex: 'configKey',
      render: (text, record) => (
        <a onClick={e => this.showDetail(e, record)} title={text}>
          {text}
        </a>
      ),
      width: 200,
    },
    {
      title: '名称',
      dataIndex: 'configName',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: '配置值',
      dataIndex: 'configValue',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: '系统内置',
      dataIndex: 'beSys',
      render: (text, record) => <span>{text ? '是' : '否'}</span>,
      width: 100,
    },
    {
      title: '备注信息',
      dataIndex: 'remark',
      render: text => <span title={text}>{text}</span>,
      width: 250,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      render: text => (
        <AdSearch
          label="loginName"
          name="sysName"
          value={this.props.searchValue[text]}
          onlyRead={true}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      render: text => (
        <AdSearch
          label="loginName"
          name="sysName"
          value={this.props.searchValue[text]}
          onlyRead={true}
        />
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
  ];
  componentDidMount() {
    this.getSysConfigList();
  }

  getSysConfigList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysConfig/sysConfigList',
      payload: params,
      callback: data => {
        this.getUserData(data);
      },
    });
  };

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getSysConfigList();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  //查询
  handleSearch = values => {
    // if (!values) {
    //   return;
    // }
    const { ...value } = values;
    this.setState({
      formValues: value,
    });
    this.getSysConfigList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/system/SysConfigList/SysConfigAdd`);
  };
  //编辑：
  handleEdit = () => {
    router.push(`/system/SysConfigList/SysConfigEdit/${this.state.checkId}`);
    this.closeDetail();
  };
  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getSysConfigList(params);
  };

  //详情：
  showDetail = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;

    dispatch({
      type: 'sysConfig/sysConfigDetails',
      payload: { id },
      callback: res => {
        this.setState(
          {
            checkId: id,
            rowDetails: record,
          },
          () => {
            this.setState({
              visible: true,
            });
          }
        );
      },
    });
  };

  closeDetail = () => {
    this.setState({
      visible: false,
    });
  };
  resetInit=()=>{
    const {dispatch} = this.props
    dispatch({
      type:'sysConfig/reinitialize',
      payload:{},
      callback:data=>{

      }
    })
  }
  render() {
    const {
      loading,
      sysConfig: { sysConfigList, sysConfigDetails },
      form,
      isMobile,
      dictObject,
      ownCompany,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      updateModalVisible,
      stepFormValues,
      checkId,
      visible,
      rechargeVisible,
      rowDetails,
      expandForm,
    } = this.state;

    const selectDetails = sysConfigDetails[checkId];
    const firstFormItem = (
      <FormItem label="配置编码">
        {getFieldDecorator('configKey')(<Input  />)}
      </FormItem>
    );

    const secondFormItem = (
      <FormItem label="名称">
        {getFieldDecorator('configName')(<Input style={{ width: '100%' }} />)}
      </FormItem>
    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label="系统内置">
          {getFieldDecorator('beActive')(
            <Select placeholder="请选择" style={{ width: '100%' }} allowClear={true}>
              <Option value="">请选择</Option>
              <Option value="true">是</Option>
              <Option value="false">否</Option>
            </Select>
          )}
        </FormItem>,
      ],
      [
        <FormItem label="配置值">
          {getFieldDecorator('configValue')(<Input  />)}
        </FormItem>,
        'operatorButtons',
      ],
    ];
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: this.toggleForm,
    };
    const tableButtonsParams = {
      show: true,
      handleAdd: this.handleAdd,
      buttons:(
        <Button.Group>
          <Button  onClick={this.resetInit}>
          重新初始化按键
          </Button>
        </Button.Group>
      )
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: '系统配置详情',
      closeDetail: this.closeDetail,
      buttons: (
        <Button onClick={this.handleEdit} type="primary">
          编辑
        </Button>
      ),
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          loading={loading}
          data={sysConfigList}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          scrollX={1500}
          expandForm={expandForm}
          className={this.className}
          disabledRowSelected={true}
        />
        <RightDraw {...rightDrawParams}>
          <SysConfigDetails checkId={checkId} isMobile={isMobile} />
        </RightDraw>
      </Fragment>
    );
  }
}
