import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import SelectForm from '@/components/SelectForm';
import RightDraw from '@/components/RightDraw';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import AdSearch from '@/components/AdSearch';
import { allDictList } from '@/utils/constans';
import SearchSelect from '@/components/SearchSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import { columnsUser, supplierColumns, columnsDriver } from '@/pages/Common/common';
import { vitifyCheck, queryPerson, queryDict, formateDateToMin, formatPrice } from '@/utils/common';
import DynamicDataDetail from './DynamicDataDetail';
import {
  allDispatchType,
  selectDynamicDataList,
  saveAllValues,
  renderTableAdSelect,
  codes,
  dynamicDataStatusList,
  allUrl,
  routeUrl,
} from './utils';
import { billStateOnlyReadList } from '@/utils/constans';
const { confirm } = Modal;
const dateFormat = 'YYYY-MM-DD';

@ManageList
@connect(({ dynamicData, loading, component }) => ({
  trainInfoList: dynamicData.trainInfoList,
  dynamicDataList: dynamicData.dynamicDataList,
  formValues: dynamicData.formValues,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class DynamicDataList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      visible: false,
      detailId: '',
      selectedRows: [],
    };
    this.className = 'DynamicData-table';
  }

  componentWillMount() {
    // 查询字典项
    const allDict = [allDictList.mysqlType];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    selectDynamicDataList({ props: this.props });
  }

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form, formValues } = this.props;
    const props = { props: this.props };
    form.resetFields();
    saveAllValues({ payload: { formValues: {} }, ...props });
    selectDynamicDataList({ ...props });
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    // if (!formValues) return;
    const { ...param } = formValues;
    const params = { props: this.props, payload: param };
    saveAllValues({ payload: { formValues: param }, props: this.props });
    selectDynamicDataList(params);
  };

  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    const { formValues } = this.props;
    selectDynamicDataList({ payload: { ...formValues, ...param }, props: this.props });
  };

  // 查看详情
  showDetail = (e, record) => {
    e.stopPropagation();
    this.handleStateChange([{ detailId: record.id }, { visible: true }]);
  };

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };

  //新建
  handleAdd = () => {
    router.push(routeUrl.add);
  };

  //编辑
  handleEdit = () => {
    const { detailId } = this.state;
    this.handleStateChange([{ visible: false }]);
    router.push(`${routeUrl.edit}/${detailId}`);
  };

  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
      fixed: this.props.isMobile ? false : true,
    },
    {
      title: '数据库名称',
      dataIndex: 'pollName',
      render: (text, record) => (
        <AdButton
          mode="a"
          onClick={e => this.showDetail(e, record)}
          text={text}
          code={codes.showDetail}
        />
      ),
      fixed: this.props.isMobile ? false : true,
    },
    {
      title: '数据库类别',
      dataIndex: 'type',
      render: text =>
        renderTableAdSelect({
          props: this.props,
          value: text,
          key: allDictList.mysqlType,
        }),
      width: 80,
    },
    {
      title: '数据库连接',
      dataIndex: 'url',
      width: 150,
    },
    {
      title: '账号',
      dataIndex: 'username',
      width: 250,
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '密码',
      dataIndex: 'password',

      width: 100,
    },
    {
      title: '备注', //对应行车档案--车次--动态数据源--司机
      dataIndex: 'remarks',
      render: text => <span>{text}</span>,
      width: 150,
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
      render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
    },
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
      render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
    },
  ];

  //删除
  removeDynamicData = flag => {
    const { dispatch, formValues } = this.props;
    const { selectedRows, detailId } = this.state;
    const ids = selectedRows.map(v => {
      return v.id;
    });
    confirm({
      title: '确定要删除这条数据吗？',
      content: ' ',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: allDispatchType.remove,
          payload: { ids: flag ? [detailId] : ids },
          callback: data => {
            if (!data) return;
            this.setState({ visible: false, selectedRows: [] });
            selectDynamicDataList({ props: this.props, payload: formValues });
          },
        });
      },
    });
  };

  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };

  render() {
    const { dynamicDataList, loading, form, isMobile } = this.props;
    const { expandForm, detailId, visible, selectedRows } = this.state;

    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const firstFormItem = (
      <AntdFormItem label="数据源名称" code="pollName" {...commonParams}>
        <Input />
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label="数据库类型" code="type" {...commonParams}>
        <AdSelect payload={{ code: allDictList.mysqlType }} />
      </AntdFormItem>
    );
    // secondForm 参数
    // const otherFormItem = [
    //   [
    //     <AntdFormItem label="创建时间" code="createTime" {...commonParams}>
    //       <AntdDatePicker mode="range" />
    //     </AntdFormItem>,
    //     'operatorButtons'
    //   ],
    // ];
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      //   otherFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: expandForm => {
        this.handleStateChange([{ expandForm }]);
      },
      // code: codes.select,
    };

    const tableButtonsParams = {
      handleAdd: this.handleAdd,
      code: codes.add,
      //   selectedLength: selectedRows.length,
      
      pagination: dynamicDataList.pagination,
      buttons: (
        <AdButton
          disabled={!selectedRows.length > 0}
          onClick={() => this.removeDynamicData()}
          text="删除"
          ghost
          type="danger"
          code={codes.remove}
        />
      ),
      code: codes.bill,
    };
    const disabled = false;

    // 详情 参数
    const rightDrawParams = {
      isMobile,
      visible,
      title: '动态数据源详情',
      code: codes.showDetail,
      closeDetail: this.handleStateChange.bind(this, [{ visible: false }]),
      buttons: (
        <>
          <AdButton
            onClick={() => this.removeDynamicData(1)}
            disabled={disabled}
            text="删除"
            type="danger"
            ghost
            code={codes.remove}
          />
          <Button.Group style={{ marginLeft: 8 }}>
            <AdButton
              type="primary"
              onClick={this.handleEdit}
              disabled={disabled}
              text="编辑"
              code={codes.edit}
            />
          </Button.Group>
        </>
      ),
    };

    return (
      <>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          loading={loading}
          data={dynamicDataList}
          selectedRows={selectedRows}
          onSelectRow={selectedRows => {
            this.handleStateChange([{ selectedRows }]);
          }}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
        />
        <RightDraw {...rightDrawParams}>
          <DynamicDataDetail detailId={detailId} visible={visible} />
        </RightDraw>
      </>
    );
  }
}
