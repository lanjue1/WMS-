import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import AdSearch from '@/components/AdSearch';
import { transferLanguage } from '@/utils/utils';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ crontab, common, loading, component, i18n }) => ({
  crontab,
  ownCompany: common.ownCompany,
  loading: loading.effects['crontab/crontabList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language
}))
@Form.create()
export default class crontabList extends Component {
  state = {
    updateModalVisible: false,
    expandForm: false,
    stepFormValues: {},
    visible: false,
    formValues: {},
    rowDetails: {},
    selectedRows: [],
    checkIds: []
  };
  className = 'crontabList';

  columns = [
    {
      title: transferLanguage('listCrontab.field.TaskActuator', this.props.language),
      dataIndex: 'beanName',
      render: (text, record) => (
        <a onClick={() => this.handleEdit(record.id)} title={text}>
          {text}
        </a>
      ),
      width: 200,
    },
    {
      title: transferLanguage('listCrontab.field.expression', this.props.language),
      dataIndex: 'cron',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: transferLanguage('listCrontab.field.TaskGroup', this.props.language),
      dataIndex: 'jobGroup',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: transferLanguage('listCrontab.field.TaskDescription', this.props.language),
      dataIndex: 'description',
      width: 100,
    },
    {
      title: transferLanguage('listCrontab.field.taskParameters', this.props.language),
      dataIndex: 'parameter',
    },
    {
      title: transferLanguage('listCrontab.field.TaskStatus', this.props.language),
      dataIndex: 'status',
    },
    {
      title: transferLanguage('listCrontab.field.timeZone', this.props.language),
      dataIndex: 'timeZone',
    },
    {
      title: transferLanguage('listCrontab.field.remark', this.props.language),
      dataIndex: 'remark',
      render: text => <span title={text}>{text}</span>,
      width: 250,
    },
    {
      title: transferLanguage('listCrontab.field.TaskExecutionArea', this.props.language),
      dataIndex: 'executionArea',
      render: text => (
        <AdSearch
          label="loginName"
          name="sysName"
          value={this.props.searchValue[text]}
          onlyRead={true}
        />
      ),
    },
  ];
  componentDidMount() {
    this.getcrontabList();
  }

  getcrontabList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'crontab/crontabList',
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
    this.getcrontabList();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

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

  //查询
  handleSearch = values => {
    // if (!values) {
    //   return;
    // }
    const { ...value } = values;
    this.setState({
      formValues: value,
    });
    this.getcrontabList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/SystemSetting/Crontab/CrontabAdd`);
  };
  //编辑：
  handleEdit = (id) => {
    router.push(`/SystemSetting/Crontab/CrontabEdit/${id}`);
  };
  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getcrontabList(params);
  };

  //详情：
  showDetail = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;

    dispatch({
      type: 'crontab/crontabDetails',
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

  //重启全部
  restateAll = () => {
    this.props.dispatch({ 
      type: 'crontab/restateAll',
      payload: {}
    })
  }

  //删除
  deleteTask = () => {
    this.props.dispatch({
      type: 'crontab/deleteTask',
      payload: {id:this.state.checkIds[0]}
    })
  }

  render() {
    const {
      loading,
      crontab: { crontabList, crontabDetails },
      form,
      language
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      checkId,
      selectedRows,
      expandForm,
    } = this.state;
    const firstFormItem = (
      <FormItem label={transferLanguage('listCrontab.field.TaskName', this.props.language)}>
        {getFieldDecorator('name')(<Input />)}
      </FormItem>
    );

    const selectFormParams = {
      firstFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: this.toggleForm,
    };
    const tableButtonsParams = {
      show: true,
      handleAdd: this.handleAdd,
      buttons: (
        <Button.Group>
          <Button
            onClick={() => this.restateAll()}
          >
            {transferLanguage('listCrontab.field.ResetAll', this.props.language)}
          </Button>
          <Button
            onClick={() => this.deleteTask()}
            disabled={selectedRows.length === 1 ? false : true}
          >
            {transferLanguage('listCrontab.field.delete', this.props.language)}
          </Button>
        </Button.Group>
      ),
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          loading={loading}
          data={crontabList}
          selectedRows={selectedRows}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          onSelectRow={this.handleSelectRows}
          scrollX={1500}
          expandForm={expandForm}
          className={this.className}
        // disabledRowSelected={true}
        />
      </Fragment>
    );
  }
}
