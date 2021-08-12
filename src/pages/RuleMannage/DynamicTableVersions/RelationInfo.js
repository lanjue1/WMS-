import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';
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
import {
  selectArchivesDetailAndInfo,
  allDispatchType,
  renderTableAdSelect,
  codes,
  filedTypeList,
  beEmptyList,
} from './utils';
import styles from '../../subTable.less';

const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;

@connect(({ dynamicTableVersions, component, loading }) => ({
  dictObject: component.dictObject,
  fieldList: dynamicTableVersions.fieldList,
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
    };
    this.commonParams = {
      getFieldDecorator,
    };
  }

  columns = [
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
        return <span>{text}</span>;
      },
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
                disabled={disabled}
                isExist={true}
                data={beEmptyList}
                onChange={value => this.handleFieldChange(value, 'beEmpty', record.id)}
              />
            </AntdFormItem>
          );
        }
        return renderTableAdSelect({
          props: this.props,
          value: text,
          data: beEmptyList,
        });
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

  //   componentWillReceiveProps(nextProps, nextState) {
  //     const { curId, fieldList } = nextProps;
  //     const id = curId;
  //     const { detailId } = nextState;
  //     if (
  //       !id &&
  //       !this.state.detailId &&
  //       (!detailId || (detailId && detailId === '')) &&
  //       !fieldList[this.state.detailId]
  //     ) {
  //       this.saveAllValue({
  //         fieldList: { [this.state.detailId]: { list: [this.getAddDataObj()] } },
  //       });
  //     }
  //     if (this.props.curId !== id) {
  //       this.handleStateChange([{ detailId: id }]);
  //       this.fieldList(id);
  //     }
  //   }

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
      newData = data.map(item => ({ ...item }));
    }
    return newData;
  };

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
    }
    // console.log('newData', newData);

    this.saveAllValue({ fieldList: { [curId]: { list: newData } } });
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
