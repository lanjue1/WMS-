import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,

} from 'antd';
import { SelectColumns } from '../utils';
import moment, { lang } from 'moment'
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

export default class AddPartsForm extends Component {
  className = 'AddPartsForm'
  constructor(props) {
    super(props);
   this.state={
    cargoOwner:[],
    partNo:[]
   }
  }

  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    // this.props.onRef('Forms', this)
    this.props.onRef(this)
  }
  componentWillReceiveProps(nextProps){
    const {cargoOwner,partNo}=this.state
    if(cargoOwner.length==0&&nextProps.selectDetails.cargoOwnerId){
      this.setState({ 
        cargoOwner:[{code:nextProps.selectDetails.cargoOwnerId,name:nextProps.selectDetails.cargoOwnerName}]
      })
    }
    if(partNo.length==0&&nextProps.selectDetails.partNo){
      console.log('selectDetails',nextProps.selectDetails)

      this.setState({ 
        partNo:[{code:nextProps.selectDetails.partNo,name:nextProps.selectDetails.partName}]
      })
    }
  }
  getFormValues = () => {
    this.props.form.validateFieldsAndScroll((errors, valueBases) => {
      if (errors) {
        this.props.saveForms('', '', 'isError')
        return
      }
      const { bizDate, estimateReceiveTime, realReceiveTimeStart, realReceiveTimeEnd, cargoOwnerId,partNo,...valueBase } = valueBases
      cargoOwnerId ?valueBase.cargoOwnerId=cargoOwnerId[0].id:''
      partNo?valueBase.partNo=partNo[0].code:""
      partNo?valueBase.partId=partNo[0].id:""
      this.props.saveForms(valueBase, 'PartDetail')
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
      language,
      selectDetails,
      disabled
    } = this.props;
    console.log('partno',this.state.partNo)
    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };
    return (
      <div className={styles.tableListForm}>
        <Form layout="inline">
          <Row gutter={_gutter}>
            <Col {..._col}>
              {/* <Form.Item label={'明细单号'}>
                {getFieldDecorator('asnNo', {
                  initialValue: selectDetails ? selectDetails.asnNo : '',
                })(<Input disabled={disabled} />)}
              </Form.Item> */}
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('Common.field.status',language)}>
                {getFieldDecorator('status', {
                  initialValue: selectDetails ? selectDetails.status : '',
                })(<Input disabled={true} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.cargoOwner',language)}>
                {getFieldDecorator('cargoOwnerId', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.cargoOwnerId : '',
                })(
                  <SearchSelect
                    dataUrl={'/mds-cargo-owner/selectMdsCargoOwnerList'}
                    selectedData={this.state.cargoOwner} // 选中值
                    multiple={false}
                    showValue="code"
                    searchName="code"
                    columns={SelectColumns}
                    onChange={values => this.getValue(values, 'cargoOwner')}
                    id="cargoOwnerId"
                    allowClear={true}
                    scrollX={200}
                    disabled={disabled}

                  />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.partNo',language)}>
                {getFieldDecorator('partNo', {
                  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.partNo ?selectDetails.partNo: '',
                })(
                  <SearchSelect
                    dataUrl={'/wms-part/selectWmsPartList'}
                    selectedData={this.state.partNo} // 选中值
                    multiple={false}
                    showValue="code"
                    searchName="code"
                    columns={SelectColumns}
                    onChange={values => this.getValue(values, 'partNo')}
                    id="cargoOwnerId"
                    allowClear={true}
                    scrollX={200}
                    disabled={disabled}
                    />
                )}
              </Form.Item>
            </Col>
           
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.invoiceNo',language)}>
                {getFieldDecorator('lotInvoiceNo', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.lotInvoiceNo ? selectDetails.lotInvoiceNo : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.lotDnNo',language)}>
                {getFieldDecorator('lotDnNo', {
                  initialValue: selectDetails ? selectDetails.lotDnNo : ""
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>
            
            <Col {..._col}>
              {/* <Form.Item label={'料件描述'}>
                {getFieldDecorator('referenceCode', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.referenceCode : '',
                })(
                  <Input disabled={disabled} />
                )}
              </Form.Item> */}
            </Col>
          </Row>

          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.lotVendorPart',language)}>
                {getFieldDecorator('lotVendorPart', {
                  initialValue: selectDetails ? selectDetails.lotVendorPart : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.lotVendorName',language)}>
                {getFieldDecorator('lotVendorName', {
                  initialValue: selectDetails ? selectDetails.lotVendorName : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.planPcsQty',language)}>
                {getFieldDecorator('planPcsQty', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.planPcsQty : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.planInnerQty',language)}>
                {getFieldDecorator('planInnerQty', {
                  initialValue: selectDetails ? selectDetails.planInnerQty : '',
                }
                )(<Input disabled={disabled} />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={_gutter}>

            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.planBoxQty',language)}>
                {getFieldDecorator('planBoxQty', {
                  // rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.planBoxQty : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.planPalletQty',language)}>
                {getFieldDecorator('planPalletQty', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.planPalletQty : '',
                }
                )(<AntdInput mode='number' disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.planGrossWeight',language)}>
                {getFieldDecorator('planGrossWeight', {
                  initialValue: selectDetails ? selectDetails.planGrossWeight : '',
                }
                )(<AntdInput mode='number' disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.planNetWeight',language)}>
                {getFieldDecorator('planNetWeight', {
                  initialValue: selectDetails && selectDetails.planNetWeight ? selectDetails.planNetWeight : '',
                })(
                  <AntdInput mode='money' disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={_gutter}>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.lotUnitPrice',language)}>
                {getFieldDecorator('lotUnitPrice', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails && selectDetails.lotUnitPrice ? selectDetails.lotUnitPrice : '',
                }
                )(<AntdInput mode='money' disabled={disabled} />)}
              </Form.Item>
            </Col>
            <Col {..._col}>
              <Form.Item label={transferLanguage('ASN.field.lotCoo',language)}>
                {getFieldDecorator('lotCoo', {
                  //  rules: [{ required: true, message: '请输入' }],
                  initialValue: selectDetails ? selectDetails.lotCoo : '',
                }
                )(<Input disabled={disabled} />)}
              </Form.Item>
            </Col>
          </Row>
          
        </Form>

      </div>
    );
  }
}
