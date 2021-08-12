import React, { Component, Fragment } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { connect } from 'dva';
import Media from 'react-media';
import SelectForm from '@/components/SelectForm';
import ManageList from '@/components/ManageList';
import TableButtons from '@/components/TableButtons';
import RightDraw from '@/components/RightDraw';
import StandardTable from '@/components/StandardTable';
import AntdInput from '@/components/AntdInput';
import MenuDetails from './MenuDetails';
import AdButton from '@/components/AdButton'
import styles from '@/pages/Operate.less';
import moment from 'moment';
import router from 'umi/router';
import prompt from '@/components/Prompt';
import { codes, menuTypeData } from './utils';
import AdSelect from '@/components/AdSelect';
import FileImport from '@/components/FileImport'
import { transferLanguage } from '@/utils/utils';


const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const FormItem = Form.Item;
const { Option } = Select;

@ManageList
@connect(({ tmsMenu, loading, common, i18n }) => ({
  tmsMenu,
  loading: loading.effects['tmsMenu/selectFirstMenu'],
  language: i18n.language
}))
@Form.create()
export default class MenuList extends Component {
  state = {
    visible: false,
    id: '',
    formValues: {},
    selectedRows: [],
    checkId: '',
    globalListData: [],
    expandForm: false,
    visibleFile:false,
  };
  className = 'menuList';

