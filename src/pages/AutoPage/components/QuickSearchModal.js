import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, } from 'antd';
import { connect } from 'dva';
import AdModal from '@/components/AdModal';
import SearchSelect from '@/components/SearchSelect';
import styles from '@/pages/Operate.less';
import { conditionList } from '../utils'

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
const { MonthPicker } = DatePicker;

@Form.create()
export default class QuickSearchModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParams: localStorage.getItem(`${props.className}_searchParams`)? JSON.parse(localStorage.getItem(`${props.className}_searchParams`)) : {}
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            searchParams: localStorage.getItem(`${this.props.className}_searchParams`)? JSON.parse(localStorage.getItem(`${this.props.className}_searchParams`)) : {}
        })
    }
    saveInfo = () => {
        const { form, dispatch, searchList, modalEmpty, className } = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            searchList({ payload: { wrapper: [values] } });
            localStorage.setItem(`${className}_searchParams`, JSON.stringify(values))
            modalEmpty();
        });
    };
    modalEmpty = () =>{
        const { form, modalEmpty, searchList, className } = this.props;
        localStorage.setItem(`${className}_searchParams`, '{}')
        this.setState({
            searchParams: {}
        })
        form.resetFields();
        searchList({ payload: { wrapper: [] } });
        modalEmpty();
    }
    render() {
        const {
            form: { getFieldDecorator },
            visible,
            disabled,
            modalEmpty,
            columnsData,
            className
        } = this.props;
        const { searchParams,keyId } = this.state 
        const _gutter = { md: 8, lg: 24, xl: 48 };
        const _col = { md: 8, sm: 24 };
        const _row = { md: 24 };
        return (
            <AdModal
                visible={visible}
                title={'QuickSearch'}
                onOk={this.saveInfo}
                onCancel={this.modalEmpty}
                cancelText="重置"
                width="80%"
                style={{
                    maxWidth: 800,
                }}>
                <div className={styles.tableListForm}>
                    <Form layout="inline" key={keyId} >
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item>
                                    {getFieldDecorator('field', {
                                        initialValue: searchParams.field ? searchParams.field : '',
                                    })(
                                        <Select placeholder="属性" defaultValue={columnsData[0]?.title} /*onChange={(value) => { this.setState({ unit: value }) }} */ disabled={disabled}>
                                            {columnsData.map(v => {
                                                return <Option key={v.title}  value={v.dataIndex}>{v.title}</Option>;
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item>
                                    {getFieldDecorator('condition', {
                                        initialValue: searchParams.condition ? searchParams.condition : '',
                                    })(
                                        <Select  placeholder="条件" /*onChange={(value) => { this.setState({ unit: value }) }} */ disabled={disabled}>
                                            {conditionList.map(v => {
                                                return <Option key={v.code} value={v.code}>{v.value}</Option>;
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col {..._col}>
                                <Form.Item>
                                    {getFieldDecorator('value', {
                                        initialValue: searchParams.value ? searchParams.value : '',
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </AdModal>
        )

    }
}