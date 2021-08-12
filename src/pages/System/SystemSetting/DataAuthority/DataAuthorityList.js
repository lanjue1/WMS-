import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, Badge } from 'antd';
import moment from 'moment';
import router from 'umi/router';
import SelectForm from '@/components/SelectForm';
import RightDraw from '@/components/RightDraw';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import prompt from '@/components/Prompt';
import AntdFormItem from '@/components/AntdFormItem';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import AntdSelectRegion from '@/components/AntdSelectRegion';
import FileImport from '@/components/FileImport';
import { queryDict, formateDateToMin } from '@/utils/common';
import SearchSelect from '@/components/SearchSelect';
import { columnsRole } from '@/pages/Common/common';
import AdSearch from '@/components/AdSearch';
import AdSelect from '@/components/AdSelect';
import { allDictList } from '@/utils/constans';
import {
  selectSequenceList,
  saveAllValues,
  codes,
  allDispatchType,
  routeUrl,
  dataDetail,
  renderTableAdSelect,
} from './utils';
import DataAuthorityDetail from './DataAuthorityDetail';

const { confirm } = Modal;

@ManageList
@connect(({ dataAuthority, loading, component }) => ({
  dataList: dataAuthority.dataList,
  dataDetail: dataAuthority.dataDetail,
  formValues: dataAuthority.formValues,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class DataAuthorityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      visible: false,
      detailId: '',
      selectedRows: [],
      roles: [],
    };
    this.className = 'dataAuthorityList-table';
  }
  componentWillMount() {
    // 查询字典项
    // const allDict = [allDictList.dataType];
    // queryDict({ props: this.props, allDict });
  }
  componentDidMount() {
    selectSequenceList({ props: this.props });
  }

  columns = [
    {
      title: '#',
      dataIndex: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
      width: 50,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: 200,
      render: (text, record) => {
        return (
          <AdButton
            mode="a"
            onClick={e => this.showDetail(e, record.id)}
            text={text}
            code={codes.showDetail}
          />
        );
      },
      fixed: this.props.isMobile ? false : true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(text) {
        //   const val = <AdSelect data={STATUS} value={text} onlyRead={true} />;
        return (
          <Badge
            status={text === 'true' ? 'success' : 'error'}
            text={text === 'true' ? '正常' : '未生效'}
          />
        );
      },
      width: 100,
    },
    {
      title: '角色说明',
      dataIndex: 'remarks',
      render: text => <span title={text}>{text}</span>,
      width: 150,
    },
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: '接口地址',
      dataIndex: 'url',
      render: text => <span title={text}>{text}</span>,
      width: 250,
    },
    {
      title: '角色code',
      dataIndex: 'sysCode',
      render: text => <span title={text}>{text}</span>,
      // width: 250,
    },
    {
      title: '过滤sql',
      dataIndex: 'dataPerm',
      render: text => <span title={text}>{text}</span>,
      // width: 250,
    },
  ];
  //右侧弹窗详情页---修改
  dataDetail = () => {
    const { detailId } = this.state;
    dataDetail({
      type: allDispatchType.detail,
      payload: { id: detailId },
      props: this.props,
    });
  };

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form } = this.props;
    const props = { props: this.props };
    form.resetFields();
    this.setState({
      roles: [],
    });
    // form.setFieldsValue({ menu: [] });
    this.setState({
      menuIds: [],
    });
    saveAllValues({ payload: { formValues: {} }, ...props });
    selectSequenceList({ ...props });
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    if (!formValues) return;
    const { roles, menu, ...value } = formValues;
    if (roles && roles.length > 0) value.roleId = roles[0].id;
    if (menu && menu.length > 0) value.menuId = menu[menu.length - 1];
    const params = { props: this.props, payload: value };
    saveAllValues({ payload: { formValues: value }, props: this.props });
    selectSequenceList(params);
  };

  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    const { formValues } = this.props;
    selectSequenceList({ payload: { ...formValues, ...param }, props: this.props });
  };

  //详情
  showDetail = (e, detailId) => {
    e.stopPropagation();
    this.handleStateChange([{ detailId }, { visible: true }]);
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

  //删除
  removeRecord = () => {
    const { dispatch, formValues } = this.props;
    const { detailId } = this.state;
    confirm({
      title: '确定要删除这条数据吗？',
      content: ' ',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: allDispatchType.delete,
          payload: { id: detailId },
          callback: () => {
            this.setState({ visible: false });
            selectSequenceList({ payload: { ...formValues }, props: this.props });
          },
        });
      },
    });
  };

  //启用、禁用：
  abledStatus = (type, single) => {
    const { dispatch, formValues } = this.props;
    const { detailId, selectedRows } = this.state;
    dispatch({
      type: allDispatchType.enable,
      payload: {
        ids: single ? [detailId] : selectedRows.map(v => v.id),
        enable: type == 'abled' ? true : false,
      },
      callback: res => {
        if (single) {
          this.setState({
            btnAbled: type == 'disabled' ? false : true,
          });
          dispatch({
            type: allDispatchType.detail,
            payload: { id: detailId },
          });
        }
        selectSequenceList({ payload: { ...formValues }, props: this.props });
      },
    });
  };

  getValue = values => {
    this.setState({
      roles: values,
    });
  };
  cusChange = val => {
    this.setState({
      menuIds: val,
    });
  };

  render() {
    const { dataList, loading, form, isMobile, dictObject, dataDetail } = this.props;
    const { expandForm, detailId, visible, selectedRows, roles } = this.state;
    const detail = dataDetail[detailId] || {};

    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const firstFormItem = (
      <AntdFormItem label="角色名称" code="roles" {...commonParams}>
        <SearchSelect
          dataUrl="mds-role/selectList"
          selectedData={roles} // 选中值
          showValue="name"
          searchName="keyWord"
          columns={columnsRole} // 表格展示列
          scrollX={500}
          onChange={this.getValue} // 获取选中值
          multiple={false}
          id="dataAuthrity_1_1"
        />
      </AntdFormItem>
    );
    const secondFormItem = (
      <AntdFormItem label="菜单名称" code="menu" {...commonParams}>
        <AntdSelectRegion
          url="mds-menu/selectFirstMenu"
          paramsLabel="id"
          label="name"
          filter={false}
          isParent={true}
          split="/"
          onChange={this.cusChange}
          cusValue={this.state.menuIds}
        />
      </AntdFormItem>
    );
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      form,
      className: this.className,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      toggleForm: expandForm => {
        this.handleStateChange([{ expandForm }]);
      },
      code: codes.select,
    };

    const tableButtonsParams = {
      handleAdd: this.handleAdd,
      code: codes.add,
      code: codes.bill,
      buttons: (
        <Button.Group>
          <Button
            onClick={() => this.abledStatus('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.disabled}
          >
            禁用
          </Button>
          <Button
            onClick={() => this.abledStatus('abled')}
            disabled={selectedRows.length > 0 ? false : true}
            code={codes.abled}
          >
            启用
          </Button>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    // 详情 参数
    const rightDrawParams = {
      isMobile,
      visible,
      title: '数据权限详情',
      code: codes.showDetail,
      mode: 'rightDraw',
      closeDetail: this.handleStateChange.bind(this, [{ visible: false }]),
      buttons: (
        <>
          {/* <AdButton
                        onClick={() => this.removeRecord(1)}
                        text="删除"
                        type="danger"
                        ghost
                        code={codes.remove}
                        style={{ marginRight: 8 }}
                    /> */}
          <Button.Group>
            {detail.status === 'false' ? (
              <AdButton
                text="启用"
                code={codes.abled}
                onClick={() => this.abledStatus('abled', 1)}
              />
            ) : (
              <AdButton
                text="禁用"
                code={codes.disabled}
                onClick={() => this.abledStatus('disabled', 1)}
              />
            )}
            <AdButton onClick={() => this.handleEdit()} text="编辑" />
          </Button.Group>
        </>
      ),
    };

    return (
      <Fragment>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          loading={loading}
          data={dataList}
          selectedRows={selectedRows}
          onSelectRow={selectedRows => {
            this.handleStateChange([{ selectedRows }]);
          }}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          expandForm={expandForm}
          className={this.className}
          code={codes.page}
          // disabledRowSelected={true}
        />
        <RightDraw {...rightDrawParams}>
          <DataAuthorityDetail detailId={detailId} pageType="rightDraw" />
        </RightDraw>
      </Fragment>
    );
  }
}
