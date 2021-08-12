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
import AdModal from '@/components/AdModal'
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

export default class AddDetailsModal extends Component {
    className = 'AddPartsForm'
    constructor(props) {
        super(props);
        this.state = {
            cargoOwner: props.selectDetails ? [{ code: props.selectDetails.cargoOwnerId, name: props.selectDetails.cargoOwnerName }] : [],
        }
    }

    componentDidMount() {

    }
    onOk = () => {
        const { form, dispatch, selectDetails, refreshList, onCancel, detail } = this.props
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            const { cargoOwnerId } = values
            cargoOwnerId ? values.cargoOwnerId = cargoOwnerId[0].id : ''
            selectDetails ? values.id = selectDetails.id : '',
                values.soId = detail.id
            dispatch({
                type: 'so/ableOperate',
                payload: { type: selectDetails ? 'updateDetail' : 'addDetail', ...values },
                callback: (data) => {
                    refreshList()
                    onCancel()
                }
            })
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
            disabled,
            visible,
            onCancel,
            detail
        } = this.props;

        const _gutter = { md: 8, lg: 24, xl: 48 };
        const _col = { md: 12, sm: 24 };
        const _row = { md: 24 };
        return (
            <AdModal
                visible={visible}
                title={'新增明细'}
                onOk={this.onOk}
                onCancel={() => onCancel()}
                width='800px'
            >
                <div className={styles.tableListForm}>
                    <Form layout="inline">
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'明细单号'}>
                                    {getFieldDecorator('lineNo', {
                                        initialValue: selectDetails ? selectDetails.lineNo : '',
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'状态'}>
                                    {getFieldDecorator('status', {
                                        initialValue: selectDetails ? selectDetails.status : detail.status,
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'货主'}>
                                    {getFieldDecorator('cargoOwnerId', {
                                        rules: [{ required: true, message: '请输入' }],
                                        initialValue: selectDetails ? selectDetails.cargoOwnerId : '',
                                    })(
                                        <SearchSelect
                                            dataUrl={'/mds-cargo-owner/selectMdsCargoOwnerList'}
                                            selectedData={this.state.cargoOwner} // 选中值
                                            multiple={false}
                                            showValue="name"
                                            searchName="name"
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
                                <Form.Item label={'客户单号'}>
                                    {getFieldDecorator('customerOrderNo', {
                                        rules: [{ required: true, message: '请输入' }],
                                        initialValue: selectDetails && selectDetails.customerOrderNo ? selectDetails.customerOrderNo : '',
                                    })(
                                        <Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'发票号'}>
                                    {getFieldDecorator('lotInvoiceNo', {
                                        // rules: [{ required: true, message: '请输入' }],
                                        initialValue: selectDetails && selectDetails.lotInvoiceNo ? selectDetails.lotInvoiceNo : '',
                                    })(
                                        <Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'DN'}>
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
                                <Form.Item label={'料号'}>
                                    {getFieldDecorator('partNo', {
                                        rules: [{ required: true, message: '请输入' }],
                                        initialValue: selectDetails && selectDetails.partNo ? selectDetails.partNo : '',
                                    })(
                                        <Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'料件描述'}>
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
                                <Form.Item label={'PCS'}>
                                    {getFieldDecorator('planPcsQty', {
                                        //  rules: [{ required: true, message: '请输入' }],
                                        initialValue: selectDetails ? selectDetails.planPcsQty : '',
                                    }
                                    )(<Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'内包装'}>
                                    {getFieldDecorator('planInnerQty', {
                                        initialValue: selectDetails ? selectDetails.planInnerQty : '',
                                    }
                                    )(<Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </AdModal>
        );
    }
}
