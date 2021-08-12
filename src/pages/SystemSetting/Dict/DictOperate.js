import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Collapse,
  DatePicker,
  PageHeader,
} from 'antd';
import prompt from '@/components/Prompt';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import { columns1 } from '@/pages/Common/common';
import AdButton from '@/components/AdButton';
import styles from '@/pages/Operate.less';
import DictInfo from './DictInfo';
import { transferLanguage } from '@/utils/utils';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
@connect(({ Dict, common, loading }) => ({
  Dict,
  ownCompany: common.ownCompany,
  dictObject: common.dictObject,
  id: Dict.id,
  loading: loading.models.Dict,
}))
@Form.create()
export default class ETCOperate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      currentId: '',
      selectedRows: [],
      visible: false,
      activeKey: ['1', '2'],
      showRecord: true, //init:false
      infoType: '',
      disabled: false,
    };
  }
  componentDidMount() {
    const { match, form, dispatch } = this.props;
    const ID = match && match.params ? match.params.id : '';
    this.setState({
      currentId: ID,
      showRecord: true,
    });
    if (ID) {
      this.getSelectDetails(ID);
      this.getDictDataList(ID);
    } else {
      form.resetFields();
    }
  }
  componentWillReceiveProps(nextProps) {}
  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'Dict/dictDetails',
      payload: { id: ID },
      callback: data => {},
    });
  };
  //字典数据：
  getDictDataList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'Dict/dictDataList',
      payload: {dictId: id, pageSize: 500 },
    });
  };

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  operatePaneButton = e => {
    e.stopPropagation();
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { ...value } = values;
        const {
          match: { params },
          dispatch,
        } = this.props;
        if (params.id) {
          value.id = params.id;
          dispatch({
            type: 'Dict/DictOperate',
            payload: value,
            callback: () => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.dispatchFun('Dict/DictList', {});
            },
          });
        } else {
          dispatch({
            type: 'Dict/DictOperate',
            payload: value,
            callback: res => {
              if (!res) return;
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
              this.setState({ showRecord: true });
              dispatch({
                type: 'Dict/dictDetails',
                payload: { id: res },
                callback: data => {
                  //新增变编辑页面：
                  dispatch({
                    type: 'common/setTabsName',
                    payload: {
                      id: res,
                      name: data.dictType,
                      isReplaceTab: true,
                    },
                    callback: result => {
                      if (result) {
                        router.push(`/system/dictList/dictEdit/${res}`);
                      }
                    },
                  });
                },
              });
              this.dispatchFun('Dict/DictList', {});
            },
          });
        }
      }
    });
  };
  // dispatch 方法
  dispatchFun(type, params) {
    const { dispatch } = this.props;
    dispatch({
      type: type,
      payload: params,
    });
  }
  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  // 明细关闭详情
  abnormalInfoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };

  abledStatus = (e, type) => {
    e.stopPropagation();
    this.child.abledStatus(type);
  };
  //新增字典数据列表：
  operateInfo = (e, type) => {
    e && e.stopPropagation();
    const {
      match: { params },
    } = this.props;
    if (!params.id) {
      prompt({ content: '请先新增字典，再新增字典数据', type: 'warn' });
      return;
    }
    this.setState({
      visible: true,
      infoType: type,
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

  onRef = ref => {
    this.child = ref;
  };

  render() {
    const {
      selectedRowKeys,
      selectedRows,
      visible,
      previewImage,
      fileList,
      papersDetails,
      ownCompany,
      cars,
      showRecord,
      infoType,
      disabled,
    } = this.state;
    const {
      Dict: { dictDetails, dictDataList },
      form: { getFieldDecorator },
      dictObject,
      match: { params },
      showType,
      loading,
    } = this.props;

    const currentId = params.id;
    let selectDetails = dictDetails[currentId];

    const checkDisabled = selectDetails ? true : false;

    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{selectDetails && currentId ? selectDetails.dictType : transferLanguage('dictList.field.addDictionaryData', this.props.language)}</span>

        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('dictList.field.edit', this.props.language)}
          />
        ) : (
          <Button.Group>
            <Button type="primary" onClick={e => this.operatePaneButton(e)}>
            {transferLanguage('dictList.field.save', this.props.language)}
            </Button>
            {currentId && (
              <AdButton
                onClick={() => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                }}
                text={transferLanguage('dictList.field.cancel', this.props.language)}
              />
            )}
          </Button.Group>
        )}
      </div>
    );
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };
    const abnormalInfoParams = {
      id: currentId,
      type: 'list',
      loading,
      showDetail: this.showDetail,
      handleCancel: this.abnormalInfoHandleCancel,
      getSelectedRows: this.handleSelectRows,
      onRef: this.onRef,
      operateInfo: this.operateInfo,
      disabled: disabled,
      visible,
      // data: dictDataList,
      scrollX: 1000,
      infoType,
    };

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('dictList.field.dictionaryInfo', this.props.language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('dictList.field.dictionaryType', this.props.language)}>
                        {getFieldDecorator('dictType', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.dictType : '',
                        })(<Input  disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('dictList.field.remark', this.props.language)}>
                        {getFieldDecorator('remarks', {
                          initialValue: selectDetails ? selectDetails.remarks : '',
                        })(<TextArea  rows={4} disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>
            {showRecord && (
              <Panel
                key="2"
                header={transferLanguage('dictList.field.dataDictionaryInfo', this.props.language)}
                className={styles.customPanelStyle}
                extra={
                  <Button.Group>
                    <Button
                      disabled={disabled || selectedRows.length === 0}
                      onClick={e => this.abledStatus(e, 'disabled')}
                    >
                      {transferLanguage('dictList.field.disabled', this.props.language)}
                    </Button>
                    <Button
                      disabled={disabled || selectedRows.length === 0}
                      onClick={e => this.abledStatus(e, 'abled')}
                    >
                      {transferLanguage('dictList.field.enable', this.props.language)}
                    </Button>
                    <Button
                      type="primary"
                      disabled={disabled}
                      onClick={e => this.operateInfo(e, 'type')}
                    >
                      {transferLanguage('dictList.field.add', this.props.language)}
                    </Button>
                  </Button.Group>
                }
              >
                <DictInfo {...abnormalInfoParams} />
              </Panel>
            )}
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
