import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input } from 'antd';
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
import {allDictList } from '@/utils/common'
import SearchSelect from '@/components/SearchSelect';
import FileImport from '@/components/FileImport';
import AntdDatePicker from '@/components/AntdDatePicker';
import { columnsUser, supplierColumns, columnsDriver } from '@/pages/Common/common';
import { vitifyCheck, queryPerson, queryDict, formateDateToMin, formatPrice } from '@/utils/common';
// import DynamicTableDetail from './DynamicTableDetail';
import {
  allDispatchType,
  selectDynamicTableList,
  saveAllValues,
  renderTableAdSelect,
  codes,
  dynamicTableStatusList,
  allUrl,
  routeUrl,
  statusList,
  statusTypeList
} from './utils';
import { billStateOnlyReadList } from '@/utils/constans';
const { confirm } = Modal;
const dateFormat = 'YYYY-MM-DD';

@ManageList
@connect(({ dynamicTable, loading, component }) => ({
  trainInfoList: dynamicTable.trainInfoList,
  dynamicTableList: dynamicTable.dynamicTableList,
  formValues: dynamicTable.formValues,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
  dynamicTableDetail: dynamicTable.dynamicTableDetail,
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
      visibleFile:false
    };
    this.className = 'DynamicTable-table';
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

  // 编辑
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
          style={{color:'#1890FF'}}
        />
      ),
      fixed: this.props.isMobile ? false : true,
    },
    // {
    //   title: '表数据',
    //   dataIndex: 'table',
    //   render: (text, record) => {
    //     return (
    //       <a title={'查看动态表数据'} onClick={e => this.openDynamicData(e, record.name)}>
    //         <AreaChartOutlined />
    //       </a>
    //     );
    //   },
    //   width: 80,
    // },
    {
      title: '字段数',
      dataIndex: 'fieldCount',
      width: 80,
    },
    // {
    //   title: '数据量',
    //   dataIndex: 'dataCount',
    //   width: 80,
    //   render: text => <span title={text}>{text}</span>,
    // },
    {
      title: '是否多值',
      dataIndex: 'beMultiValue',
      width: 80,
      render: text => <span title={text}>{text?'Y':'N'}</span>,
    },
    {
      title: '是否范围',
      dataIndex: 'beFindRange',
      width: 80,
      render: text => <span title={text}>{text?'Y':'N'}</span>,
    },
    {
      title: '范围类型',
      dataIndex: 'rangeType',
      width: 80,
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text =>
        renderTableAdSelect({
          props: this.props,
          value: text,
          data: statusList,
        }),
      width: 80,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 250,
      render: text => <span title={text}>{text}</span>,
    },
  ];

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
      type: 'dynamicTable/operationStatus',
      payload: param,
      callback: data => {
        if (!data) return;
        this.setState({ visible: false, selectedRows: [] });
        selectDynamicTableList({ props: this.props, payload: formValues });
      },
    });
  }

  handleImportFile=()=>{
    this.setState({
      visibleFile:false
    })
  }


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

  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };

    exportTable = () => {
    const { selectedRows } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'dynamicTable/exporTable',
      payload: selectedRows[0],
    })
  }

  render() {
    const { dynamicTableList, loading, form, isMobile, dynamicTableDetail } = this.props;
    const { expandForm, detailId, visible, selectedRows,visibleFile } = this.state;
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
    console.log('状态 --3333',allDictList.Rule_Engine_Status)
    const secondFormItem = (
      <AntdFormItem label="状态" code="status" {...commonParams}>
        <AdSelect payload={{ code: allDictList.Rule_Engine_Status }} />
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
      //   toggleForm: expandForm => {
      //     this.handleStateChange([{ expandForm }]);
      //   },
      // code: codes.select,
    };

    const tableButtonsParams = {
      handleAdd: this.handleAdd,
      // code: codes.page,
      //   selectedLength: selectedRows.length,
      pagination: dynamicTableList.pagination,
      buttons: (
        <Button.Group style={{ marginLeft: 8 }}>
          <AdButton
            disabled={!selectedRows.length > 0}
            onClick={() => this.removeDynamicTable()}
            text="删除"
            ghost
            type="danger"
          // code={codes.remove}
          />
          <AdButton
            onClick={() => this.operationStatus('enable')}
            disabled={!selectedRows.length > 0}
            text="启用"
          />
          <AdButton
            onClick={() => this.operationStatus('disable')}
            disabled={!selectedRows.length > 0}
            text="禁用"
          />
          {/* <AdButton
            onClick={() => this.setState({visibleFile:true})}
            text="导入"
            // code={codes.remove}
            // style={{ marginRight: '10px' }}
            disabled={selectedRows.length !== 1}
          />
          <AdButton
            onClick={() => this.exportTable()}
            text="导出"
            // style={{ marginRight: '10px' }}
            disabled={selectedRows.length !== 1}
          // code={codes.remove}
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
          urlImport={`wms-po/importWmsPo`}
          urlCase={`wms-po/download`}
          queryData={[this.getWmsPoList]}
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
        />
       {/*  <RightDraw {...rightDrawParams}>
          <DynamicTableDetail detailId={detailId} visible={visible} />
        </RightDraw> */}
      </>
    );
  }
}
