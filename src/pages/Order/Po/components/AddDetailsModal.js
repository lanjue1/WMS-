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
                values.poId = detail.poId
            for (const key in values) {
                if (!values[key]) {
                    delete values[key]
                }
            }
            dispatch({
                type: 'po/ableOperate',
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
                title={'????????????'}
                onOk={this.onOk}
                onCancel={() => onCancel()}
                width='800px'

            >
                <div className={styles.tableListForm}>
                    <Form layout="inline">
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'????????????'}>
                                    {getFieldDecorator('lineNo', {
                                        initialValue: selectDetails ? selectDetails.lineNo : '',
                                    })(<Input disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('status', {
                                        initialValue: selectDetails ? selectDetails.status : detail.status,
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('cargoOwnerId', {
                                        rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails ? selectDetails.cargoOwnerId : '',
                                    })(
                                        <SearchSelect
                                            dataUrl={'/mds-cargo-owner/selectMdsCargoOwnerList'}
                                            selectedData={this.state.cargoOwner} // ?????????
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
                                <Form.Item label={'????????????'}>
                                    {getFieldDecorator('customerOrderNo', {
                                        rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails && selectDetails.customerOrderNo ? selectDetails.customerOrderNo : '',
                                    })(
                                        <Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'?????????'}>
                                    {getFieldDecorator('lotInvoiceNo', {
                                        // rules: [{ required: true, message: '?????????' }],
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
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('partNo', {
                                        rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails && selectDetails.partNo ? selectDetails.partNo : '',
                                    })(
                                        <Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'????????????'}>
                                    {getFieldDecorator('referenceCode', {
                                        // rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails ? selectDetails.referenceCode : '',
                                    })(
                                        <Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'???????????????'}>
                                    {getFieldDecorator('lotVendorPart', {
                                        initialValue: selectDetails ? selectDetails.lotVendorPart : '',
                                    }
                                    )(<Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'?????????'}>
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
                                <Form.Item label={'PCS'}>
                                    {getFieldDecorator('planPcsQty', {
                                        //  rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails ? selectDetails.planPcsQty : '',
                                    }
                                    )(<Input disabled={disabled} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'?????????'}>
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
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('planBoxQty', {
                                        // rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails ? selectDetails.planBoxQty : '',
                                    }
                                    )(<Input disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('planPalletQty', {
                                        //  rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails ? selectDetails.planPalletQty : '',
                                    }
                                    )(<AntdInput mode='number' disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('planGrossWeight', {
                                        initialValue: selectDetails ? selectDetails.planGrossWeight : '',
                                    }
                                    )(<AntdInput mode='number' disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('planNetWeight', {
                                        initialValue: selectDetails && selectDetails.planNetWeight ? selectDetails.planNetWeight : '',
                                    })(
                                        <AntdInput mode='money' disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('planVolume', {
                                        //  rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails && selectDetails.planVolume ? selectDetails.planVolume : '',
                                    }
                                    )(<AntdInput mode='money' disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'?????????'}>
                                    {getFieldDecorator('lotCoo', {
                                        //  rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails ? selectDetails.lotCoo : '',
                                    }
                                    )(<Input disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('lotUnitPrice', {
                                        //  rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails && selectDetails.lotUnitPrice ? selectDetails.lotUnitPrice : '',
                                    }
                                    )(<AntdInput mode='money' disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item label={'??????'}>
                                    {getFieldDecorator('planCargoValue', {
                                        //  rules: [{ required: true, message: '?????????' }],
                                        initialValue: selectDetails ? selectDetails.planCargoValue : '',
                                    }
                                    )(<Input disabled={disabled} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </AdModal>
        );
    }
}
