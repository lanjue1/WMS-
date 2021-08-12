import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import TypeDetails from './TypeDetails';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import SearchSelect from '@/components/SearchSelect';
import { codes, Status, EventType, NoticeMode, formatStatus, formatRequestType, RequestType } from './utils';
import AdSelect from '@/components/AdSelect';
import AdSearch from '@/components/AdSearch';
import { transferLanguage, columnConfiguration } from '@/utils/utils'
import {allDictList } from '@/utils/common'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ interfaceType, common, component, loading, i18n }) => ({
  interfaceType,
  loading: loading.effects['interfaceType/interfaceTypeList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language,

}))
@Form.create()
export default class InterfaceTypeList extends Component {
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
    rowDetails: {},
    requestTypeList: [],
    _RequestType: [],

  };
  className = 'interfaceTypeList';

  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
    },
    {
      title: transferLanguage('Type.field.businessTypeCode', this.props.language),
      dataIndex: 'businessTypeCode',
      render: (text, record) => (
        <a onClick={e => this.showDetail(e, record)} title={text}>
          {text}
        </a>
      ),
      width: 200,
    },
    {
      title: transferLanguage('Type.field.businessTypeName', this.props.language),
      dataIndex: 'businessTypeName',
      render: text => <span title={text}>{text}</span>,
      width: 200,
    },
    {
      title: transferLanguage('Type.field.url', this.props.language),
      dataIndex: 'url',
      render: text => <span title={text}>{text}</span>,
      width: 250,
    },
    {
      title: transferLanguage('Type.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: text => <span>{formatStatus(text)}</span>,
      width: 100,
    },
    {
      title: transferLanguage('Type.field.requestType', this.props.language),
      dataIndex: 'requestType',
      render: text => <span>{formatRequestType(text)}</span>,
      width: 100,
    },
    {
      title: transferLanguage('Type.field.topicNameNormal', this.props.language),
      dataIndex: 'topicNameNormal',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('Type.field.topicNameException', this.props.language),
      dataIndex: 'topicNameException',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('Type.field.remarks', this.props.language),
      dataIndex: 'remarks',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('Type.field.createBy', this.props.language),
      dataIndex: 'createBy',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('Type.field.createTime', this.props.language),
      dataIndex: 'createTime',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('Type.field.updateBy', this.props.language),
      dataIndex: 'updateTime',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
    {
      title: transferLanguage('Type.field.updateTime', this.props.language),
      dataIndex: 'updateBy',
      render: text => <AdSelect value={text} onlyRead={true} />,
    },
  ];
  componentDidMount() {
    this.getInterfaceTypeList();
    this.setState({
      _RequestType: columnConfiguration(RequestType, this.props.language)
    })
  }

  getInterfaceTypeList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'interfaceType/interfaceTypeList',
      payload: params,
    });
    // dispatch({
    //   type: 'interfaceType/selectRequestTypeList',
    //   payload: { code: "REQUEST_TYPE" },
    //   callback: res => {
    //     this.setState({
    //       requestTypeList: res || [],
    //     });
    //   },
    // });
  };

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.getInterfaceTypeList();
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
    this.getInterfaceTypeList(value);
  };

  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/SystemSetting/Type/typeAdd`);
  };
  //编辑：
  handleEdit = () => {
    router.push(`/SystemSetting/Type/typeEdit/${this.state.checkId}`);
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
    this.getInterfaceTypeList(params);
  };

  //详情：
  showDetail = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;
    // console.log('senderId', record.senderId);

    dispatch({
      type: 'interfaceType/interfaceTypeDetails',
      payload: { id },
      callback: res => {
        this.setState({
          isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        });
      },
    });
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
  };

  closeDetail = () => {
    this.setState({
      visible: false,
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
      type: 'interfaceType/ableOperate',
      payload: params,
      callback: res => {
        this.getInterfaceTypeList(formValues);

        if (isSingle) {
          this.props.dispatch({
            type: 'interfaceType/interfaceTypeDetails',
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
      interfaceType: { interfaceTypeList, interfaceTypeDetails },
      form,
      isMobile,
      dictObject,
      language
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      selectedRows,
      updateModalVisible,
      stepFormValues,
      isAbled,
      checkId,
      visible,
      rechargeVisible,
      rowDetails,
      expandForm,
      _RequestType
    } = this.state;

    const selectDetails = interfaceTypeDetails[checkId];
    const firstFormItem = (
      <FormItem label={transferLanguage('Type.field.businessTypeCode', language)}>
        {getFieldDecorator('businessTypeCode')(<Input placeholder="" />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('Type.field.businessTypeName', language)}>
        {getFieldDecorator('businessTypeName')(<Input placeholder="" />)}
      </FormItem>
    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('Type.field.requestType', language)}>
          {getFieldDecorator('requestType')(
            <AdSelect payload={{ code: allDictList.Interface_Request_Type }} />
          )}
        </FormItem>,
      ],
      ['operatorButtons',]

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
      quickQuery: true

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
            {transferLanguage('Common.field.disable', language)}
          </Button>
          <Button
            onClick={() => this.abledStatus('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('Common.field.enable', language)}
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: '接口业务类型详情',
      closeDetail: this.closeDetail,
      buttons: (
        <span>
          <Button.Group>
            {!isAbled && <Button onClick={() => this.abledStatus('abled', 1)}>{transferLanguage('Common.field.enable', language)}</Button>}
            {isAbled && <Button onClick={() => this.abledStatus('disabled', 1)}>{transferLanguage('Common.field.disable', language)}</Button>}
            <Button type="primary" onClick={this.handleEdit}>
              {transferLanguage('CargoOwnerDetail.button.edit', language)}
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
          selectedRows={selectedRows}
          loading={loading}
          data={interfaceTypeList}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          // scrollX={1000}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
        />
        <RightDraw {...rightDrawParams}>
          <TypeDetails checkId={checkId} isMobile={isMobile} />
        </RightDraw>
      </Fragment>
    );
  }
}
