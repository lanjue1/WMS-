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
import { formatCodeVal } from '@/pages/Common/common';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const BeSys = [{ code: true, value: '是' }, { code: false, value: '否' }];

@connect(({ sysConfig, loading, common }) => ({
  sysConfig,
  loading: loading.effects['sysConfig/sysConfigDetails'],
  dictObject: common.dictObject,
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
    this.setState({
      activeKey: key,
    });
  };

  render() {
    const { activeKey } = this.state;
    const {
      checkId,
      form: { getFieldDecorator },
      sysConfig: { sysConfigDetails },
      isMobile,
      loading,
    } = this.props;
    const details = sysConfigDetails[checkId];

    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };
    const beSys = details ? formatCodeVal(BeSys, details.beSys) : '';
    const fields = [
      { key: 'configKey', name: '配置编码' },
      { key: 'configName', name: '名称' },
      { key: 'configValue', name: '配置值' },
      { key: beSys, name: '系统内置', isConst: true },
      // { key: 'createBy', name: '创建人' },
      // { key: 'createTime', name: '创建时间' },
      // { key: 'updateBy', name: '更新人' },
      // { key: 'updateTime', name: '更新时间' },
      { key: 'remark', name: '备注信息', isRow: true },
    ];

    return (
      <div className={styles.CollapseDetails}>
        <Collapse activeKey={activeKey} onChange={key => this.callback(key)} bordered={false}>
          <Panel header="系统配置信息" key="1" className={styles.customPanelStyle}>
            <DetailsList isMobile={isMobile} detilsData={{ fields: fields, value: details }} />
          </Panel>
        </Collapse>
      </div>
    );
  }
}
