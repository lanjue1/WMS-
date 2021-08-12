import React, { Component } from 'react';
import { Col, DatePicker, Form, Input, Row, Select, Icon, Divider } from 'antd';
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
export default class AdvancedQueryModal extends Component {
    state = {
        items: ['jack', 'lucy'],
        mouseChecked: '',
        editItem: '',
        defaultValue: '',
        searchParams: {}
    }
    saveInfo = () => {
        const { form, dispatch, searchList, modalEmpty, className } = this.props;
        const { mouseChecked, editItem } = this.state;

        form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            values['mouseChecked'] = mouseChecked
            values['editItem'] = editItem
            searchList({ payload: { wrapper: [values] } });
            localStorage.setItem(`${className}_advancedQueryParams`, JSON.stringify(values))
            modalEmpty();
        });
    };
    componentWillReceiveProps(nextProps) {
        let advancedQueryParams = localStorage.getItem(`${this.props.className}_advancedQueryParams`)? JSON.parse(localStorage.getItem(`${this.props.className}_advancedQueryParams`)) : {}
        let defaultValue=''
        if(advancedQueryParams.mouseChecked) defaultValue = advancedQueryParams.mouseChecked
        if(advancedQueryParams.editItem) defaultValue = advancedQueryParams.editItem

        this.setState({
            searchParams: advancedQueryParams,
            defaultValue: defaultValue
        })
    }
    modalEmpty = () =>{
        const { form, modalEmpty, searchList, className } = this.props;
        localStorage.setItem(`${className}_advancedQueryParams`, '{}')
        this.setState({
            mouseChecked: '',
            editItem: '',
            searchParams: {}
        })
        form.resetFields();
        searchList({ payload: { wrapper: [] } });
        modalEmpty();
    }
    // 新建查询
    addSearch = () => {
        this.setState({
            items: [...this.state.items, '']
        })
    }

    optionOperation = (e, type, item) => {
        e.stopPropagation()
        this.setState({
            [type]: item
        })
    }
    render() {
        const {
            form: { getFieldDecorator },
            visible,
            disabled,
            modalEmpty,
            columnsData
        } = this.props;
        const { items, mouseChecked, editItem, searchParams, defaultValue } = this.state
        const _gutter = { md: 8, lg: 24, xl: 48 };
        const _col = { md: 8, sm: 24 };
        const _row = { md: 24 };
        return (
            <AdModal
                visible={visible}
                title={(<Select style={{ width: '200px' }} defaultValue={defaultValue}
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div
                                style={{ padding: '4px 8px', cursor: 'pointer' }}
                                onMouseDown={e => e.preventDefault()}
                                onClick={this.addSearch}
                            >
                                <Icon type="plus-circle" /> Add search
                      </div>
                        </div>
                    )}
                >
                    {items.map(item => (
                        <Option onMouseOver={e => this.optionOperation(e, 'mouseChecked', item)} key={item} >
                            {editItem === item ? <Input style={{ width: '120px' }} defaultValue={item} /> : item}
                            {mouseChecked === item && <div style={{ float: 'right' }} >
                                <Icon type="edit" onClick={e => this.optionOperation(e, 'editItem', item)} style={{ marginRight: '10px' }} /> <Icon type="delete" />
                            </div>}
                        </Option>
                    ))}
                </Select>)}
                onOk={this.saveInfo}
                onCancel={this.modalEmpty}
                cancelText="重置"
                width="80%"
                style={{
                    maxWidth: 800,
                }}>
                <div className={styles.tableListForm}>
                    <Form layout="inline">
                        <Row gutter={_gutter}>
                            <Col {..._col}>
                                <Form.Item>
                                    {getFieldDecorator('field', {
                                        initialValue: searchParams.field ? searchParams.field : '',
                                    })(
                                        <Select placeholder="属性" defaultValue={columnsData[0]?.title} /*onChange={(value) => { this.setState({ unit: value }) }} */ disabled={disabled}>
                                            {columnsData.map(v => {
                                                return <Option key={v.title} value={v.dataIndex}>{v.title}</Option>;
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
                                        <Select placeholder="条件" /*onChange={(value) => { this.setState({ unit: value }) }} */ disabled={disabled}>
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