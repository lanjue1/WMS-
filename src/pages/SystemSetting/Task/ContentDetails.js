import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment, { isDate } from 'moment';
import router from 'umi/router';
import {
  Modal,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Collapse,
  DatePicker,
  Upload,
  PageHeader,
  Divider,
  message,
  Table,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import DetailsList from '@/components/DetailsList';
import styles from '@/pages/Detail.less';
import { formatFile } from '@/pages/Common/common';
import { codes, STATUS, EventType, NoticeMode } from './utils';
import { formatCodeVal } from '@/pages/Common/common';
import { transferLanguage } from '@/utils/utils'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;

@connect(({ interfaceContent, loading, common, component,i18n }) => ({
  interfaceContent,
  loading: loading.effects['interfaceContent/interfaceContentList'],
  dictObject: common.dictObject,
  searchValue: component.searchValue,
  language: i18n.language,

}))
@Form.create()
export default class ETCDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkId: '',
      activeKey: ['1', '2'],
    };
  }
  componentDidMount() {
    const { dispatch, dictObject, checkId } = this.props;
    this.setState({
      checkId: checkId,
    });
  }


  callback = key => {
    // console.log(key);
    this.setState({
      activeKey: key,
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  render() {
    const { activeKey } = this.state;
    const {
      checkId,
      form: { getFieldDecorator },
      interfaceContent: { interfaceContentDetails },
      isMobile,
      loading,
      visible,
      searchValue,
      language,
    } = this.props;
    const details = interfaceContentDetails[checkId] || {};
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };


    const dealStatus = details ? formatCodeVal(STATUS, details.dealStatus) : '';


    
    const fields = [
      { key: 'businessCode', name: transferLanguage('Content.field.businessCode',language) },
      { key: dealStatus, name: transferLanguage('Content.field.dealStatus',language), isConst: true },
      { key: 'businessId', name: transferLanguage('Content.field.businessId',language) },
      { key: details.businessType, name: transferLanguage('Content.field.businessType',language), isConst: true },
      { key: details.execTime, name: transferLanguage('Content.field.execTime',language), isConst: true },
      { key: details.receiverSys, name: transferLanguage('Content.field.receiverSys',language), isConst: true },
      { key: details.retryCount, name: transferLanguage('Content.field.retryCount',language), isConst: true },
      { key: details.senderSys, name: transferLanguage('Content.field.senderSys',language), isConst: true },
      { key: 'requestData', name: transferLanguage('Content.field.requestData',language), isRow: true },
      { key: "responseData", name: transferLanguage('Content.field.responseData',language), isRow: true },
    ];

    return (
      <div className={styles.CollapseDetails}>
        <Collapse activeKey={activeKey} onChange={key => this.callback(key)} bordered={false}>
          <Panel header={transferLanguage('Common.field.baseInfo',language)} key="1" className={styles.customPanelStyle}>
            <DetailsList isMobile={isMobile} detilsData={{ fields: fields, value: details }} />
          </Panel>
        </Collapse>
      </div>
    );
  }
}
