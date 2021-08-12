import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import { withRouter } from 'umi';
import moment, { isDate } from 'moment';
import prompt from '@/components/Prompt';
import StandardTable from '@/components/StandardTable';
import AntdInput from '@/components/AntdInput';
import AdSelect from '@/components/AdSelect';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AntdDatePicker from '@/components/AntdDatePicker';
import FileReader from '@/components/FileReader';
import AntdSelectRegion from '@/components/AntdSelectRegion';
import SearchSelect from '@/components/SearchSelect';
import { allDictList } from '@/utils/constans';
import { queryDict, filterAddFile, filterDeteteFile, formatPrice } from '@/utils/common';
import { columnsDriver } from '@/pages/Common/common';
import { VerticalAlignTopOutlined, VerticalAlignBottomOutlined } from "@ant-design/icons";
import {
  selectArchivesDetailAndInfo,
  allDispatchType,
  renderTableAdSelect,
  codes,
  filedTypeList,
  beEmptyList,
  dataTypeList
} from './utils';
import styles from '../../subTable.less';

const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;

@connect(({ dynamicTable, component, loading }) => ({
  dictObject: component.dictObject,
  fieldList: dynamicTable.fieldList,
  loading: loading.effects[allDispatchType.incidentalInfo],
}))
@Form.create()
@withRouter
export default class RelationInfo extends Component {
  constructor(props) {
    super(props);
    const {
      form: { getFieldDecorator },
    } = props;
    this.state = {
      detailId: '',
      preData: {},
      trainPlace: props.isHK ? allDictList.pressure_placeHK : allDictList.archives_place,
      beEmptyDisable: false
    };
    this.commonParams = {
      getFieldDecorator,
    };
  }

