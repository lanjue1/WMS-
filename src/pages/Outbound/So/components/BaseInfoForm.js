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
export default class BaseInfoForm extends Component {
  className = 'BaseInfoForm'
  constructor(props) {
    super(props);
    this.state = {
      customerId: [{ code: props.selectDetails.customerCode ,name:props.selectDetails.customerName}] || []
    }
  }

  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    // this.props.onRef('Forms', this)
    this.props.onRef(this)
  }

  getValue = (values, type) => {
    this.setState({
        [type]: values
    })
  }


  render() {
    const {
      form: { getFieldDecorator },
      form,
      loading,
      language,
      selectDetails,
    } = this.props;

    const disabled = this.props.disabled
    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'采购订单'}>
                {getFieldDecorator('soNo', {
                  initialValue: selectDetails ? selectDetails.poNo : '',
                })(<Input disabled={true} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'状态'}>
                {getFieldDecorator('status', {
                  initialValue: selectDetails ? selectDetails.status : '',
                })(<Input disabled={true} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
          <Col {..._col}>
              <Form.Item label={'客户'}>
                {getFieldDecorator('customerId', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.customerId ? selectDetails.customerId : '',
                })(
                  <SearchSelect
                    dataUrl={'/wms-contact-unit/selectWmsContactUnitList'}
                    selectedData={this.state.customer}  // 选中值
                    multiple={false}
                    showValue="name"
                    searchName="name"
                    columns={SelectColumns}
                    onChange={values => this.getValue(values, 'customer')}
                    id="customerId"
                    allowClear={true}
                    scrollX={200}
                    disabled={disabled}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'优先级'}>
                {getFieldDecorator('priority', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.priority : '',
                })(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>

            <Col {..._col}>
              <Form.Item label={'订单类型'}>
                {getFieldDecorator('billTypeId', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.billTypeId : ""

                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'订单日期'}>
                {getFieldDecorator('bizDate', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.bizDate ? moment(selectDetails.bizDate) : '',
                })(
                  <AntdDatePicker disabled={disabled} />
                )}
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'客户单号'}>
                {getFieldDecorator('customerOrderNo', {
                  initialValue: selectDetails ? selectDetails.customerOrderNo : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'发票号'}>
                {getFieldDecorator('invoiceNo', {
                  initialValue: selectDetails ? selectDetails.invoiceNo : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'关联单号'}>
                {getFieldDecorator('referenceCode', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.referenceCode : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'数据来源'}>
                {getFieldDecorator('orderSource', {
                  initialValue: selectDetails ? selectDetails.orderSource : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'预计发货时间'}>
                {/* 字段需更改 */}
                {getFieldDecorator('estimateReceiveTime', {
                  initialValue: selectDetails && selectDetails.estimateReceiveTime ? moment(selectDetails.estimateReceiveTime) : '',
                })(
                  <AntdDatePicker disPlaceholder disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'实际发货时间'}>
                {/* 字段需更改 */}

                {getFieldDecorator('realReceiveTimeEnd', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.realReceiveTimeEnd ? moment(selectDetails.realReceiveTimeEnd) : '',
                }
                )(<AntdDatePicker disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'EDI回复状态'}>
                {getFieldDecorator('prePaymentTime', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.prePaymentTime : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'EDI更新时间'}>
                {getFieldDecorator('actualAmount', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.realReceiveTimeEnd ? moment(selectDetails.realReceiveTimeEnd) : '',
                }
                )(<AntdDatePicker disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._row}>
              <Form.Item label={'备注'}>
                {getFieldDecorator('remarks', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.remarks : '',
                }
                )(<TextArea rows={2} disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._row}>
              <Form.Item label={'附件'}>
                {getFieldDecorator('fileToken', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.fileToken : '',
                }
                )(<FileReader value={selectDetails && selectDetails.fileToken} disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>

        </Form>

      </div>
    );
  }
}
