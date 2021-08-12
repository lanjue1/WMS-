import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import styles from '@/pages/Operate.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
@connect(({ dynamicTableVersions, component, i18n }) => ({
    dynamicTableVersions,
    dictObject: component.dictObject,
    language: i18n.language,
    dy_fieldList: dynamicTableVersions.dy_fieldList
}))
@Form.create()
export default class TableVersionsFiledsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drivers: [],
            driverType: 'HW01',
            unit: 'check',
            worker: []
        };
    }

    componentDidMount() {
        console.log('dy_fieldList', this.props.dy_fieldList)
    };

    getValue = (values, type) => {
        this.setState({
            [type]: values,
        });
    };

    saveInfo = () => {
        const { form, dispatch, detail, formValues, modalEmpty, ruleTableVersionId, tableName, ediDetails } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            let param = {
                ruleTableVersionId,
                tableName,
                dataList: values
            }
            if (ediDetails) {
                param.id = ediDetails.id
            }
            dispatch({
                type: 'dynamicTableVersions/operationTableData',
                payload: param,
                callback: () => {
                    modalEmpty();
                }
            })
        });
    };


    render() {
        const { drivers, driverType, worker } = this.state;
        const {
            form: { getFieldDecorator },
            visible,
            disabled,
            modalEmpty,
            dy_fieldList,
            language,
            tableName,
            ediDetails
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
                    title={ediDetails ? '编辑动态数据' : '添加动态数据'}
                    onOk={this.saveInfo}
                    onCancel={() => {
                        modalEmpty();
                    }}
                    width="80%"
                    style={{
                        maxWidth: 600,
                    }}
                >
                    <div className={styles.tableListForm}>
                        <Form layout="inline">
                            {dy_fieldList[tableName].map((filed) => {
                                return filed.fieldName === '#' ? '' : (<Row gutter={_gutter}>
                                    <Col {..._row}>
                                        {filed.dataType === 'ENUM' ? <Form.Item label={filed.fieldAliasName || filed.fieldName}>
                                            {getFieldDecorator(filed.fieldName, {
                                                initialValue: ediDetails ? ediDetails[filed.fieldName] : '',
                                                rules: [{ required: !filed.beEmpty, message: '请输入' }],
                                            })(<Select>{filed.enumItemStr.split('/').map(v => (<Option key={v} value={v} >{v}</Option>))}</Select>)}
                                        </Form.Item> : <Form.Item label={filed.fieldAliasName || filed.fieldName}>
                                                {getFieldDecorator(filed.fieldName, {
                                                    initialValue: ediDetails ? ediDetails[filed.fieldName] : '',
                                                    rules: [{ required: !filed.beEmpty, message: '请输入' }],
                                                })(<Input disabled={disabled} rows={4} />)}
                                            </Form.Item>}
                                    </Col>
                                </Row>)
                            })}
                        </Form>
                    </div>
                </AdModal>
            </div>
        );
    }
}
