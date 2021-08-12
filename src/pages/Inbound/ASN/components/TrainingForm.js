import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Radio, Cascader } from 'antd';
import { SelectColumns } from '../utils';
import moment from 'moment'
import styles from '@/pages/Operate.less';
import AntdInput from '@/components/AntdInput'
import AntdDatePicker from '@/components/AntdDatePicker'
import { transferLanguage } from '@/utils/utils';
import FileReader from '@/components/FileReader';
import SearchSelect from '@/components/SearchSelect';

import { cityOpt } from '@/utils/citys'
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

@connect(({ common, i18n }) => ({
  dictObject: common.dictObject,
  language: i18n.language,
}))
@Form.create()
export default class TrainingForm extends Component {
  className = 'TrainingForm'
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef(this)

  }
  getFormValues = () => {
    this.props.form.validateFieldsAndScroll((errors, valueTrains) => {
      if(errors) {
        this.props.saveForms('','','isError')
        return
      }
      const { loadingTime, arrivedTime, ...valueTrain } = valueTrains
      loadingTime> 0 ? valueTrain.loadingTime = moment(loadingTime).format(dateFormat) : ''
      arrivedTime> 0 ? valueTrain.arrivedTime = moment(arrivedTime).format(dateFormat) : ''
      this.props.saveForms(valueTrain, 'Traning')
    })
  }
  
  render() {
    const {
      form: { getFieldDecorator },
      form,
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
              <Form.Item label={transferLanguage('ASN.field.isHicTransport',language)}>
                {getFieldDecorator('isHicTransport', {
                  initialValue: selectDetails && selectDetails.isHicTransport ? String(selectDetails.isHicTransport) : 'true',
                })(
                  <Radio.Group>
                    <Radio value="true" disabled={disabled}> 是</Radio>
                    <Radio value="false" disabled={disabled}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <>
            </>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.forwarder',language)}>
                {getFieldDecorator('forwarder', {
                  rules: [{ required: true, message: '请输入' }],

                  initialValue: selectDetails ? selectDetails.forwarder : '',
                })(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.transportStatus',language)}>
                {getFieldDecorator('transportStatus', {
                  rules: [{ required: true, message: '请选择' }],

                  initialValue: selectDetails ? selectDetails.transportStatus : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.vehicleNo',language)}>
                {getFieldDecorator('vehicleNo', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.vehicleNo : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              {/* <Form.Item label={'柜型'}>
                {getFieldDecorator('billingCycle', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.billingCycle : ""

                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item> */}
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.vehicleContainerNo',language)}>
                {getFieldDecorator('vehicleContainerNo', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.vehicleContainerNo : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.sealNo',language)}>
                {getFieldDecorator('sealNo', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.sealNo : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.driver',language)}>
                {getFieldDecorator('driver', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.driver : '',
                }
                )(<AntdInput disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.driverPhone',language)}>
                {getFieldDecorator('driverPhone', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.driverPhone : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              {/* <Form.Item label={'GPS设备号'}>
                {getFieldDecorator('adjustPer', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.adjustmentPer : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item> */}
            </Col>
            <>
            </>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.loadingTime',language)}>
                {getFieldDecorator('loadingTime', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.loadingTime ?
                    moment(selectDetails.loadingTime) : ''
                  // [moment(selectDetails.billingStartDate), moment(selectDetails.billingEndDate)] : '',
                }
                )(<AntdDatePicker disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.arrivedTime',language)}>
                {getFieldDecorator('arrivedTime', {
                  initialValue: selectDetails && selectDetails.arrivedTime ? moment(selectDetails.arrivedTime) : '',
                }
                )(<AntdDatePicker disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.consignor',language)}>
                {getFieldDecorator('consignor', {
                  initialValue: selectDetails && selectDetails.consignor ? selectDetails.consignor : '',
                })(
                  <Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <>
            </>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.AsnShipFrom',language)}>
                {getFieldDecorator('asnShipFrom', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.asnShipFrom : '',
                }
                )(
                  <Cascader options={cityOpt} disabled={disabled} placeholder="Please select" />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.shipFromAddress',language)}>
                {getFieldDecorator('shipFromAddress', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.shipFromAddress : '',
                }
                )(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.consignee',language)}>
                {getFieldDecorator('consignee', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.consignee : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <>
            </>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.asnShipTo',language)}>
                {getFieldDecorator('asnShipTo', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.asnShipTo : '',
                }
                )(
                  <Cascader options={cityOpt} disabled={disabled} placeholder="Please select" />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.shipToAddress',language)}>
                {getFieldDecorator('shipToAddress', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.shipToAddress : '',
                }
                )(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._row}>
              <Form.Item label={transferLanguage('ASN.field.signForm',language)}>
                {getFieldDecorator('signForm', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.signForm : '',
                }
                )(<FileReader fileValue={selectDetails && selectDetails.signForm} disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>

        </Form>

      </div>
    );
  }
}
