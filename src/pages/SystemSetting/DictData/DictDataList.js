import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Row, Form, Input, Select, Button, Tabs } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ManageList from '@/components/ManageList';
import { formateDateToMin } from '@/utils/common';
import DictInfo from './DictInfo';
import styles from './index.less';
import { transferLanguage } from '@/utils/utils';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

@ManageList
@connect(({ dictData, common, loading, i18n }) => ({
  dictData,
  ownCompany: common.ownCompany,
  loading: loading.effects['dictData/DictDataList'],
  dictObject: common.dictObject,
  language: i18n.language
}))
@Form.create()
export default class DictDataList extends Component {
  state = {
    expandForm: false,
    selectedRows: [],
    visible: false,
    checkId: '',
    checkIds: [],
    formValues: {},
    isAbled: '',
    dictID: '',
    dictData: [],
  };
  className = 'DictDataList';
  pageMax = false;
  currentPage = 1;
  pageSize = 20;
  isLoad = false;
  top = 0;

  componentDidMount() {
    this.getDictList();
    if (this.contentNode) {
      this.contentNode.addEventListener('scroll', this.onScrollHandle.bind(this));
    }
  }
  componentWillUnmount() {
    if (this.contentNode) {
      this.contentNode.removeEventListener('scroll', this.onScrollHandle.bind(this));
    }
  }

  onScrollHandle(event) {
    const clientHeight = event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const isBottom = scrollHeight === clientHeight + scrollTop;
    if (isBottom && !this.pageMax) {
      this.top = scrollTop;
      this.nextPageData();
    }
  }

  nextPageData = () => {
    const { dispatch } = this.props;
    const { dictData } = this.state;
    this.currentPage = this.currentPage + 1;
    const params = { currentPage: this.currentPage, pageSize: this.pageSize };
    const ele = document.querySelector('.tabBox');
    dispatch({
      type: 'dictData/DictListOfData',
      payload: params,
      callback: data => {
        if (!data) return;
        if (data.length < this.pageSize) {
          this.pageMax = true;
        }
        this.setState({ dictData: [...dictData, ...data] }, () => {
          ele.scrollTop = this.top;
        });
      },
    });
  };

  onRef = ref => {
    this.child = ref;
  };
  //字典
  getDictList = (params = {}) => {
    const { dispatch } = this.props;
    params.pageSize = 20;
    dispatch({
      type: 'dictData/DictListOfData',
      payload: params,
      callback: res => {
        if (res.length > 0) {
          const dictID = res[0].id;
          this.setState({
            dictID,
            dictData: res,
          });
          this.getDictDataList(dictID);
        }
      },
    });
  };
  //字典数据：
  getDictDataList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictData/dictDataList',
      payload: {dictId: id, pageSize: 500 },
      callback: data => {
        this.child.getUserData(data);
      },
    });
  };

  //切换tabs:
  onChangeTabs = val => {
    this.setState({
      dictID: val,
    });
    this.getDictDataList(val);
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

  // 分页操作：改参数
  handleStandardTableChange = param => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const params = {
      ...formValues,
      ...param,
    };
    this.getDictList(params);
  };
  // 明细查看详情
  showDetail = () => {
    this.setState({ visible: true });
  };

  abledStatus = (e, type) => {
    e.stopPropagation();
    this.child.abledStatus(type);
  };
  //新增字典数据列表：
  operateInfo = e => {
    e && e.stopPropagation();
    this.setState({
      visible: true,
    });
  };
  // 明细关闭详情
  abnormalInfoHandleCancel = () => {
    this.setState({ visible: false, visiblePay: false });
  };

  render() {
    const {
      loading,
      dictData: { DictListOfData, dictDataList },
      form,
      isMobile,
      dictObject,
      ownCompany,
      language
    } = this.props;
    const { getFieldDecorator } = form;
    const { selectedRows, isAbled, checkId, visible, expandForm, dictID, dictData } = this.state;

    const infoParams = {
      id: dictID,
      type: 'list',
      loading,
      showDetail: this.showDetail,
      handleCancel: this.abnormalInfoHandleCancel,
      getSelectedRows: this.handleSelectRows,
      onRef: this.onRef,
      operateInfo: this.operateInfo,
      visible,
      dictID,
      getUserData: this.getUserData,
    };

    return (
      <Fragment>
        <Row gutter={24}>
          <div className={styles.parentBox}>
            <div className="dictData_list">
              <h3 className={styles.dictTitle}> {transferLanguage('dictData.field.name', this.props.language)}：</h3>
              <div className="tabBox" ref={node => (this.contentNode = node)}>
                <Tabs tabPosition="left" onChange={this.onChangeTabs}>
                  {dictData &&
                    dictData.length > 0 &&
                    dictData.map((v, i) => {
                      return (
                        <TabPane tab={v.remarks} key={v.id} title={v.remarks}>
                          <span />
                        </TabPane>
                      );
                    })}
                </Tabs>
              </div>
            </div>

            <div className={styles.changeBox}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                <Button.Group>
                  <Button
                    onClick={e => this.abledStatus(e, 'disabled')}
                    disabled={selectedRows.length > 0 ? false : true}
                  >
                    {transferLanguage('dictData.field.disabled', this.props.language)}
                  </Button>
                  <Button
                    onClick={e => this.abledStatus(e, 'abled')}
                    disabled={selectedRows.length > 0 ? false : true}
                  >
                    {transferLanguage('dictData.field.enable', this.props.language)}
                  </Button>
                  <Button type="primary" onClick={e => this.operateInfo(e)}>
                    {transferLanguage('dictData.field.add', this.props.language)}
                  </Button>
                </Button.Group>
              </div>
              <DictInfo {...infoParams} />
            </div>
          </div>
        </Row>
      </Fragment>
    );
  }
}
