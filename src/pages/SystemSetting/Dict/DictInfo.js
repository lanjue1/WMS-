import React, { Component, Fragment } from 'react';
import StandardTable from '@/components/StandardTable';
import { Icon, Form, Input, Modal, Select, Row, Col, Upload, DatePicker } from 'antd';
import { connect } from 'dva';
import styles from '@/pages/Info.less';
import moment from 'moment';
import SearchSelect from '@/components/SearchSelect';
import { formatFile, getNowFormatDate } from '@/pages/Common/common';
import prompt from '@/components/Prompt';
import { transferLanguage } from '@/utils/utils';


const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

@connect(({ Dict, loading, common }) => ({
  Dict,
  loading: loading.models.Dict,
  dictObject: common.dictObject,
}))
@Form.create()
export default class DictInfo extends Component {
  state = {
    selectedRows: [],
    dictDataId: '',
  };
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }
  componentWillReceiveProps(nextProps) {}

  columns = [
    {
      title: transferLanguage('dictList.field.code', this.props.language),
      dataIndex: 'code',
      width: 150,
      render: (text, record) =>
        this.props.type === 'list' && !this.props.disabled ? (
          <a onClick={() => this.showDetail(record)}>{text}</a>
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: transferLanguage('dictList.field.value', this.props.language),
      dataIndex: 'value',
    },
    {
      title: transferLanguage('dictList.field.sort', this.props.language),
      dataIndex: 'sort',
    },
    {
      title: transferLanguage('dictList.field.beActive', this.props.language),
      dataIndex: 'beActive',
      render: (text, record) => <span>{text ? '启用' : '禁用'}</span>,
    },
    {
      title: transferLanguage('dictList.field.remark', this.props.language),
      dataIndex: 'remarks',
    },
    {
      title: transferLanguage('dictList.field.updateTime', this.props.language),
      dataIndex: 'updateTime',
      width: 150,
    },
    {
      title: transferLanguage('dictList.field.updateBy', this.props.language),
      dataIndex: 'updateBy',
    },
  ];

  showDetail = record => {
    const { id } = record;
    const { dispatch, operateInfo } = this.props;
    dispatch({
      type: 'Dict/dictDataDetails',
      payload: { id },
      callback: res => {
        operateInfo('', 'edit');
        this.setState({
          dictDataId: id,
        });
      },
    });
  };

  // 新增或编辑操作
  handleOk = () => {
    const { form, dispatch, id, handleCancel } = this.props;
    const { dictDataId } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.dictId = id;
      if (dictDataId) {
        values.id = dictDataId;
      }
      dispatch({
        type: 'Dict/dictDataOperate',
        payload: values,
        callback: res => {
          this.getDictDataList({dictId: id });
          this.handleCancel();
        },
      });
    });
  };

  handleSelectRows = rows => {
    const { getSelectedRows } = this.props;
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
    getSelectedRows(rows);
  };
  //是自定义搜索
  onFocus = () => {
    // this._input.blur();
  };
  onCancel = values => {
    this.setState({ auths: values });
  };
  getValue = values => {
    const { auths } = this.state;
    this.setState({
      auths: values,
    });
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    handleCancel();
    this.setState({
      auths: [],
      fileList: [],
      dictDataId: '',
    });
  };
  getDictDataList = params => {
    const { dispatch } = this.props;
    params.pageSize = 500;
    dispatch({
      type: 'Dict/dictDataList',
      payload: params,
    });
  };

  //启用、禁用：
  abledStatus = (type, isSingle) => {
    const { dispatch, id } = this.props;
    const { checkIds, checkId, formValues } = this.state;
    let params = {};
    params.ids = isSingle ? [checkId] : checkIds;
    params.type = type == 'abled' ? true : false;
    dispatch({
      type: 'Dict/ableDictDataOperate',
      payload: params,
      callback: res => {
        this.getDictDataList({dictId: id });

        // if (isSingle) {
        //   this.props.dispatch({
        //     type: 'Dict/dictDetails',
        //     payload: { id: checkId },
        //     callback: res => {
        //       this.setState({
        //         isAbled: res.beActive == true || res.beActive == '启用' ? true : false,
        //       });
        //     },
        //   });
        // }
      },
    });
  };
  // 明细翻页
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    // const { searchValue } = this.state;
    const params = {
      // ...searchValue,
      ...param,
    };
    // this.dispatchFun('abnormal/userList', params);
  };

  render() {
    const {
      loading,
      // data,
      change,
      visible,
      handleCancel,
      form: { getFieldDecorator },
      id,
      type,
      listType,
      Dict: { dictDataDetails, dictDataList },
      dictObject,
      columns1,
      infoType,
      curStateVal,
      disabled,
    } = this.props;
    const { selectedRows, dictDataId } = this.state;
    const infoDetail = dictDataId && infoType == 'edit' ? dictDataDetails[dictDataId] : {};
    const data = id ? dictDataList : { list: [] };
    return (
      <Fragment>
        <StandardTable
          loading={loading}
          data={data}
          disabledRowSelected={curStateVal}
          scrollX={800}
          scrollY={350}
          expandForm={false}
          columns={this.columns}
          onPaginationChange={this.handleStandardTableChange}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          disabledRowSelected={disabled || type !== 'list'}
        />
        {visible && (
          <Modal
            title={infoType == 'edit' ? transferLanguage('dictList.field.editDictionaryData', this.props.language) : transferLanguage('dictList.field.addDictionaryData', this.props.language)}
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={620}
            style={{ top: 20 }}
            destroyOnClose={true}
          >
            <div className={styles.tableListForm}>
              <Form layout="inline">
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label={transferLanguage('dictList.field.code', this.props.language)}>
                      {getFieldDecorator('code', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: infoDetail ? infoDetail.code : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label={transferLanguage('dictList.field.value', this.props.language)}>
                      {getFieldDecorator('value', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: infoDetail ? infoDetail.value : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 12 }} sm={24}>
                    <Form.Item label={transferLanguage('dictList.field.sort', this.props.language)}>
                      {getFieldDecorator('sort', {
                        initialValue: infoDetail ? infoDetail.sort : '',
                      })(<Input />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
                  <Col md={{ span: 24 }} sm={24}>
                    <Form.Item label={transferLanguage('dictList.field.remark', this.props.language)}>
                      {getFieldDecorator('remarks', {
                        initialValue: infoDetail.remarks || '',
                      })(<TextArea  rows={2} />)}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </Modal>
        )}
      </Fragment>
    );
  }
}