  columns = [
    {
      title: transferLanguage('MenuList.field.code', this.props.language),
      dataIndex: 'code',
      fixed: this.props.isMobile ? false : true,
      render: (text, record) => (
        <a onClick={e => this.showDetail(e, record.id)} title={text}>
          {text}
        </a>
      ),
      width: 250,
    },
    {
      title: transferLanguage('MenuList.field.name', this.props.language),
      dataIndex: 'name',
    },
    {
      title: transferLanguage('MenuList.field.type', this.props.language),
      dataIndex: 'type',
      render: (text, record) => (
        <AdSelect
          data={menuTypeData}
          value={text}
          onlyRead={true}
          // payload={{ code: 'vehicle-papers-type' }}
        />
      ),
    },
    {
      title: transferLanguage('MenuList.field.icon', this.props.language),
      dataIndex: 'icon',
    },
    {
      title: transferLanguage('MenuList.field.path', this.props.language),
      dataIndex: 'path',
    },
    {
      title: transferLanguage('MenuList.field.pathName', this.props.language),
      dataIndex: 'pathName',
    },
    {
      title: transferLanguage('MenuList.field.component', this.props.language),
      dataIndex: 'component',
    },
    {
      title: transferLanguage('MenuList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: text => <span>{text ? '启用' : '禁用'}</span>,
      width: 100,
    },
    {
      title: transferLanguage('MenuList.field.url', this.props.language),
      dataIndex: 'url',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: transferLanguage('MenuList.field.trueUrl', this.props.language),
      dataIndex: 'trueUrl',
      render: text => <span title={text}>{text}</span>,
    },
    {
      title: transferLanguage('MenuList.field.clazz', this.props.language),
      dataIndex: 'clazz',
    },
    {
      title: transferLanguage('MenuList.field.remark', this.props.language),
      dataIndex: 'remarks',
    },
  ];

  componentDidMount() {
    // this.dispatchFun('tmsMenu/selectFirstMenu', {});
    this.getTableTreeList();
  }

  getTableTreeList = (params = {}, type) => {
    const { dispatch } = this.props;
    const { id } = params;
    const { globalListData } = this.state;
    if (id) params.id = id;
    // params.pageSize = 100;
    dispatch({
      type: 'tmsMenu/selectFirstMenu',
      payload: params,
      callback: res => {
        res.map(v => {
          if (v.childNumber > 0) v.children = [];
        });
        if (type == 'child') {
          this.locationData(res, globalListData, id);
        } else {
          this.setState({
            globalListData: res,
          });
          if (res.length === 1) {
            this.getTableTreeList({ id: res[0].id }, 'child');
          }
        }
      },
    });
  };
  locationData = (dataChild, data, id) => {
    data.forEach(v => {
      if (dataChild.length > 0 && v.id == id) {
        v.children = dataChild;
      } else if (v.children) {
        this.locationData(dataChild, v.children, id);
      }
    });
  };
  //展开关闭：
  onExpandRow = (expanded, record) => {
    // console.log('expanded, record', expanded, record);
    expanded && this.getTableTreeList({ id: record.id }, 'child');
  };

  // 分页操作
  handleStandardTableChange = param => {
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.dispatchFun('tmsMenu/selectFirstMenu', params);
  };

  // 重置条件查询表单
  handleFormReset = () => {
    this.setState({ formValues: {} });
    this.dispatchFun('tmsMenu/selectFirstMenu', {});
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
    this.dispatchFun('tmsMenu/selectFirstMenu', value);
  };

  // 跳转 新增页面
  handleAdd = () => {
    // console.log('新增页面999');
    router.push('/SystemSetting/MenuList/add-form');
  };

  // 跳转 编辑页面
  handleEdit = () => {
    const { id } = this.state;
    this.closeDetail();
    router.push(`/SystemSetting/MenuList/edit-form/${id}`);
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
      id,
      checkId: id,
    });
    // this.dispatchFun('tmsMenu/selectDetails', { id });
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
    let urlType = 'tmsMenu/enableMenu';
    if (type == 'disabled') {
      urlType = 'tmsMenu/disabledMenu';
    }
    dispatch({
      type: urlType,
      payload: { ids: single ? [checkId] : checkIds },
      callback: res => {
        if (single) {
          dispatch({
            type: 'tmsMenu/selectDetails',
            payload: { id: checkId },
          });
        } else {
          dispatch({
            type: 'tmsMenu/selectFirstMenu',
            payload: this.state.formValues,
          });
        }
      },
    });
  };
  ableOperate = (type) => {
    const { dispatch } = this.props
    // const { checkIds} = this.state
    const params = {
        type,
    }
    dispatch({
        type: 'tmsMenu/ableOperate',
        payload: params,
        callback: res => {
          this.getTableTreeList();
        }
    })
}
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  handleImportFile = () => {
		this.setState({visibleFile:false})
	}
  render() {
    const {
      form,
      loading,
      tmsMenu: { selectFirstMenu, selectDetails },
      isMobile,
      language
    } = this.props;
    const { id, visible, selectedRows, checkId, globalListData, expandForm,visibleFile } = this.state;
    const { getFieldDecorator } = form;
    
    const firstFormItem = (
      <FormItem label={transferLanguage('MenuList.field.code', this.props.language)}>{getFieldDecorator('code')(<AntdInput />)}</FormItem>
    );
    const secondFormItem = (
      <FormItem label={transferLanguage('MenuList.field.name', this.props.language)}>{getFieldDecorator('name')(<AntdInput />)}</FormItem>
    );
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      form,
      handleFormReset: this.handleFormReset,
      handleSearch: this.handleSearch,
      className: this.className,
      toggleForm: this.toggleForm,
    };

    const details = selectDetails[checkId] ? selectDetails[checkId] : {};

    const tableButtonsParams = {
      show: true,
      handleAdd: this.handleAdd,
      rightButtons:(
        <Button.Group>
          <Button
            onClick={() => this.setState({visibleFile:true})}
          >
            {transferLanguage('MenuList.field.import', this.props.language)}
          </Button>
        </Button.Group>
      ),
      buttons: (
        <Button.Group>
          <Button
            onClick={() => this.useVehicleType('disabled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('MenuList.field.disabled', this.props.language)}
          </Button>
          <Button
            onClick={() => this.useVehicleType('abled')}
            disabled={selectedRows.length > 0 ? false : true}
          >
            {transferLanguage('MenuList.field.enable', this.props.language)}
          </Button>
          <AdButton text={'同步菜单'} onClick={() => this.ableOperate('sync')}/>
        </Button.Group>
      ),
      selectedRows: selectedRows,
    };

    const rightDrawParams = {
      isMobile,
      visible,
      title: transferLanguage('MenuList.field.MenuInfo', this.props.language),
      closeDetail: this.closeDetail,
      buttons: (
        <span>
          <Button.Group>
            {!details.beActive && (
              <Button onClick={() => this.useVehicleType('abled', 1)}>{transferLanguage('MenuList.field.enable', this.props.language)}</Button>
            )}
            {details.beActive && (
              <Button onClick={() => this.useVehicleType('disabled', 1)}>{transferLanguage('MenuList.field.disabled', this.props.language)}</Button>
            )}
            <Button type="primary" onClick={this.handleEdit}>
              {transferLanguage('MenuList.field.edit', this.props.language)}
            </Button>
          </Button.Group>
        </span>
      ),
    };
    return (
      <Fragment>
        <FileImport
					visibleFile={visibleFile}
					handleCancel={() => {
						this.handleImportFile();
					}}
					urlImport={`mds-menu/importMenu`}
					urlCase={`template/download?fileName=importMenu.xlsx`}
					queryData={[this.getTableTreeList]}
					accept=".xls,.xlsx"
				/>
        <SelectForm {...selectFormParams} />
        <TableButtons {...tableButtonsParams} />
        <StandardTable
          selectedRows={selectedRows}
          loading={loading}
          // data={{selectList}}
          defaultExpandedRowKeys={globalListData.length === 1 ? [globalListData[0].id] : []}
          data={{ list: globalListData }}
          columns={this.columns}
          // scrollX={1800}
          onSelectRow={this.handleSelectRows}
          onPaginationChange={this.handleStandardTableChange}
          onExpandRow={this.onExpandRow}
          code={codes.page}
          expandForm={expandForm}
          className={this.className}
        />
        <RightDraw {...rightDrawParams}>
          <MenuDetails detailId={id} isMobile={isMobile} />
        </RightDraw>
      </Fragment>
    );
  }
}
