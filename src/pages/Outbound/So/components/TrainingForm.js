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
    console.log('selectDetails?', selectDetails)
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'海晨运输'}>
                {getFieldDecorator('isHicTransport', {
                  initialValue: selectDetails && selectDetails.isHicTransport ? selectDetails.isHicTransport : 'true',
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
              <Form.Item label={'承运商'}>
                {getFieldDecorator('forwarder', {
                  rules: [{ required: true, message: '请输入' }],

                  initialValue: selectDetails ? selectDetails.forwarder : '',
                })(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'运输状态'}>
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
              <Form.Item label={'车牌'}>
                {getFieldDecorator('vehicleNo', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.vehicleNo : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'柜型'}>
                {getFieldDecorator('vehicleType', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.vehicleType : ""

                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'集装箱号'}>
                {getFieldDecorator('vehicleContainerNo', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.vehicleContainerNo : '',
                })(
                  <Input disabled={true} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'封条号'}>
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
              <Form.Item label={'司机'}>
                {getFieldDecorator('driver', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.driver : '',
                }
                )(<AntdInput disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'司机电话'}>
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
              <Form.Item label={'GPS设备号'}>
                {getFieldDecorator('adjustPer', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.adjustmentPer : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <>
            </>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'装车时间'}>
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
              <Form.Item label={'到达时间'}>
                {getFieldDecorator('arrivedTime', {
                  initialValue: selectDetails && selectDetails.arrivedTime ? moment(selectDetails.arrivedTime) : '',
                }
                )(<AntdDatePicker disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={'发货人'}>
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
              <Form.Item label={'发货地址'}>
                {getFieldDecorator('poCpctFrom', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.asnShipFrom : '',
                }
                )(
                  <Cascader options={cityOpt} disabled={disabled} onChange={this.CascaderChange} placeholder="Please select" />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'发货详细地址'}>
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
              <Form.Item label={'收货人'}>
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
              <Form.Item label={'收货地址'}>
                {getFieldDecorator('poCpctTo', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.asnShipTo : '',
                }
                )(
                  <Cascader options={cityOpt} disabled={disabled} placeholder="Please select" />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={'收货详细地址'}>
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
              <Form.Item label={'签收单'}>
                {getFieldDecorator('signForm', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.signForm : '',
                }
                )(<FileReader disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>

        </Form>

      </div>
    );
  }
}
