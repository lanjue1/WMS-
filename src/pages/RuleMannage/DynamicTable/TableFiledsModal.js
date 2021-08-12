import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import AdSelect from '@/components/AdSelect';
import AntdInput from '@/components/AntdInput';
import styles from '@/pages/Operate.less';
import {
    filedTypeList,
    beEmptyList,
    dataTypeList
} from './utils';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ dynamicTable, component, i18n }) => ({
    dynamicTable,
    dictObject: component.dictObject,
    language: i18n.language,
}))
@Form.create()
export default class TableFiledsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drivers: [],
            driverType: 'HW01',
            unit: 'check',
            worker: [],
            beEmptyDisable: false,
            dataType:''
        };
    }

    componentDidMount() {
        if (this.props.ediDetails.filedType === 'QUERY') {
            this.setState({
                beEmptyDisable: true
            })
        }
    };

    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };

    saveInfo = () => {
        const { form, dispatch, getDynamicTableDetails, visible, modalEmpty, ediDetails, detailId } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            let param = {
                ruleTableId: detailId,
                ...values
            }
            param.beEmpty = param.beEmpty === 'yes' ? true : false
            if (ediDetails) {
                param.id = ediDetails.id
            }
            dispatch({
                type: 'dynamicTable/operationTableField',
                payload: param,
                callback: () => {
                    getDynamicTableDetails()
                    modalEmpty();
                }
            })
        });
    };

    render() {
        const { drivers, driverType, worker,dataType } = this.state;
        const {
            form: { getFieldDecorator },
            visible,
            disabled,
            modalEmpty,
            dy_fieldList,
            language,
            ediDetails,
        } = this.props;
        const commonParams = {
            getFieldDecorator,
        };
        const customPanelStyle = {
            borderRadius: 4,
            marginBottom: 12,
            border: 0,
            overflow: 'hidden',
        };;

        const _gutter = { md: 8, lg: 24, xl: 48 };

        const _col = { md: 12, sm: 24 };
        const _row = { md: 24 };
        return (
            <div>
                <AdModal
                    visible={visible}
                    title={ediDetails ? '编辑表字段' : '添加表字段'}
                    onOk={this.saveInfo}
                    onCancel={() => {
                        modalEmpty();
                    }}
                    width="80%"
                    style={{
                        maxWidth: 500,
                    }}
                >
                    <div className={styles.tableListForm}>
                        <Form layout="inline">
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={'字段名'}>
                                        {getFieldDecorator('fieldName', {
                                            rules: [{ required: true }],
                                            initialValue: ediDetails ? ediDetails.fieldName : '',
                                        })(<Input disabled={disabled} rows={4} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={'字段类型'}>
                                        {getFieldDecorator('filedType', {
                                            rules: [{ required: true }],
                                            initialValue: ediDetails ? ediDetails.filedType : '',
                                        })(<AdSelect
                                            isExist={true}
                                            data={filedTypeList}
                                            onChange={value => { this.setState({ beEmptyDisable: value === 'QUERY' ? true : false }) }}
                                        />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={'数据类型'}>
                                        {getFieldDecorator('dataType', {
                                            rules: [{ required: true }],
                                            initialValue: ediDetails ? ediDetails.dataType : '',
                                        })(<AdSelect
                                            isExist={true}
                                            data={dataTypeList}
                                            onChange={value => { this.setState({ dataType: value }) }}
                                        />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            {dataType === 'ENUM' && <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={'枚举值'}>
                                        {getFieldDecorator('enumItemStr', {
                                            rules: [{ required: true }],
                                            initialValue: ediDetails ? ediDetails.enumItemStr : '',
                                        })(<AntdInput
                                            placeholder=""
                                        />)}
                                    </Form.Item>
                                </Col>
                            </Row>}
                            {ediDetails && (ediDetails.fieldName == 'range_right' || ediDetails.fieldName == 'range_left')
                                &&
                                <Row gutter={_gutter}>
                                    <Col {..._row}>
                                        <Form.Item label={'字段别名'}>
                                            {getFieldDecorator('fieldAliasName', {
                                                // rules: [{ required: true }],
                                            })(<Input disabled={disabled} rows={4} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>}
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={'是否允许为空'}>
                                        {getFieldDecorator('beEmpty', {
                                            rules: [{ required: true }],
                                            initialValue: this.state.beEmptyDisable ? 'no' : ediDetails ? ediDetails.beEmpty && 'yes' : '',
                                        })(<AdSelect
                                            disabled={!disabled ? this.state.beEmptyDisable : disabled}
                                            isExist={true}
                                            data={beEmptyList}
                                        />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={_gutter}>
                                <Col {..._row}>
                                    <Form.Item label={'备注'}>
                                        {getFieldDecorator('remarks', {
                                            // rules: [{ required: true }],
                                            initialValue: ediDetails ? ediDetails.remarks : '',
                                        })(<TextArea
                                            rows={4}
                                        />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </AdModal>
            </div>
        );
    }
}
