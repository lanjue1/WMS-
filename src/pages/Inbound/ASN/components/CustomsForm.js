import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Radio } from 'antd';
import { SelectColumns } from '../utils';
import moment from 'moment'
import styles from '@/pages/Operate.less';
import AntdInput from '@/components/AntdInput'
import AntdDatePicker from '@/components/AntdDatePicker'
import { transferLanguage } from '@/utils/utils';
import FileReader from '@/components/FileReader';
import SearchSelect from '@/components/SearchSelect';

const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';

@connect(({ common, i18n }) => ({
  dictObject: common.dictObject,
  language: i18n.language,
}))
@Form.create()
export default class CustomsForm extends Component {
  className = 'CustomsForm'
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef(this)

  }
  getFormValues = () => {
    this.props.form.validateFieldsAndScroll((errors, valueCustoms) => {
      if(errors) {
        this.props.saveForms('','','isError')
        return
      }
      const { declareTime, declarationCompletionTime, ...valueCustom } = valueCustoms
      declareTime > 0 ? valueCustom.declareTime = moment(declareTime).format(dateFormat) : ''
      declarationCompletionTime > 0 ? valueCustom.declarationCompletionTime = moment(declarationCompletionTime).format(dateFormat) : ''
      
      this.props.saveForms(valueCustom, 'Customs')
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
              <Form.Item label={transferLanguage('ASN.field.beHicDeclaration',language)}>
                {getFieldDecorator('beHicDeclaration', {
                  initialValue: selectDetails && selectDetails.beHicDeclaration ? selectDetails.beHicDeclaration : 'true',
                })(
                  <Radio.Group>
                    <Radio value="true" disabled={disabled}> 是</Radio>
                    <Radio value="false" disabled={disabled}>否</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.declarationMode',language)}>
                {getFieldDecorator('declarationMode', {
                  // rules: [{ required: true, message: '请输入' }],

                  initialValue: selectDetails ? selectDetails.declarationMode : '',
                })(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>

            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.customsDeclarationNo',language)}>
                {getFieldDecorator('customsDeclarationNo', {
                  // rules: [{ required: true, message: '请选择' }],

                  initialValue: selectDetails ? selectDetails.customsDeclarationNo : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.declarationStatus',language)}>
                {getFieldDecorator('declarationStatus', {
                  // rules: [{ required: true, message: '请输入' }],

                  initialValue: selectDetails ? selectDetails.declarationStatus : '',
                })(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.tradeClause',language)}>
                {getFieldDecorator('tradeClause', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.tradeClause : ""

                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.regulationType',language)}>
                {getFieldDecorator('regulationType', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.regulationType : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.declarationEntrustmentItem',language)}>
                {getFieldDecorator('declarationEntrustmentItem', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.declarationEntrustmentItem : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <></>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.declareTime',language)}>
                {getFieldDecorator('declareTime', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.declareTime ? moment(selectDetails.declareTime) : '',
                }
                )(<AntdDatePicker disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.declarationCompletionTime',language)}>
                {getFieldDecorator('declarationCompletionTime', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.declarationCompletionTime ? moment(selectDetails.declarationCompletionTime) : '',
                }
                )(<AntdDatePicker disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>

      </div>
    );
  }
}
