import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,

} from 'antd';
import { SelectColumns } from '../utils';
import moment from 'moment'
import styles from '@/pages/Operate.less';
import AntdInput from '@/components/AntdInput'
import AntdDatePicker from '@/components/AntdDatePicker'
import { transferLanguage } from '@/utils/utils';
import FileReader from '@/components/FileReader';
import SearchSelect from '@/components/SearchSelect';

const { TextArea } = Input;

@connect(({ common, i18n }) => ({
  dictObject: common.dictObject,
  language: i18n.language,
}))
@Form.create()
export default class ExtraForm extends Component {
  className = 'ExtraForm'
  constructor(props) {
    super(props);
    
  }


  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef( this)
  }
 
  render() {
    const {
      form: { getFieldDecorator },
      form,
      loading,
      language,
      selectDetails,
      disabled,
    } = this.props;
    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'自定义1'}>
                {getFieldDecorator('billingNo', {
                  initialValue: selectDetails ? selectDetails.billingNo : '',
                })(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'自定义2'}>
                {getFieldDecorator('status', {
                  initialValue: selectDetails ? selectDetails.status : '',
                })(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'自定义3'}>
                {getFieldDecorator('payer', {
                  initialValue: selectDetails ? selectDetails.payer : '',
                })(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'自定义4'}>
                {getFieldDecorator('payee', {
                  initialValue: selectDetails ? selectDetails.payee : '',
                })(
                  <Input disabled={disabled}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'自定义5'}>
                {getFieldDecorator('billingDate', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.billingStartDate ?selectDetails.billingStartDate: '',
                })(
                  <Input disabled={disabled}/>
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'自定义6'}>
                {getFieldDecorator('billingCycle', {
                  initialValue: selectDetails ? selectDetails.billingCycle : ""
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </div>
    );
  }
}
