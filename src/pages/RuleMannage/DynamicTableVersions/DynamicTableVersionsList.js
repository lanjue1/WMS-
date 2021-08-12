import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, Badge } from 'antd';
import { AreaChartOutlined } from '@ant-design/icons';
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
import FileImport from '@/components/FileImport';
import SearchSelect from '@/components/SearchSelect';
import AntdDatePicker from '@/components/AntdDatePicker';
import { columnsUser, supplierColumns, columnsDriver } from '@/pages/Common/common';
import { vitifyCheck, queryPerson, queryDict, formateDateToMin, formatPrice } from '@/utils/common';
import {
  allDispatchType,
  selectDynamicTableList,
  saveAllValues,
  renderTableAdSelect,
  codes,
  dynamicTableStatusList,
  allUrl,
  routeUrl,
  statusMap,
} from './utils';
import { billStateOnlyReadList } from '@/utils/constans';
const { confirm } = Modal;
const dateFormat = 'YYYY-MM-DD';

@ManageList
@connect(({ dynamicTableVersions, loading, component }) => ({
  trainInfoList: dynamicTableVersions.trainInfoList,
  dynamicTableList: dynamicTableVersions.dynamicTableList,
  formValues: dynamicTableVersions.formValues,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
  dynamicTableDetail: dynamicTableVersions.dynamicTableDetail,
}))
@Form.create()
export default class DynamicTableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      visible: false,
      detailId: '',
      selectedRows: [],
      visibleFile: false
    };
    this.className = 'DynamicTable-table';
  }
 
  componentWillMount() {
    // 查询字典项
    const allDict = [allDictList.mysqlType];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    selectDynamicTableList({ props: this.props });
  }

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form, formValues } = this.props;
    const props = { props: this.props };
    form.resetFields();
    saveAllValues({ payload: { formValues: {} }, ...props });
    selectDynamicTableList({ ...props });
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    // if (!formValues) return;
    const { ...param } = formValues;
    const params = { props: this.props, payload: param };
    saveAllValues({ payload: { formValues: param }, props: this.props });
    selectDynamicTableList(params);
  };

  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    const { formValues } = this.props;
    selectDynamicTableList({ payload: { ...formValues, ...param }, props: this.props });
  };

  // 查看详情
  showDetail = (e, record) => {
    e.stopPropagation();
    this.handleStateChange([{ detailId: record.id }]);
    router.push(`${routeUrl.edit}/${record.id}`);
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
  openDynamicData = (e, record) => {
    router.push({
      //   pathname: `${routeUrl.dynamicData}/${name}`,
      pathname: `${routeUrl.dynamicData}`,
      query: {
        tableName: record.name,
        ruleTableVersionId: record.id
      },
    });
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
      title: '表名',
      dataIndex: 'name',
      render: (text, record) => (
        <AdButton
          mode="a"
          onClick={e => this.showDetail(e, record)}
          text={text}
          code={codes.showDetail}
          style={{ color: '#1890FF' }}
        />
      ),
      fixed: this.props.isMobile ? false : true,
    },
    {
      title: '别名',
      dataIndex: 'tableAliasName',
    },
    {
      title: '表数据',
      dataIndex: 'table',
      render: (text, record) => {
        return (
          <a title={'查看动态表数据'} onClick={e => this.openDynamicData(e, record)}>
            <AreaChartOutlined />
          </a>
        );
      },
      width: 80,
    },
    {
      title: '字段数',
      dataIndex: 'fieldCount',
      width: 80,
    },
    {
      title: '数据量',
      dataIndex: 'dataCount',
      width: 80,
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text =>
      // renderTableAdSelect({
      //   props: this.props,
      //   value: text,
      //   data: statusList,
      // }),
      {
        return <Badge status={statusMap[text]} text={text} />
      },
      width: 80,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 250,
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '有效期',
      dataIndex: 'time',
      //   render: text => <span>{text ? moment(text).format(formateDateToMin) : ''}</span>,
      render: (text, record) => {
        return (
          <span>
            {record.startDate}~{record.endDate}
          </span>
        );
      },
    },
  ];

  //删除
  removeDynamicTable = flag => {
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
            selectDynamicTableList({ props: this.props, payload: formValues });
          },
        });
      },
    });
  };

  operationStatus = (type) => {
    const { dispatch, formValues } = this.props;
    const { selectedRows, detailId } = this.state;
    const ids = selectedRows.map(v => {
      return v.id;
    });
    let param = {
      ids: ids,
      type: type
    }
    dispatch({
      type: 'dynamicTableVersions/operationStatus',
      payload: param,
      callback: data => {
        if (!data) return;
        this.setState({ visible: false, selectedRows: [] });
        selectDynamicTableList({ props: this.props, payload: formValues });
      },
    });
  }

  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };

  exportTableVersions = () => {
    const { selectedRows } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'dynamicTableVersions/exportTableVersions',
      payload: { id: selectedRows[0].id },
    })
  }
  //清空表数据
  emptyTableData = () => {
    confirm({
      title: '确定要清除表数据吗？',
      content: ' ',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const { selectedRows } = this.state
        const { dispatch } = this.props
        dispatch({
          type: 'dynamicTableVersions/emptyTableData',
          payload: { id: selectedRows[0].id },
        })
      }
    })
  }

  handleImportFile = () => {
    this.setState({
      visibleFile: false
    })
  }

  render() {
    const { dynamicTableList, loading, form, isMobile, dynamicTableDetail } = this.props;
    const { expandForm, detailId, visible, selectedRows, visibleFile } = this.state;
    const detail = dynamicTableDetail[detailId] || {};
    const disabled = detail.status === 'RELEASE';

    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const firstFormItem = (
      <AntdFormItem label="表名" code="name" {...commonParams}>
        <Input />
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label="状态" code="status" {...commonParams}>
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
    };

    const tableButtonsParams = {
      pagination: dynamicTableList.pagination,
      rightButtons: (<div style={{ display: 'flex' }} >
        <AdButton
          onClick={() => this.handleAdd()}
          text="新增"
        />
      </div>),
      buttons: (
        <Button.Group style={{ marginLeft: 8 }}>
          <AdButton
            disabled={!selectedRows.length > 0}
            onClick={() => this.removeDynamicTable()}
            text="删除"
            ghost
            type="danger"
          />
          <AdButton
            onClick={() => this.operationStatus('upLine')}
            disabled={!selectedRows.length > 0}
            text="上线"
          />
          <AdButton
            onClick={() => this.operationStatus('downLine')}
            disabled={!selectedRows.length > 0}
            text="下线"
          />
          {/* <AdButton
            onClick={() => this.setState({ visibleFile: true })}
            text="导入"
            disabled={selectedRows.length !== 1}
          />
          <AdButton
            onClick={() => this.exportTableVersions()}
            text="导出"
            disabled={selectedRows.length !== 1}
          />
          <AdButton
            onClick={() => this.emptyTableData()}
            text="清空表数据"
            disabled={selectedRows.length !== 1}
          /> */}
        </Button.Group>
      ),
      // code: codes.bill,
    };

    return (
      <>
        <FileImport
          visibleFile={visibleFile}
          handleCancel={() => {
            this.handleImportFile();
          }}
          urlImport={`rule-table-version/importRuleTableVersion`}
          urlCase={`rule-table-version/exportRuleTableVersion?id=${selectedRows[0] ? selectedRows[0].id : ''}`}
          queryData={[() => selectDynamicTableList({ props: this.props })]}
          importPayload={{ id: selectedRows[0] ? selectedRows[0].id : '' }}
          accept=".xls,.xlsx"
        />
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          loading={loading}
          data={dynamicTableList}
          selectedRows={selectedRows}
          onSelectRow={selectedRows => {
            this.handleStateChange([{ selectedRows }]);
          }}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
          scrollX={1500}
        />
      </>
    );
  }
}
