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
import { codes, Status, EventType, NoticeMode } from './utils';
import { formatCodeVal } from '@/pages/Common/common';
import { transferLanguage } from '@/utils/utils'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;

@connect(({ interfaceType, loading, common, component ,i18n}) => ({
  interfaceType,
  loading: loading.effects['interfaceType/interfaceTypeList'],
  dictObject: common.dictObject,
  language: i18n.language,
  searchValue: component.searchValue,
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
      interfaceType: { interfaceTypeDetails },
      isMobile,
      loading,
      visible,
      searchValue,
      language
    } = this.props;
    const details = interfaceTypeDetails[checkId] || {};
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };


    const beActive = details ? formatCodeVal(Status, details.beActive) : '';



    const fields = [
      { key: 'businessTypeCode', name: transferLanguage('Type.field.businessTypeCode',language)},
      { key: beActive, name: transferLanguage('Type.field.beActive',language), isConst: true },
      { key: 'businessTypeName', name: transferLanguage('Type.field.businessTypeName',language)},
      { key: details.requestType==='SEND'?'发送':'接受', name: transferLanguage('Type.field.requestType',language), isConst: true },
      { key: details.createBy, name: transferLanguage('Type.field.createBy',language), isConst: true },
      { key: details.createTime, name: transferLanguage('Type.field.createTime',language), isConst: true },
      { key: details.topicNameException, name: transferLanguage('Type.field.topicNameException',language), isConst: true },
      { key: details.topicNameNormal, name: transferLanguage('Type.field.topicNameNormal',language), isConst: true },
      { key: details.updateBy, name: transferLanguage('Type.field.updateBy',language), isConst: true },
      { key: details.updateTime, name: transferLanguage('Type.field.updateTime',language), isConst: true },
      { key: details.remarks, name: transferLanguage('Type.field.remarks',language), isRow: true },
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
