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
@connect(({ scheduledTaskLog, common, loading, component, i18n }) => ({
  scheduledTaskLog,
  ownCompany: common.ownCompany,
  loading: loading.effects['scheduledTaskLog/scheduledTaskLogList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language

}))
@Form.create()
export default class scheduledTaskLogList extends Component {
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
  className = 'scheduledTaskLogList';

  columns = [
    {
      title: transferLanguage('ScheduledTaskLogList.field.name', this.props.language),
      dataIndex: 'jobName',
      render: (text, record) => (
        <a onClick={() => this.handleEdit(record.id)} title={text}>
          {text}
        </a>
      ),
      width: 200,
    },
    {
      title: transferLanguage('ScheduledTaskLogList.field.isSuccess', this.props.language),
      dataIndex: 'isSuccess',
      render: text => <span>{text === 'TRUE' ? 'Y' : 'N'}</span>,
      width: 200,
    },
    {
      title: transferLanguage('ScheduledTaskLogList.field.startTime', this.props.language),
      dataIndex: 'startTime',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: transferLanguage('ScheduledTaskLogList.field.completeTime', this.props.language),
      dataIndex: 'completeTime',
    },
    {
      title: transferLanguage('ScheduledTaskLogList.field.timeConsuming', this.props.language),
      dataIndex: 'timeConsuming',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: transferLanguage('ScheduledTaskLogList.field.jobFinalExecutionArea', this.props.language),
      dataIndex: 'jobFinalExecutionArea',
      width: 100,
    },
    {
      title: transferLanguage('ScheduledTaskLogList.field.errorMsg', this.props.language),
      dataIndex: 'errorMsg',
      width: 250,
    },
    {
      title: transferLanguage('ScheduledTaskLogList.field.createBy', this.props.language),
      dataIndex: 'createBy',
    },
    {
      title: transferLanguage('ScheduledTaskLogList.field.createTime', this.props.language),
      dataIndex: 'createTime',
    }
  ];
  componentDidMount() {
    this.getscheduledTaskLogList();
  }

  getscheduledTaskLogList = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'scheduledTaskLog/scheduledTaskLogList',
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
    this.getscheduledTaskLogList();
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
    this.getscheduledTaskLogList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/system/scheduledTaskLog/scheduledTaskLogAdd`);
  };
  //编辑：
  handleEdit = (id) => {
    router.push(`/system/scheduledTaskLog/scheduledTaskLogEdit/${id}`);
  };
  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getscheduledTaskLogList(params);
  };

  //详情：
  showDetail = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;

    dispatch({
      type: 'scheduledTaskLog/scheduledTaskLogDetails',
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
      type: 'scheduledTaskLog/restateAll',
      payload: {}
    })
  }

  //删除
  deleteTask = () => {
    this.props.dispatch({
      type: 'scheduledTaskLog/deleteTask',
      payload: { id: this.state.checkIds[0] }
    })
  }

  render() {
    const {
      loading,
      scheduledTaskLog: { scheduledTaskLogList },
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
      <FormItem label={transferLanguage('ScheduledTaskLogList.field.name', this.props.language)}>
        {getFieldDecorator('jobName')(<Input />)}
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
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('ScheduledTaskLogList.field.restartAll', this.props.language)}
          </Button>
          <Button
            onClick={() => this.deleteTask()}
            disabled={selectedRows.length === 1 ? false : true}
          >
            {transferLanguage('ScheduledTaskLogList.field.delete', this.props.language)}
          </Button>
        </Button.Group>
      ),
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        {/* <TableButtons {...tableButtonsParams} /> */}
        <StandardTable
          loading={loading}
          data={scheduledTaskLogList}
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
