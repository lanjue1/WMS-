import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button } from 'antd';
import SelectForm from '@/components/SelectForm';
import AdSearch from '@/components/AdSearch';
import { formatMessage } from 'umi-plugin-react/locale';
import RightDraw from '@/components/RightDraw';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import router from 'umi/router';
import { queryDictData, queryPerson, queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';
import { allDispatchType, codes, renderTableAdSelect, routeUrl } from './utils';
import DemoDetails from './DemoDetails';

@ManageList
@connect(({ demo, loading, component }) => ({
  vehicleList: demo.carList,
  formValues: demo.formValues,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  vehicleDetail: demo.selectDetails,
  loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class DemoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      expandForm: false,
      visible: false,
      detailId: '',
    };
    this.className = 'vehicle-table';
  }

  componentWillMount() {
    const allDict = [
      allDictList.coach,
      allDictList.vehicleProperties,
      allDictList.vehicleType,
      allDictList.vehicleCategory,
      allDictList.cabinetType,
    ];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    this.selectVehicleList();
  }

  selectVehicleList = ({ payload = {} } = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: allDispatchType.list,
      payload,
      callback: data => {
        if (!data) return;
        queryPerson({ data, searchValue, dispatch });
      },
    });
  };

  selectVehicleDetail = ({ id, callback }) => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.detail,
      payload: { id },
      callback: data => {
        if (!data) return;
        callback && callback(data);
      },
    });
  };

  /**
   * form 查找条件 展开 收起
   */
  toggleForm = expandForm => {
    this.setState({
      expandForm,
    });
  };

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.saveAllValues({ formValues: {} });
    this.selectVehicleList();
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    // if (!formValues) return;
    this.saveAllValues({ formValues });
    this.selectVehicleList({ payload: formValues });
  };

  /**
   * table 表格 批量选择
   */
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    const { formValues } = this.props;
    this.selectVehicleList({ payload: { ...formValues, ...param } });
  };

  saveAllValues = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.allValus,
      payload,
    });
  };

  //详情
  showDetail = detailId => {
    this.selectVehicleDetail({
      id: detailId,
      callback: data => {
        if (!data) return;
        this.setState({ detailId, visible: true });
      },
    });
  };

  closeDetail = () => {
    this.setState({
      visible: false,
    });
  };

  //新建
  handleAdd = () => {
    router.push(routeUrl.add);
  };

  //编辑
  handleEdit = () => {
    const { detailId } = this.state;
    this.closeDetail();
    router.push(`${routeUrl.edit}/${detailId}`);
  };

  //启用、禁用
  enableOrDisable = (type, isSingle) => {
    const { dispatch, formValues } = this.props;
    const { selectedRows, detailId } = this.state;
    dispatch({
      type: allDispatchType.ableVehicle,
      payload: { ids: !isSingle ? selectedRows.map(v => v.id) : [detailId], type },
      callback: () => {
        if (isSingle) {
          this.selectVehicleDetail({ id: detailId });
        }
        this.selectVehicleList({ payload: formValues });
      },
    });
  };

  columns = [
    {
      title: '主车牌',
      dataIndex: 'cartPlateOneNo',
      render: (text, record) => (
        <AdButton
          mode="a"
          onClick={e => this.showDetail(record.id)}
          text={text}
          code={codes.showDetail}
        />
      ),
      fixed: this.props.isMobile ? false : true,
    },
    {
      title: '副车牌',
      dataIndex: 'cartPlateTwoNo',
      width: 100,
    },
    {
      title: '车辆属性',
      dataIndex: 'property',
      width: 100,
      render: text => (
        <AdSelect
          data={this.props.dictObject[allDictList.vehicleProperties]}
          value={text}
          onlyRead={true}
          payload={{ code: allDictList.vehicleProperties }}
        />
      ),
    },
    {
      title: '所属公司',
      dataIndex: 'ownCompanyName',
      render: text => <span title={text}> {text}</span>,
      width: 250,
    },
    {
      title: '分类',
      dataIndex: 'category',
      width: 100,
      render: text => (
        <AdSelect
          data={this.props.dictObject[allDictList.vehicleCategory]}
          value={text}
          onlyRead={true}
          payload={{ code: allDictList.vehicleCategory }}
        />
      ),
    },
    {
      title: '品牌型号',
      dataIndex: 'brandModel',
      width: 200,
    },
    {
      title: '车辆类型',
      dataIndex: 'cartType',
      width: 200,
      render: text => (
        <AdSelect
          data={this.props.dictObject[allDictList.vehicleType]}
          value={text}
          onlyRead={true}
          payload={{ code: allDictList.vehicleType }}
        />
      ),
    },
    {
      title: '柜型',
      dataIndex: 'cabinetType',
      width: 100,
      render: text =>
        renderTableAdSelect({
          props: this.props,
          value: text,
          key: allDictList.cabinetType,
        }),
    },
    {
      title: '柜号',
      dataIndex: 'cabinetCode',
      width: 100,
    },
    {
      title: '车厢',
      dataIndex: 'coach',
      width: 100,
      render: text => (
        <AdSelect
          data={this.props.dictObject[allDictList.coach]}
          value={text}
          onlyRead={true}
          payload={{ code: allDictList.coach }}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'beActive',
      render: text => <span>{text ? '启用' : '禁用'}</span>,
      width: 100,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      width: 100,
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
      width: 150,
    },
    ,
    {
      title: '更新人',
      dataIndex: 'updateBy',
      width: 100,
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
  render() {
    const { vehicleList, loading, form, isMobile, vehicleDetail } = this.props;
    const { selectedRows, expandForm, detailId, visible } = this.state;

    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const firstFormItem = (
      <AntdFormItem
        label={formatMessage({ id: 'vehicle.vehicleList.cartPlate' })}
        code="cartPlate"
        {...commonParams}
      >
        <AntdInput />
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label="所属公司" code="ownCompanyId" {...commonParams}>
        <AdSelect
          url="mds/d-customer/selectCompany"
          show={{ id: 'customerCode', name: 'customerName' }}
        />
      </AntdFormItem>
    );
    // secondForm 参数
    const otherFormItem = [
      [
        <AntdFormItem label="车辆类型" code="cartType" {...commonParams}>
          <AdSelect payload={{ code: allDictList.vehicleType }} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label="车厢" code="coach" {...commonParams}>
          <AdSelect payload={{ code: allDictList.coach }} />
        </AntdFormItem>,
        <AntdFormItem label="分类" code="category" {...commonParams}>
          <AdSelect payload={{ code: allDictList.vehicleCategory }} />
        </AntdFormItem>,
        'operatorButtons',
      ],
    ];
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      code: codes.select,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: this.toggleForm,
    };

    const disabled = selectedRows.length > 0 ? false : true;
    const tableButtonsParams = {
      handleAdd: this.handleAdd,
      code: codes.add,
      buttons: (
        <Fragment>
          <AdButton
            onClick={() => this.enableOrDisable(true)}
            disabled={disabled}
            code={codes.enable}
            text="启用"
          />
          <AdButton
            onClick={() => this.enableOrDisable(false)}
            disabled={disabled}
            code={codes.disable}
            text="禁用"
            style={{ marginLeft: 8 }}
          />
        </Fragment>
      ),
    };

    const beActive = vehicleDetail[detailId] && vehicleDetail[detailId].beActive;
    // 详情 参数
    const rightDrawParams = {
      isMobile,
      visible,
      title: '车辆详情',
      code: codes.showDetail,
      closeDetail: this.closeDetail,
      buttons: (
        <Button.Group>
          <AdButton
            onClick={() => this.enableOrDisable(!beActive, true)}
            text={beActive ? '禁用' : '启用'}
            code={beActive ? codes.disable : codes.enable}
          />
          <AdButton onClick={this.handleEdit} text="编辑" code={codes.edit} />
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
          data={vehicleList}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          code={codes.page}
          scrollX={1800}
          expandForm={expandForm}
          className={this.className}
        />
        <RightDraw {...rightDrawParams}>
          <DemoDetails detailId={detailId} />
        </RightDraw>
      </Fragment>
    );
  }
}
