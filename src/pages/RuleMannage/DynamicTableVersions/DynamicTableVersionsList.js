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
    // ???????????????
    const allDict = [allDictList.mysqlType];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    selectDynamicTableList({ props: this.props });
  }

  /**
   * form ???????????? ??????
   */
  handleFormReset = () => {
    const { form, formValues } = this.props;
    const props = { props: this.props };
    form.resetFields();
    saveAllValues({ payload: { formValues: {} }, ...props });
    selectDynamicTableList({ ...props });
  };

  /**
   * form ???????????? ??????
   */
  handleSearch = formValues => {
    // if (!formValues) return;
    const { ...param } = formValues;
    const params = { props: this.props, payload: param };
    saveAllValues({ payload: { formValues: param }, props: this.props });
    selectDynamicTableList(params);
  };

  /**
   * table ?????? ????????????
   */
  handleStandardTableChange = param => {
    const { formValues } = this.props;
    selectDynamicTableList({ payload: { ...formValues, ...param }, props: this.props });
  };

  // ????????????
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

  //??????
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
      title: '??????',
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
      title: '??????',
      dataIndex: 'tableAliasName',
    },
    {
      title: '?????????',
      dataIndex: 'table',
      render: (text, record) => {
        return (
          <a title={'?????????????????????'} onClick={e => this.openDynamicData(e, record)}>
            <AreaChartOutlined />
          </a>
        );
      },
      width: 80,
    },
    {
      title: '?????????',
      dataIndex: 'fieldCount',
      width: 80,
    },
    {
      title: '?????????',
      dataIndex: 'dataCount',
      width: 80,
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '??????',
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
      title: '??????',
      dataIndex: 'remarks',
      width: 250,
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '?????????',
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

  //??????
  removeDynamicTable = flag => {
    const { dispatch, formValues } = this.props;
    const { selectedRows, detailId } = this.state;
    const ids = selectedRows.map(v => {
      return v.id;
    });
    confirm({
      title: '?????????????????????????????????',
      content: ' ',
      okText: '??????',
      okType: 'danger',
      cancelText: '??????',
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
  //???????????????
  emptyTableData = () => {
    confirm({
      title: '??????????????????????????????',
      content: ' ',
      okText: '??????',
      okType: 'danger',
      cancelText: '??????',
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
      <AntdFormItem label="??????" code="name" {...commonParams}>
        <Input />
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label="??????" code="status" {...commonParams}>
        <AdSelect payload={{ code: allDictList.mysqlType }} />
      </AntdFormItem>
    );
    // secondForm ??????
    // const otherFormItem = [
    //   [
    //     <AntdFormItem label="????????????" code="createTime" {...commonParams}>
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
          text="??????"
        />
      </div>),
      buttons: (
        <Button.Group style={{ marginLeft: 8 }}>
          <AdButton
            disabled={!selectedRows.length > 0}
            onClick={() => this.removeDynamicTable()}
            text="??????"
            ghost
            type="danger"
          />
          <AdButton
            onClick={() => this.operationStatus('upLine')}
            disabled={!selectedRows.length > 0}
            text="??????"
          />
          <AdButton
            onClick={() => this.operationStatus('downLine')}
            disabled={!selectedRows.length > 0}
            text="??????"
          />
          {/* <AdButton
            onClick={() => this.setState({ visibleFile: true })}
            text="??????"
            disabled={selectedRows.length !== 1}
          />
          <AdButton
            onClick={() => this.exportTableVersions()}
            text="??????"
            disabled={selectedRows.length !== 1}
          />
          <AdButton
            onClick={() => this.emptyTableData()}
            text="???????????????"
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
