import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { routerRedux, Route, Switch } from 'dva/router';
import { Row, Col, Card, Form, Input, Select, Button } from 'antd';
import StandardTable from '@/components/StandardTable';
import SelectForm from '@/components/SelectForm';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import { codes, Status, formatStatus, SelectColumns } from './utils';
import AdSelect from '@/components/AdSelect';
import { transferLanguage, columnConfiguration } from "@/utils/utils";
import SearchSelect from '@/components/SearchSelect';
import { allDictList } from '@/utils/common'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@ManageList
@connect(({ warehouseArea, common, component, loading, i18n }) => ({
  warehouseArea,
  loading: loading.effects['warehouseArea/warehouseAreaList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language
}))
@Form.create()
export default class WarehouseAreaList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    checkId: '',
    checkIds: [],
    formValues: {},
    isAbled: '',
    warehouseId: [],
    _SelectColumns: [],
  };
  className = 'warehouseArea';

  //列表 列
  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
    },
    {
      //标题
      //title: '编码',
      title: transferLanguage('Area.field.code', this.props.language),
      //数据字段
      dataIndex: 'code',
      render: (text, record) => (
        <a onClick={e => this.handleEdit(e, record)} title={text}>
          {text}
        </a>
      ),
      width: 80,
    },
    {
      //title: '库区名称',
      title: transferLanguage('Area.field.name', this.props.language),
      dataIndex: 'name',
      width: 100,
    },
    {
      //title: '仓库名称',
      title: transferLanguage('Area.field.warehouseName', this.props.language),
      dataIndex: 'warehouseName',
      width: 100,
    },
    {
      //title: '状态',
      title: transferLanguage('Area.field.beActive', this.props.language),
      dataIndex: 'status',
      render: text => <AdSelect data={Status} value={text} onlyRead={true} />,
      width: 100,
    },
    {
      //title: '描述',
      title: transferLanguage('Area.field.description', this.props.language),
      dataIndex: 'description',
      width: 100,
    },
    {
      //title: '备注',
      title: transferLanguage('Area.field.remarks', this.props.language),
      dataIndex: 'remarks',
      width: 100,
    },
    {
      //title: '创建人名称',
      title: transferLanguage('Area.field.createBy', this.props.language),
      dataIndex: 'createBy',
      width: 100,
    },
    {
      //title: '创建时间',
      title: transferLanguage('Area.field.createTime', this.props.language),
      dataIndex: 'createTime',
      width: 100,
    },
    {
      //title: '修改人名称',
      title: transferLanguage('Area.field.updateBy', this.props.language),
      dataIndex: 'updateBy',
      width: 100,
    },
    {
      //title: '修改时间',
      title: transferLanguage('Area.field.updateTime', this.props.language),
      dataIndex: 'updateTime',
      width: 100,
    },
  ];
  componentDidMount() {
    this.getWarehouseAreaList();
    this.setState({
      _SelectColumns: columnConfiguration(SelectColumns, this.props.language)
    })
  }

  getWarehouseAreaList = (params = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: 'warehouseArea/warehouseAreaList',
      payload: params,
      callback: data => {
        if (!data) return;
        let valueList = [];
        data.map(v => {
          const labels = ['senderId'];
          labels.map(item => {
            if (v[item] && !valueList.includes(v[item])) {
              valueList.push(v[item]);
              !searchValue[v[item]] &&
                dispatch({
                  type: 'component/querySearchValue',
                  payload: {
                    params: { id: v[item] },
                    url: 'sms/sms-sender/viewSmsSenderDetails',
                  },
                });
            }
          });
        });
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
    this.getWarehouseAreaList();
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
    const { warehouseId, ...value } = values;
    if (warehouseId && warehouseId.length > 0) value.warehouseId = warehouseId[0].id
    this.setState({
      formValues: value,
    });
    this.getWarehouseAreaList(value);
  };
  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };
  //新建
  handleAdd = () => {
    const { dispatch } = this.props;
    router.push(`/basicData/listWareHouseArea/addWareHouseArea`);
  };

  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getWarehouseAreaList(params);
  };

  //编辑：
  handleEdit = (e, record) => {
    e.stopPropagation();
    const { dispatch } = this.props;
    const { id } = record;
    // console.log('senderId', record.senderId);

    dispatch({
      type: 'warehouseArea/warehouseAreaDetails',
      payload: { id },
      callback: res => {
        this.setState({
          isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        });
      },
    });
    router.push(`/basicData/listWareHouseArea/editWareHouseArea/${id}`);
  };

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type == 'abled' ? true : false;
    dispatch({
      type: 'warehouseArea/ableOperate',
      payload: params,
      callback: res => {
        this.getWarehouseAreaList(formValues);

        if (isSingle) {
          this.props.dispatch({
            type: 'warehouseArea/warehouseAreaDetails',
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

  render() {
    const {
      loading,
      warehouseArea: { warehouseAreaList, warehouseAreaDetails },
      form,
      isMobile,
      dictObject,
      language
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      selectedRows,
      isAbled,
      checkId,
      visible,
      rowDetails,
      warehouseId,
      expandForm
    } = this.state;

    const selectDetails = warehouseAreaDetails[checkId];
    const firstFormItem = (
      <FormItem label={transferLanguage('Area.field.code', this.props.language)}>{getFieldDecorator('code')(<Input placeholder="" />)}</FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('Area.field.warehouse', this.props.language)}>
        {getFieldDecorator('warehouseId')(
          <SearchSelect
            dataUrl={'wms-warehouse/selectWmsWarehouseList'}
            selectedData={warehouseId} // 选中值
            showValue="code"
            searchName="keyWord"
            multiple={false}
            columns={SelectColumns}
            onChange={values => this.getValue(values, 'warehouseId')}
            id="warehouseId"
            allowClear={true}
            scrollX={200}
          />
        )}</FormItem>
    );

    // secondForm 参数
    const otherFormItem = [
      [
        <FormItem label={transferLanguage('Area.field.beActive', this.props.language)}>
          {getFieldDecorator('status')(
            <AdSelect payload={{ code: allDictList.BasicData_Status }} />

          )}
        </FormItem>,
      ],
      //   [
      //     <FormItem label="国家ID">
      //       {getFieldDecorator('countryId')(<Input placeholder="" />)}
      //     </FormItem>,
      ['operatorButtons'],
      //   ],
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
      code: codes.add,
      buttons: (
        <Button.Group>
          <AdButton
            onClick={() => this.abledStatus('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
            text={transferLanguage('Common.field.disable', this.props.language)}
            code={codes.disabled}
          />

          <AdButton
            onClick={() => this.abledStatus('abled')}
            disabled={selectedRows.length > 0 ? false : true}
            text={transferLanguage('Common.field.enable', this.props.language)}
            code={codes.enable}
          />

        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          data={warehouseAreaList}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
        />
      </Fragment>
    );
  }
}
