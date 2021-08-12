import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { connect } from 'dva';
import Media from 'react-media';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import StandardTable from '@/components/StandardTable';
import OrgDetails from './OrgDetails';
import prompt from '@/components/Prompt';
import moment from 'moment';
import router from 'umi/router';
import { codes } from './utils';
import { transferLanguage } from '@/utils/utils';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { Option } = Select;

@ManageList
@connect(({ tmsOrg, loading, common, i18n }) => ({
  tmsOrg,
  loading: loading.effects['tmsOrg/selectList'],
  ownCompany: common.ownCompany,
  language: i18n.language,
}))
@Form.create()
export default class orgList extends Component {
  state = {
    visible: false,
    id: '',
    formValues: {},
    selectedRows: [],
    checkId: '',
    btnAbled: '',
    globalListData: [],
    tempList: [],
  };
  className = 'orgList';

  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
      // fixed: this.props.isMobile ? false : true,
    },
    {
      title: transferLanguage('OrgList.field.code', this.props.language),
      dataIndex: 'code',
      fixed: this.props.isMobile ? false : true,
      render: (text, record) => <a onClick={e => this.showDetail(e, record.id)}>{text}</a>,
      width: 250,
    },
    {
      title: transferLanguage('OrgList.field.name', this.props.language),
      dataIndex: 'name',
    },
    {
      title: transferLanguage('OrgList.field.bizType', this.props.language),
      dataIndex: 'bizType',
    },
    {
      title: transferLanguage('OrgList.field.parentName', this.props.language),
      dataIndex: 'parentName',
    },
    {
      title: transferLanguage('OrgList.field.status', this.props.language),
      dataIndex: 'status',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
      width: 100,
    },
    {
      title: transferLanguage('OrgList.field.createTime', this.props.language),
      dataIndex: 'createTime',
    },
    {
      title: transferLanguage('OrgList.field.remark', this.props.language),
      dataIndex: 'remarks',
    },
  ];

  componentWillMount() {
    this.getLocationList();
  }

  getLocationList = (params = {}, type) => {
    const { dispatch } = this.props;
    const { id } = params;
    const { globalListData } = this.state;
    if (id) params.id = id;
    dispatch({
      type: 'tmsOrg/selectList',
      payload: params,
      callback: res => {
        res.map(v => {
          if (v.childNumber > 0) v.children = [];
        });
        if (type == 'child') {
          this.formateData(res, globalListData, id);
        } else {
          this.setState({
            globalListData: res,
          });
          if (res.length === 1) {
            this.getLocationList({ id: res[0].id }, 'child');
          }
        }
      },
    });
  };
  formateData = (dataChild, data, id) => {
    data.forEach(v => {
      if (dataChild.length > 0 && v.id == id) {
        v.children = dataChild;
        this.setState({ tempList: data });
      } else if (v.children) {
        this.formateData(dataChild, v.children, id);
      }
    });
  };
  //展开关闭：
  onExpandRow = (expanded, record) => {
    expanded && this.getLocationList({ id: record.id }, 'child');
  };

  // 分页操作
  handleStandardTableChange = param => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.dispatchFun('tmsOrg/selectList', params);
  };

  // 重置条件查询表单
  handleFormReset = () => {
    this.setState({ formValues: {} });
    this.dispatchFun('tmsOrg/selectList', {});
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
    this.dispatchFun('tmsOrg/selectList', value);
  };

  // 跳转 新增页面
  handleAdd = () => {
    router.push('/system/OrgList/add-form');
  };

  // 跳转 编辑页面
  handleEdit = () => {
    const { id } = this.state;
    this.closeDetail();
    router.push(`/system/OrgList/edit-form/${id}`);
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
      checkId: id,
      id,
    });
    // this.dispatchFun('tmsOrg/selectDetails', { id });
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
    let urlType = 'tmsOrg/enableOrg';
    if (type == 'disabled') {
      urlType = 'tmsOrg/disabledOrg';
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
            type: 'tmsOrg/selectDetails',
            payload: { id: checkId },
          });
        } else {
          dispatch({
            type: 'tmsOrg/selectList',
            payload: this.state.formValues,
          });
        }
      },
    });
  };

  render() {
    const {
      form,
      loading,
      tmsOrg: { selectList, selectDetails },
      isMobile,
      ownCompany,
      language
    } = this.props;
    const { id, visible, selectedRows, checkId, btnAbled, globalListData } = this.state;

    const { getFieldDecorator } = form;
    const details = checkId ? selectDetails[checkId] : {};
    const vehicleAbled_check = btnAbled !== '' ? btnAbled : details && details.beActive;

    const tableButtonsParams = {
      show: true,
      handleAdd: this.handleAdd,
      buttons: (
        <Button.Group>
          <Button
            onClick={() => this.useVehicleType('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('OrgList.field.disable', this.props.language)}
          </Button>
          <Button
            onClick={() => this.useVehicleType('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('OrgList.field.enable', this.props.language)}
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: transferLanguage('OrgList.field.orgInfo', this.props.language),
      closeDetail: this.closeDetail,
      buttons: (
        <span>
          <Button.Group>
            {!vehicleAbled_check && (
              <Button onClick={() => this.useVehicleType('abled', 1)}>{transferLanguage('OrgList.field.enable', this.props.language)}</Button>
            )}
            {vehicleAbled_check && (
              <Button onClick={() => this.useVehicleType('disabled', 1)}>{transferLanguage('OrgList.field.disable', this.props.language)}</Button>
            )}
            <Button type="primary" onClick={this.handleEdit}>
            {transferLanguage('OrgList.field.edit', this.props.language)}
            </Button>
          </Button.Group>
        </span>
      ),
    };

    // firstForm 参数
    const firstFormItem = (
      <FormItem label={transferLanguage('OrgList.field.code', this.props.language)}>
        {getFieldDecorator('code')(<Input  />)}
      </FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('OrgList.field.name', this.props.language)}>
        {getFieldDecorator('name')(<Input  />)}
      </FormItem>
    );
    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('OrgList.field.bizType', this.props.language)}>
          {getFieldDecorator('bizType')(<Input  />)}
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
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        {globalListData.length > 0 && (
          <StandardTable
            defaultExpandedRowKeys={globalListData.length === 1 ? [globalListData[0].id] : []}
            selectedRows={selectedRows}
            loading={loading}
            data={{ list: globalListData }}
            columns={this.columns}
            onSelectRow={this.handleSelectRows}
            onPaginationChange={this.handleStandardTableChange}
            className={this.className}
            onExpandRow={this.onExpandRow}
            onExpandedRowsChange={this.onExpandedRowsChange}
            code={codes.page}
          />
        )}
        <RightDraw {...rightDrawParams}>
          <OrgDetails detailId={id} isMobile={isMobile} />
        </RightDraw>
      </Fragment>
    );
  }
}
