import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, DatePicker } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import { formatMessage } from 'umi-plugin-react/locale';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdModal from '@/components/AdModal';
import AntdInput from '@/components/AntdInput';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';

import { transferLanguage, columnConfiguration } from "@/utils/utils";
import { formItemFragement, formatPrice, queryDict, allDictList } from '@/utils/common';

import {
  allDispatchType,
  columnsWare,
  codes,
  selectList,
  routeUrl,
  columns,
  typeStatus,
  isDecimal,
  ExceptStatus,
} from './utils';

const confirm = Modal.confirm;

const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@ManageList

@connect(({ WarehouseBin, loading, component, i18n }) => ({
  WarehouseBin,
  warehouseBinList: WarehouseBin.warehouseBinList,
  dictObject: component.dictObject,
  searchValue: component.searchValue,

  loading: loading.effects[allDispatchType.list],
  language: i18n.language
}))
@Form.create()
export default class WarehouseBinList extends Component {
  className = 'warehouseBin';
  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
      detailId: '',
      visible: false,
      expandForm: false,
      selectedRows: [],
      columnsList: [],
      _columnsWare: [],
      warehouse: [],
      storageType: [],
      warehouseArea: [],
    };
  }
  componentDidMount() {
    selectList({ props: this.props });
    let array = []
    array = columns.map(v => {
      v.title = transferLanguage(v.title, this.props.language)
      return v
    })
    this.setState({
      columnsList: array,
      _columnsWare: columnConfiguration(columnsWare, this.props.language)
    })
  }

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form, } = this.props
    const props = { props: this.props };
    this.setState({
      formValues: {},
    });
    form.resetFields();
    // saveAllValues({ payload: { formValues: {} }, ...props });
    selectList({ ...props });
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    // if (!formValues) return;
    const params = { props: this.props, payload: formValues };
    selectList(params);
    this.setState({ formValues })
  };

  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    const { formValues } = this.state;
    selectList({ payload: { ...formValues, ...param }, props: this.props });
  };

  // 选中行
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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  //新建
  handleAdd = () => {
    router.push(routeUrl.add)
  }
  abledModal = () => {

  }

  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };

  //启用、禁用：
  abledStatus = (type) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = checkIds;
    params.type = type
    const param = { props: this.props, payload: formValues };

    dispatch({
      type: allDispatchType.abled,
      payload: params,
      callback: res => {
        if (res.code === 0) {
          selectList({ ...param });
        }

      },
    });
  };
  handleOk = () => {
    const { form, dispatch } = this.props
    const { formValues } = this.state

    form.validateFields((errs, values) => {
      console.log('handleOk==>', values)
      const { storageTypeId, warehouseAreaNameId, warehouseId, ...value } = values
      value.storageTypeId = storageTypeId[0].id
      value.warehouseAreaId = warehouseAreaNameId[0].id
      value.warehouseId = warehouseId[0].id
      dispatch({
        type: 'WarehouseBin/addBatch',
        payload: value,
        callback: data => {
          const param = { props: this.props, payload: formValues };
          selectList({ ...param });
          this.setState({ visible: false })
        }
      })

    })
  }
  print = (type) => {
    const { checkIds, selectedRows } = this.state
    const { dispatch } = this.props
    let id = selectedRows[0]?.id
    dispatch({
      type: 'common/setPrint',
      payload: { ids: checkIds },
      callback: data => {
        router.push(`/print/${id}/${type}`);
      }
    })
  }
  render() {
    const { warehouseBinList, loading, form, language } = this.props;
    const {
      expandForm,
      selectedRows,
      columnsList,
      visible,
      warehouse,
      storageType,
      warehouseArea,
      _columnsWare,
    } = this.state;
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const firstFormItem = (
      <AntdFormItem label={transferLanguage('Bin.field.code', language)} code="code" {...commonParams}>
        <Input />
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label={transferLanguage('Bin.field.warehouseAreaName', language)} code="warehouseAreaId" {...commonParams}>
        <Input />
      </AntdFormItem>
    );
    const otherFormItem = [
      [
        <AntdFormItem label={transferLanguage('PutAwayDetail.field.status', language)} code="status" {...commonParams}>
          <AdSelect payload={{ code: allDictList.BasicData_Status }} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage('Bin.field.exception', language)} code="exception" {...commonParams}>
          <AdSelect payload={{ code: allDictList.Bin_Exception }} />
        </AntdFormItem>,
      ],
      ['operatorButtons'],
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

      // code: codes.select,
    };

    const tableButtonsParams = {
      handleAdd: this.handleAdd,
      code: codes.add,

      rightButtonsFist: (
        <AdButton
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => this.setState({ visible: !visible })}
          text={transferLanguage('Bin.button.addBatch', language)}
          code={codes.addBatch}
        />
      ),
      buttons: (
        <Button.Group>
          <AdButton
            onClick={() => this.abledStatus('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.disabled}
            text={transferLanguage('Common.field.disable', this.props.language)} />
          <AdButton
            onClick={() => this.abledStatus('enable')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.enabled}
            text={transferLanguage('Common.field.enable', this.props.language)} />
          <AdButton onClick={() => this.print('BIN')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.print}
            text={transferLanguage('base.prompt.print', this.props.language)}
          />
          <AdButton onClick={() => this.print('BIN_BARCODE')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.printSmall}
            text={transferLanguage('Bin.button.printSmallLable', this.props.language)}
          />
          <AdButton onClick={() => this.print('BIN_LABLE')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.printBig}
            text={transferLanguage('Bin.button.printBigLable', this.props.language)}
          />
          <AdButton onClick={() => this.abledStatus('resetException')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.resetExcept}
            text={transferLanguage('Bin.button.resetException', this.props.language)}
          />
        </Button.Group>

      ),
      selectedRows: selectedRows,

    };
    const formItem = [
      [
        <AntdFormItem label={transferLanguage("Summary.field.warehouse", language)} code="warehouseId"
          rules={[{ required: true }]}
          {...commonParams}>
          <SearchSelect
            dataUrl={'wms-warehouse/selectWmsWarehouseList'}
            selectedData={warehouse} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_columnsWare}
            // onChange={values => this.getValue(values, 'warehouse')}
            id="warehouseId"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("partData.field.storageType", language)} code="storageTypeId"
          rules={[{ required: true }]}
          {...commonParams}>
          <SearchSelect
            dataUrl={'wms-storage-type/selectWmsStorageTypeList'}
            selectedData={storageType} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_columnsWare}
            // onChange={values => this.getValue(values, 'storageType')}
            id="storageType"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.scaleType", language)} code="scaleType"
          rules={[{ required: true }]}
          {...commonParams}>
          <AdSelect data={isDecimal} isExist />
        </AntdFormItem>,
        <>
        </>
      ],
      [
        <AntdFormItem label={transferLanguage("InventoryList.field.binTypeCode", language)} code="binType"
          rules={[{ required: true }]}
          {...commonParams}>
          <AdSelect data={typeStatus} isExist={true} />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.warehouseAreaName", language)} code="warehouseAreaNameId"
          rules={[{ required: true }]}

          {...commonParams}>
          <SearchSelect
            dataUrl={'wms-warehouse-area/selectWmsWarehouseAreaList'}
            selectedData={warehouseArea} // 选中值
            showValue="name"
            searchName="name"
            multiple={false}
            columns={_columnsWare}
            // onChange={values => this.getValue(values, 'warehouseArea')}
            id="warehouseAreaId"
            allowClear={true}
            scrollX={200}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.rowStart", language)} code="rowStart"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.rowEnd", language)} code="rowEnd"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.lineStart", language)} code="lineStart"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.lineEnd", language)} code="lineEnd"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem label={transferLanguage("Bin.field.tierStart", language)} code="tierStart"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
        <AntdFormItem label={transferLanguage("Bin.field.tierEnd", language)} code="tierEnd"
          rules={[{ required: true }]}
          {...commonParams}>
          <AntdInput />
        </AntdFormItem>,
      ],

    ]

    // 详情 参数
    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          // disabledRowSelected={true}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          loading={loading}
          data={warehouseBinList}
          columns={columnsList}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
        // code={codes.page}
        />
        <AdModal
          visible={visible}
          title={transferLanguage('Bin.button.addBatch', language)}
          onOk={this.handleOk}
          onCancel={() => this.setState({ visible: !visible })}
          width="800px"
        >
          <AntdForm >{formItemFragement(formItem)}</AntdForm>
        </AdModal>
      </Fragment>
    );
  }
}