  columns = [
    {
      title: '操作',
      dataIndex: 'operation',
      width: 130,
      render: (text, record) => {
        const { dictObject, onlyRead, disabled, fieldSort } = this.props;
        return (<div>
          <VerticalAlignTopOutlined style={disabled ? { fontSize: '20px', marginRight: '10px' } : { color: '#1890ff', fontSize: '20px', marginRight: '10px' }} onClick={() => { disabled ? '' : fieldSort({ id: record.id, type: 'moveUp' }) }} />
          <VerticalAlignBottomOutlined style={disabled ? { fontSize: '20px' } : { color: '#1890ff', fontSize: '20px' }} onClick={() => { disabled ? '' : fieldSort({ id: record.id, type: 'moveDown' }) }} /></div>)
      },
    },
    {
      title: '字段名',
      dataIndex: 'fieldName',
      width: 140,
      render: (text, record) => {
        const { dictObject, onlyRead, disabled } = this.props;
        if (!onlyRead) {
          return (
            <AntdFormItem
              label=" "
              code={`fieldName-${record.id}`}
              initialValue={text}
              {...this.commonParams}
              rules={[{ required: true }]}
            >
              <AntdInput
                disabled={disabled}
                onChange={value => this.handleFieldChange(value, 'fieldName', record.id)}
                placeholder=""
              />
            </AntdFormItem>
          );
        }
        return <span style={{ color: '#1890ff' }} onClick={() => this.props.showModal(record)} >{text}</span>;
      },
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      width: 100,
      render: (text) => {
        return (<AdSelect
          value={text}
          onlyRead={true}
          data={dataTypeList} />)
      }
    },
    {
      title: '字段类型',
      dataIndex: 'filedType',
      width: 130,
      render: (text, record) => {
        const { dictObject, onlyRead, disabled } = this.props;
        if (!onlyRead) {
          return (
            <AntdFormItem
              label=" "
              code={`filedType-${record.id}`}
              initialValue={text}
              {...this.commonParams}
              rules={[{ required: true }]}
            >
              <AdSelect
                disabled={disabled}
                isExist={true}
                data={filedTypeList}
                onChange={value => this.handleFieldChange(value, 'filedType', record.id)}
              />
            </AntdFormItem>
          );
        }
        return renderTableAdSelect({
          props: this.props,
          value: text,
          data: filedTypeList,
        });
      },
    },
    {
      title: '是否允许为空',
      dataIndex: 'beEmpty',
      width: 130,
      render: (text, record) => {
        const { dictObject, onlyRead, disabled } = this.props;
        if (!onlyRead) {
          return (
            <AntdFormItem
              label=" "
              code={`beEmpty-${record.id}`}
              initialValue={text}
              {...this.commonParams}
              rules={[{ required: true }]}
            >
              <AdSelect
                disabled={!disabled ? this.state.beEmptyDisable : disabled}
                isExist={true}
                data={beEmptyList}
                onChange={value => this.handleFieldChange(value, 'beEmpty', record.id)}
              />
            </AntdFormItem>
          );
        }
        return text ? 'Y' : 'N'
      },
    },
    {
      title: '列顺序',
      dataIndex: 'columnSort',
      width: 140,
      render: (text, record) => {
        const { dictObject, onlyRead, disabled } = this.props;
        if (!onlyRead) {
          return (
            <AntdFormItem
              label=" "
              code={`columnSort-${record.id}`}
              initialValue={text}
              {...this.commonParams}
            >
              <AntdInput
                disabled={disabled}
                onChange={value => this.handleFieldChange(value, 'columnSort', record.id)}
                placeholder=""
              />
            </AntdFormItem>
          );
        }
        return <span>{text}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      width: 140,
      render: (text, record) => {
        const { dictObject, onlyRead, disabled } = this.props;
        if (!onlyRead) {
          return (
            <AntdFormItem
              label=" "
              code={`remarks-${record.id}`}
              initialValue={text}
              {...this.commonParams}
            >
              <TextArea
                onChange={value => this.handleFieldChange(value, 'remarks', record.id)}
                disabled={disabled}
                rows={1}
              />
            </AntdFormItem>
          );
        }
        return <span>{text}</span>;
      },
    },
  ];

  componentWillMount() {
    const { dispatch, curId, isHK } = this.props;

    this.saveAllValue({ fieldList: { [curId]: { list: [] } } });
    const allDict = [this.state.trainPlace];
    queryDict({ props: this.props, allDict });
  }

  componentDidMount() {
    const { curId, fieldList, onRef } = this.props;

    const id = curId;
    onRef && onRef(this);
    if (!id) return;
    this.handleStateChange([{ detailId: id }]);
    const detail = fieldList[id];
    // if (detail) return;
    // this.fieldList(id);
  }

  fieldList = (id, payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.fieldList,
      payload: { id, ...payload },
    });
  };

  getAddDataObj = () => {
    return {
      id: `isNew${Math.ceil(Math.random() * 10000) + 10000}`,
      filedType: '',
      fieldName: '',
      columnSort: '',
      beEmpty: '',
      remarks: '',
    };
  };

  addInfoPre = () => {
    const { curId } = this.props;
    let newData = this.getInfoData();

    newData = [this.getAddDataObj(), ...newData];
    this.saveAllValue({ fieldList: { [curId]: { list: newData } } });
  };

  getInfoData = () => {
    const { fieldList, curId } = this.props;
    // const { curId } = this.state;
    let newData = [];
    if (fieldList[curId]) {
      const data = fieldList[curId].list;
      // newData = data.map(item => ({ ...item }));
      newData = [].concat(data);
    }
    return newData;
  };

  deepClone(obj = {}) {
    if (typeof obj !== 'object' || obj == null) {
      //obj是null 或者不是对象和数组直接返回
      return obj
    }
    //初始化返回结果
    let result;
    if (obj instanceof Array) {
      result = []
    } else {
      result = {}
    }
    for (let key in obj) {
      //判断不是原型的属性
      if (obj.hasOwnProperty(key)) {
        result[key] = deepClone(obj.key)
      }
    }
    return result;
  }

  getRowByKey(id, newData) {
    const data = this.getInfoData();
    return (newData || data).filter(item => item.id === id)[0];
  }

  handleFieldChange(value, fieldName, id) {
    // const { detailId } = this.state;
    const { curId } = this.props;
    const { dispatch, form, showTipsFun } = this.props;
    showTipsFun(true);
    const newData = this.getInfoData();
    const target = this.getRowByKey(id, newData);
    if (target) {
      target[fieldName] = value;
      if (fieldName === 'remarks') {
        target[fieldName] = value.target.value;
      }
      if (fieldName === 'filedType') {
        if (value === 'QUERY') {
          target['beEmpty'] = false;
        } else {
          this.setState({ beEmptyDisable: false })
        }
      }
    }

    this.saveAllValue({ fieldList: { [curId]: { list: newData } } });
    if (fieldName === 'filedType' && value === 'QUERY') {
      this.setState({ beEmptyDisable: true })
    }
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

  render() {
    const { fieldList, loading, onSelectRow, selectedRows, curId, disabled } = this.props;
    // const { detailId } = this.state;

    const data = fieldList[curId] || { list: [] };
    return (
      <div className={styles.customPartsOfferInfo}>
        <AntdForm>
          <StandardTable
            loading={loading}
            data={data}
            columns={this.columns}
            selectedRows={selectedRows}
            disabledRowSelected={disabled}
            pagination={false}
            scrollX={900}
            // scrollY={400}
            canInput={true}
            onSelectRow={selectedRows => {
              onSelectRow(selectedRows);
            }}
          />
        </AntdForm>
      </div>
    );
  }
}
