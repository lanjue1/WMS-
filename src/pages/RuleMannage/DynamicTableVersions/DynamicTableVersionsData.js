import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input } from 'antd';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import AntdForm from '@/components/AntdForm';
import FileImport from '@/components/FileImport';
import AntdInput from '@/components/AntdInput';
import TableButtons from '@/components/TableButtons';
import DynamicTableDataInfo from './DynamicTableDataInfo';
import { queryDict, getQueryString } from '@/utils/common';
import prompt from '@/components/Prompt';
import TableVersionsFiledsModal from './TableVersionsFiledsModal'
import {
  allDispatchType,
  codes,
  trailNodeStatus,
  trailType,
  statusAndType,
  formatStatusAndType,
} from './utils';
import styles from './dynamicTableVersions.less';

const { confirm } = Modal;
const dateFormat = 'YYYY-MM-DD HH:mm';

@ManageList
@connect(({ dynamicTableVersions, loading, component }) => ({
  dynamicTableVersions,
  dy_dataList: dynamicTableVersions.dy_dataList,
  dy_queryItem: dynamicTableVersions.dy_queryItem,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class DynamicTableData extends Component {
  constructor(props) {
    super(props);
    const {
      form: { getFieldDecorator },
      match: { params },
    } = props;
    this.commonParams = {
      getFieldDecorator,
    };
    this.state = {
      selectedRows: [],
      disabled: false,
      visibleFile: false,
      existOrders: false,
      //   tableName: params.name,
      tableName: '',
      visible: false,
      ruleTableVersionId: '',
      ediDetails: {}
    };
  }
  className = 'dynamicTableData-table';

  componentDidMount() {
    const tableName = this.props.location.query.tableName;
    const ruleTableVersionId = getQueryString('ruleTableVersionId');
    this.setState({
      ruleTableVersionId,
      tableName
    });
  }
  getSnapshotBeforeUpdate(prevProps, prevState) {
    const tableName = this.props.location.query.tableName;
    if (tableName && tableName !== prevState.tableName) {
      this.setState({
        tableName,
      });
    }
  }
  onRef = ref => {
    this.child = ref;
  };
  //新增
  handleAdd = () => {
    this.setState({ visible: true })
  };
  //移除
  removeInfo = e => {
    e.stopPropagation();
    confirm({
      title: '确定要移除数据吗？',
      content: ' ',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const { tableName, selectedRows, ruleTableVersionId } = this.state;
        const { dy_dataList } = this.props;
        const list = dy_dataList[tableName].list;
        if (selectedRows.length == list.length) {
          prompt({
            content: '不能全部删除，至少保留一条数据',
            type: 'warn',
          });
          return;
        }
        const deleteIds = selectedRows.map(v => v.id);
        const { dispatch } = this.props;
        dispatch({
          type: 'dynamicTableVersions/delTableData',
          payload: { ruleTableVersionId, ids: deleteIds },
          callback: () => {
            this.child.getDataList();
          }
        });
        // const newData = dy_dataList[tableName].list.filter(item => !deleteIds.includes(item.id));
        // this.saveAllValue({ dy_dataList: { [tableName]: { list: newData } } });
        // this.handleStateChange([{ selectedRows: [], showTips: true }]);
      },
    });
  };

  getInfoData = () => {
    const { dy_dataList } = this.props;
    const { tableName } = this.state;
    let newData = [];
    if (dy_dataList[tableName]) {
      const data = dy_dataList[tableName].list;
      newData = data.map(item => ({ ...item }));
    }
    return newData;
  };

  getRowByKey(id, newData) {
    const data = this.getInfoData();
    return (newData || data).filter(item => item.id === id)[0];
  }

  saveAllValue = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.value,
      payload: payload || {},
    });
  };

  handleStateChange = (options = []) => {
    options.map(item => {
      this.setState(item);
    });
  };
  /* 表格表单数据处理---end---*/

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    // const {} = formValues;
    this.child.getDataList({ queryMap: formValues });
  };

  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    // this.getDataList(param);
  };

  exportTableVersions = () => {
    const { selectedRows } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'dynamicTableVersions/exportTableVersions',
      payload: { id: this.state.ruleTableVersionId },
      callback: () => this.child.getDataList()
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
          payload: { id: this.state.ruleTableVersionId },
          callback: () => this.child.getDataList()
        })
      }
    })
  }

  //保存：
  saveData = () => {
    const { form, dy_dataList, dispatch } = this.props;
    const { tableName } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;

      const params = {
        dataList: dy_dataList[tableName].list,
        tableName,
      };

      dispatch({
        type: allDispatchType.osDyData,
        payload: params,
      });
    });
  };

  showEdit = (ediDetails, visible) => {
    this.setState({
      ediDetails,
      visible
    })
  }

  handleImportFile = () => {
    this.setState({
      visibleFile: false
    })
  }

  render() {
    const { form, loading, dy_queryItem } = this.props;
    const { selectedRows, visibleFile, visible, existOrders, ediDetails } = this.state;
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const { tableName, ruleTableVersionId } = this.state;

    let firstFormItem;
    let secondFormItem;
    let otherFormItem;
    const queryItem = dy_queryItem[tableName];
    if (queryItem) {
      if (queryItem[0]) {
        firstFormItem = (
          <AntdFormItem label={queryItem[0]} code={queryItem[0]} {...commonParams}>
            <Input />
          </AntdFormItem>
        );
      }
      if (queryItem[1]) {
        secondFormItem = (
          <AntdFormItem label={queryItem[1]} code={queryItem[1]} {...commonParams}>
            <Input />
          </AntdFormItem>
        );
      }
    }
    const selectFormParams = {
      firstFormItem,
      secondFormItem,
      otherFormItem,
      form,
      className: this.className,
      handleFormReset: null,
      handleSearch: this.handleSearch,
      toggleForm: expandForm => {
        this.handleStateChange([{ expandForm }]);
      },
      // code: codes.select,
    };
    const modalParams = {
      visible: visible,
      modalEmpty: () => { this.child.getDataList(); this.setState({ visible: false, ediDetails: {} }); },
      tableName: tableName,
      ruleTableVersionId: ruleTableVersionId
    }

    const tableButtonsParams = {
      handleAdd: this.handleAdd,
      // code: codes.add,
      buttons: (
        <Button.Group style={{ marginLeft: 8 }}>
          <AdButton
            onClick={e => {
              this.removeInfo(e);
            }}
            ghost
            disabled={selectedRows.length === 0}
            text="移除"
            type="danger"
          // code={codes.remove}
          />
          <AdButton
            onClick={() => this.setState({ visibleFile: true })}
            text="导入"
          />
          <AdButton
            onClick={() => this.exportTableVersions()}
            text="导出"
          />
          <AdButton
            onClick={() => this.emptyTableData()}
            text="清空表数据"
          />
        </Button.Group>
      ),
    };

    return (
      <div className="cus-ant-trail-page">
        <FileImport
          visibleFile={visibleFile}
          handleCancel={() => {
            this.handleImportFile();
          }}
          urlImport={`rule-table-version/importRuleTableVersion`}
          urlCase={`rule-table-version/exportRuleTableVersion?id=${this.state.ruleTableVersionId}`}
          queryData={[() => this.child.getDataList()]}
          importPayload={{ id: this.state.ruleTableVersionId }}
          accept=".xls,.xlsx"
        />
        {queryItem && queryItem.length > 0 && <SelectForm {...selectFormParams} />}
        <TableButtons {...tableButtonsParams} />
        <DynamicTableDataInfo
          showEdit={this.showEdit}
          tableName={tableName}
          ruleTableVersionId={ruleTableVersionId}
          onRef={this.onRef}
          //   checkOrder={existOrders => this.handleStateChange([existOrders])}
          selectedRows={selectedRows}
          onSelectRow={selectedRows => this.handleStateChange([{ selectedRows }])}
        />
        { visible && <TableVersionsFiledsModal ediDetails={ediDetails} {...modalParams} />}
      </div>
    );
  }
}
