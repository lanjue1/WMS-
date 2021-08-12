import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import DictDetails from './DictDetails';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import SearchSelect from '@/components/SearchSelect';
import { columns1 } from '@/pages/Common/common';
import { formateDateToMin } from '@/utils/common';
import { codes } from './utils';
import { transferLanguage } from '@/utils/utils';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ Dict, common, loading, i18n }) => ({
  Dict,
  ownCompany: common.ownCompany,
  loading: loading.effects['Dict/DictList'],
  dictObject: common.dictObject,
  language: i18n.language
}))
@Form.create()
export default class DictList extends Component {
  state = {
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    stepFormValues: {},
    visible: false,
    rechargeVisible: false,
    checkId: '',
    checkIds: [],
    formValues: {},
    isAbled: '',
    cardNo: '',
    cars: [],
    rowDetails: {},
  };
  className = 'DictList';

  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
      // fixed: this.props.isMobile ? false : true,
    },
    {
      title: transferLanguage('dictList.field.dictionaryType', this.props.language),
      dataIndex: 'dictType',
      render: (text, record) => (
        <a onClick={e => this.showDetail(e, record)} title={text}>
          {text}
        </a>
      ),
      width: 200,
    },
    {
      title: transferLanguage('dictList.field.remark', this.props.language),
      dataIndex: 'remarks',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: transferLanguage('dictList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
      width: 100,
    },
    {
      title: transferLanguage('dictList.field.updateBy', this.props.language),
      dataIndex: 'updateBy',
    },
    {
      title: transferLanguage('dictList.field.updateTime', this.props.language),
      dataIndex: 'updateTime',
      render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
    },
  ];
  componentDidMount() {
    this.getDictList();
    // 查询字典：
    
  }
  onRef = ref => {
    this.child = ref;
  };

  getDictList = (params = {}) => {
    const { dispatch } = this.props;
    // params.currentPage = 1;
    // params.pageSize = 10;
    dispatch({
      type: 'Dict/DictList',
      payload: params,
    });
  };

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getDictList();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    // console.log('选择', rows);
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
    const { cars } = this.state;
    if (cars.length > 0) {
      const vehicleId = cars.map(v => {
        return v.id;
      });
      value.vehicleId = vehicleId.join(',');
    } else {
      value.vehicleId = '';
    }
    this.setState({
      formValues: value,
    });
    this.getDictList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/SystemSetting/dictList/dictAdd`);
  };
  //编辑：
  handleEdit = () => {
    router.push(`/SystemSetting/dictList/dictEdit/${this.state.checkId}`);
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
    this.getDictList(params);
  };

  //详情：
  showDetail = (e, record) => {
    const { dispatch } = this.props;
    const { id, cardNo } = record;
    e.stopPropagation();
    dispatch({
      type: 'Dict/dictDataList',
      payload: {dictId: id, pageSize: 500 },
    });

    this.setState(
      {
        checkId: id,
        cardNo: cardNo,
        rowDetails: record,
      },
      () => {
        this.setState({
          visible: true,
        });
      }
    );
  };

  closeDetail = () => {
    this.setState({
      visible: false,
    });
  };
  getValue = values => {
    this.setState({
      cars: values,
    });
  };

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type == 'abled' ? true : false;
    dispatch({
      type: 'Dict/ableDictOperate',
      payload: params,
      callback: res => {
        this.getDictList(formValues);

        if (isSingle) {
          this.props.dispatch({
            type: 'Dict/dictDetails',
            payload: { id: checkId },
            callback: res => {
              this.setState({
                isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
              });
            },
          });
        }
      },
    });
  };
  handleCancel = e => {
    this.setState({
      rechargeVisible: false,
    });
  };
  handleRechargeOK = () => {
    this.child.operatePaneButton();
  };
  getChildValue = data => {
    if (data == 'false') {
      this.handleCancel();
    }
  };
  render() {
    const {
      loading,
      Dict: { DictList, dictDetails },
      form,
      isMobile,
      dictObject,
      ownCompany,
      language
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      selectedRows,
      updateModalVisible,
      stepFormValues,
      isAbled,
      checkId,
      cardNo,
      visible,
      rechargeVisible,
      rowDetails,
      expandForm,
    } = this.state;

    const selectDetails = dictDetails[checkId];
    const firstFormItem = (
      <FormItem label={transferLanguage('dictList.field.dictionaryType', this.props.language)}>
        {getFieldDecorator('dictType')(<Input  />)}
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
            onClick={() => this.abledStatus('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('dictList.field.disabled', this.props.language)}禁用
          </Button>
          <Button
            onClick={() => this.abledStatus('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('dictList.field.enable', this.props.language)}启用
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: transferLanguage('dictList.field.dictionaryInfo', this.props.language),
      closeDetail: this.closeDetail,
      buttons: (
        <Button.Group>
          {!isAbled && <Button onClick={() => this.abledStatus('abled', 1)}>{transferLanguage('dictList.field.enable', this.props.language)}</Button>}
          {isAbled && <Button onClick={() => this.abledStatus('disabled', 1)}>{transferLanguage('dictList.field.disabled', this.props.language)}</Button>}
          <Button type="primary" onClick={this.handleEdit}>
            {transferLanguage('dictList.field.edit', this.props.language)}
          </Button>
        </Button.Group>
      ),
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={DictList}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          // scrollX={1000}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
        />
        <RightDraw {...rightDrawParams}>
          <DictDetails detailId={checkId} isMobile={isMobile} />
        </RightDraw>
      </Fragment>
    );
  }
}
