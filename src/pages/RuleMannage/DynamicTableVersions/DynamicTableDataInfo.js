import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Modal, Input, Select } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import SelectForm from '@/components/SelectForm';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import AntdForm from '@/components/AntdForm';
import FileImport from '@/components/FileImport';
import AntdInput from '@/components/AntdInput';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import { queryDict, getQueryString, filterAddFile, filterDeteteFile } from '@/utils/common';
import prompt from '@/components/Prompt';
import { allDispatchType, codes } from './utils';
import styles from './dynamicTableVersions.less';

const { confirm } = Modal;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm';
const dateFormatS = 'YYYY-MM-DD HH:mm:ss';

@ManageList
@connect(({ dynamicTableVersions, loading, component }) => ({
  dynamicTableVersions,
  dy_dataList: dynamicTableVersions.dy_dataList,
  dy_fieldList: dynamicTableVersions.dy_fieldList,
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
}))
@Form.create()
export default class DynamicTableDataInfo extends Component {
  constructor(props) {
    super(props);
    const {
      form: { getFieldDecorator },
    } = props;
    this.commonParams = {
      getFieldDecorator,
    };
    this.state = {
      selectedRows: [],
      disabled: false,
      typeList: [],
      dy_columns: [],
      dy_dataList: { list: [] },
      modalVisible: false,
      editId: ''
    };
  }
  className = 'dynamicTDataInfo-table';

  componentDidMount() {
    const { tableName, onRef, dy_fieldList } = this.props;
    onRef && onRef(this);
    if (!tableName) return;
    this.getDataList();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const tableName = getQueryString('tableName');
    if (tableName && tableName !== prevState.tableName) {
      this.setState({
        tableName,
      });
      this.getDataList();
    }
  }

  getDataList = (params = {}) => {
    const { dispatch, tableName, ruleTableVersionId } = this.props;
    console.log('tableName', tableName, this.state.tableName)
    dispatch({
      type: allDispatchType.dataTable,
      payload: { tableName, ruleTableVersionId, ...params },
      callback: res => {
        const dy_columns = this.setColumns(res.fieldList || []);
        this.setState(
          {
            dy_columns,
          },
          () => {
            //要先设置表头，再设置表内容，否则数据渲染不出来
            this.saveAllValue({
              dy_dataList: {
                [tableName]: res.dataPage || {},
              },
            });
          }
        );
      },
    });
  };

  getAddDataObj = () => {
    const { dy_fieldList, tableName } = this.props;
    let obj = {};
    if (dy_fieldList[tableName]) {
      dy_fieldList[tableName].map(v => {
        obj[v] = '';
      });
    }
    return {
      id: `isNew${Math.ceil(Math.random() * 10000) + 10000}`,
      ...obj,
    };
  };
  //新增
  handleAdd = () => {
    const { tableName } = this.props;
    let newData = this.getInfoData();
    newData = [this.getAddDataObj(), ...newData];
    this.saveAllValue({ dy_dataList: { [tableName]: { list: newData } } });
  };

  getInfoData = () => {
    const { dy_dataList, tableName } = this.props;
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

  handleFieldChange(value, fieldName, id, fieldName2) {
    const { tableName, eventList } = this.state;
    const { dispatch, showTipsFun, form } = this.props;
    showTipsFun(true);
    const newData = this.getInfoData();
    const target = this.getRowByKey(id, newData);
    if (target) {
      target[fieldName] = value;
    }
    if (fieldName === 'eventTime') {
      if (value) {
        target.eventTime = moment(value).format(dateFormatS);
      }
    } else if (fieldName === 'fileTokens') {
      target.fileTokens = filterAddFile(value) || [];
      target.delIds = filterDeteteFile(value, target.fileList || []) || []; //测试
    }
    //状态-->类型（联动）
    if (fieldName == 'type') {
      target.statusList = eventList[value];
      form.setFieldsValue({ [`${fieldName2}-${target.id}`]: null });
      target[fieldName2] = '';
      target.eventCode = '';
    }
    if (fieldName == 'status') {
      target.statusList.map(v => {
        if (v.status == value) {
          target.eventCode = v.code;
        }
      });
      target.eventDesc = value;
      form.setFieldsValue({ [`eventDesc-${target.id}`]: value });
    }

    this.saveAllValue({ dy_dataList: { [tableName]: { list: newData } } });
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
 * table 表格 分页操作
 */
  handleStandardTableChange = param => {
    this.getDataList(param);
  };

  //保存：
  saveData = () => {
    const { form, dy_dataList, dispatch, showTipsFun } = this.props;
    const { tableName } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      let params = dy_dataList[tableName].list;
      if (params && params.length > 0) {
        params = params.map(item => {
          const { fileList, trackFiles, statusList, ...restd } = item;
          if (item.id.includes('isNew')) {
            const { id, ...rest } = restd;
            return rest;
          }
          return restd;
        });
      }
      const payloads = {
        dataList: params,
        tableName,
      };
      dispatch({
        type: allDispatchType.osDyData,
        payload: payloads,
        callback: data => {
          // if (!data) return;
          this.getDataList();
          showTipsFun(false);
        },
      });
    });
  };
  setColumns = data => {
    data.unshift({ fieldName: '#' })
    const newcolumns = data.map((field, index) => {
      let colum = {
        title: field.fieldAliasName ? field.fieldAliasName : field.fieldName,
        dataIndex: field.fieldName,
        width: 130,
      };
      if (index === 0) {
        colum.render = (text, record, i) => (<a href='#' onClick={() => this.props.showEdit(record, true)} >{i + 1}</a>)
      }
      return colum
    });
    return newcolumns;
  };

  render() {
    const {
      form,
      loading,
      dy_dataList,
      dy_fieldList,
      tableName,
      onSelectRow,
      selectedRows,
    } = this.props;
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const { dy_columns } = this.state;
    return (  
      <Fragment>
        <div className={styles.customPartsOfferInfo}>
          <AntdForm>
            <StandardTable
              loading={loading}
              columns={dy_columns}
              data={dy_dataList[tableName] || {}}
              selectedRows={selectedRows}
              onPaginationChange={this.handleStandardTableChange}
              className={this.className}
              // code="page"
              mode="detail"
              expandForm={false}
              //   scrollX={1000}
              canInput={true}
              bottomBtnHeight={32}
              onSelectRow={selectedRows => {
                onSelectRow(selectedRows);
              }}
            />
          </AntdForm>
        </div>
      </Fragment>
    );
  }
}
