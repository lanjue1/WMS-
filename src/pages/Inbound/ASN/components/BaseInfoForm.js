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
import AdSelect from '@/components/AdSelect'
import AntdDatePicker from '@/components/AntdDatePicker'
import { transferLanguage } from '@/utils/utils';
import FileReader from '@/components/FileReader';
import SearchSelect from '@/components/SearchSelect';
import { allDictList } from '@/utils/common'
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

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
      customer: [],
    }
  }

  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    // this.props.onRef('Forms', this)
    this.props.onRef(this)

  }
  componentWillReceiveProps(nextProps) {
    const { customer } = this.state
    if (customer.length == 0 && nextProps.selectDetails.customerId) {
      this.setState({
        customer: [{ code: nextProps.selectDetails.customerId, name: nextProps.selectDetails.customerName }]
      })
    }
  }
  getFormValues = () => {
    this.props.form.validateFieldsAndScroll((errors, valueBases) => {
      if (errors) {
        this.props.saveForms('', '', 'isError')
        return
      }
      const { bizDate, estimateReceiveTime, realReceiveTimeStart, realReceiveTimeEnd, customerId, ...valueBase } = valueBases
      bizDate > 0 ? valueBase.bizDate = moment(bizDate).format(dateFormat) : ''
      estimateReceiveTime > 0 ? valueBase.estimateReceiveTime = moment(estimateReceiveTime).format(dateFormat) : ''
      realReceiveTimeStart > 0 ? valueBase.realReceiveTimeStart = moment(realReceiveTimeStart).format(dateFormat) : ''
      realReceiveTimeEnd > 0 ? valueBase.realReceiveTimeEnd = moment(realReceiveTimeEnd).format(dateFormat) : ''
      customerId ? valueBase.customerId = customerId[0].id : ''
      this.props.saveForms(valueBase, 'BaseInfo')
    })
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
      disabled
    } = this.props;

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.asnNo',language)}>
                {getFieldDecorator('asnNo', {
                  initialValue: selectDetails ? selectDetails.asnNo : '',
                })(<Input disabled={true} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.priority',language)}>
                {getFieldDecorator('priority', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.priority : '',
                })(<AdSelect payload={{ code: allDictList.WMS_PRIORITY }} disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.status',language)}>
                {getFieldDecorator('status', {
                  initialValue: selectDetails ? selectDetails.status : '',
                })(
                  <Input disabled={true} />
                  // <AdSelect payload={{ code: allDictList.WMS_ASN_STATUS }} disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.putawayStauts',language)}>
                {getFieldDecorator('putawayStauts', {
                  initialValue: selectDetails ? selectDetails.putawayStauts : '',
                })(
                  <Input disabled={true} />
                  // <AdSelect payload={{code:allDictList.WMS_ASN_PUTAWAY_STATUS}} disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.customer',language)}>
                {getFieldDecorator('customerId', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.customerId ? selectDetails.customerId : '',
                })(
                  <SearchSelect
                    dataUrl={'/wms-contact-unit/selectWmsContactUnitList'}
                    selectedData={this.state.customer} // 选中值
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
              <Form.Item label={transferLanguage('ASN.field.orderType',language)}>
                {getFieldDecorator('orderType', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.orderType : ""

                })(
                  <AdSelect payload={{ code: allDictList.WMS_ORDER_TYPE }} disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.bizDate',language)}>
                {getFieldDecorator('bizDate', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.bizDate ? moment(selectDetails.bizDate) : '',
                })(
                  <AntdDatePicker disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.referenceCode',language)}>
                {getFieldDecorator('referenceCode', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.referenceCode : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.customerOrderNo',language)}>
                {getFieldDecorator('customerOrderNo', {
                  initialValue: selectDetails ? selectDetails.customerOrderNo : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.invoiceNo',language)}>
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
              <Form.Item label={transferLanguage('ASN.field.plant',language)}>
                {getFieldDecorator('plant', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.plant : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.sapLocation',language)}>
                {getFieldDecorator('sapLocation', {
                  initialValue: selectDetails ? selectDetails.sapLocation : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>

            <Col {..._col}>
              {/* <Form.Item label={'上架单号'}>
                {getFieldDecorator('actualAmount', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.actualAmount : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item> */}
            </Col>
            <Col {..._col}>
              {/* <Form.Item label={'EDI回复状态'}>
                {getFieldDecorator('prePaymentTime', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.prePaymentTime : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item> */}
            </Col>
          </Row>

          <Row gutter={_gutter}>

            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.orderSource',language)}>
                {getFieldDecorator('orderSource', {
                  initialValue: selectDetails ? selectDetails.orderSource : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.estimateReceiveTime',language)}>
                {getFieldDecorator('estimateReceiveTime', {
                  initialValue: selectDetails && selectDetails.estimateReceiveTime ? moment(selectDetails.estimateReceiveTime) : '',
                })(
                  <AntdDatePicker disPlaceholder disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.realReceiveTimeStart',language)}>
                {getFieldDecorator('realReceiveTimeStart', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.realReceiveTimeStart ? moment(selectDetails.realReceiveTimeStart) : '',
                }
                )(<AntdDatePicker disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.realReceiveTimeEnd',language)}>
                {getFieldDecorator('realReceiveTimeEnd', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.realReceiveTimeEnd ? moment(selectDetails.realReceiveTimeEnd) : '',
                }
                )(<AntdDatePicker disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._row}>
              <Form.Item label={transferLanguage('Common.field.remarks',language)}>
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
              <Form.Item label={transferLanguage('Common.field.attachment',language)}>
                {getFieldDecorator('fileToken', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.fileToken : '',
                }
                )(<FileReader fileValue={selectDetails && selectDetails.fileToken} disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>

        </Form>

      </div>
    );
  }
}
