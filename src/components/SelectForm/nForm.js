import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Button, Icon } from 'antd';
import { editGutter,  } from '@/utils/constans';
import AdButton from '@/components/AdButton';
import styles from './index.less';

// @Form.create()
export default class SelectForm extends Component {
    state = {
        expandForm: false,
        listCol:{
            md: 8, sm: 24
        }
    };
    componentDidMount(){
        const { col }=this.props
        const { listCol}=this.state
        if(col){
            this.setState({listCol:col})
        }
    }
    toggleForm = () => {
        const { expandForm } = this.state;
        const { toggleForm } = this.props;
        if (toggleForm) toggleForm(!expandForm);
        this.setState({
            expandForm: !expandForm,
        });
    };

    handleFormReset = () => {
        const { form, handleFormReset } = this.props;
        form.resetFields();
        handleFormReset();
    };
    handleSearch = e => {
        e.preventDefault();
        const { form, handleSearch } = this.props;
        form.validateFields((err, fieldsValue) => {
             console.log('弹窗=form==',form)
            if (err) return;
            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };
            handleSearch(values);
        });
    };

    operatorButtons = ({ value, textAlign, otherFormItem }) => {
        const { code, handleFormReset } = this.props;
        const {listCol }=this.state
        const marginLeft = { marginLeft: 8 };
        return (
            <Col {...listCol} style={{ textAlign }}>
                <span className={styles.submitButtons}>
                    <Button.Group>
                        
                        <AdButton type="primary" htmlType="submit" text="查询" code={code} />

                        {handleFormReset && <AdButton onClick={this.handleFormReset} text="重置" code={code} />}
                    </Button.Group>
                    {otherFormItem && (
                        <a style={marginLeft} onClick={this.toggleForm}>
                            {value} <Icon type={`${value === '展开' ? 'down' : 'up'}`} />
                        </a>
                    )}
                </span>
            </Col>
        );
    };
    renderSimpleForm() {
        const { firstFormItem, secondFormItem, otherFormItem } = this.props;
        const {listCol }=this.state
        return (
            <Form   onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
                <Row gutter={editGutter}>
                    <Col {...listCol}>{firstFormItem}</Col>
                    {secondFormItem && <Col {...listCol}>{secondFormItem}</Col>}
                    {this.operatorButtons({ value: '展开', textAlign: 'left', otherFormItem })}
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        const { otherFormItem, firstFormItem, secondFormItem } = this.props;
        const {listCol }=this.state

        return (
            // listCol = { md: 8, sm: 24 };
            <Form onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
                <Row gutter={editGutter}>
                    <Col {...listCol}>{firstFormItem}</Col>
                    <Col {...listCol}>{secondFormItem}</Col>
                    <Col {...listCol}>{otherFormItem[0][0]}</Col>
                </Row>
                {otherFormItem.map((row, rowId) => {
                    if (rowId === 0) return;
                    return (
                        <Row gutter={editGutter} key={rowId}>
                            {row.map((col, colId) => {
                                return (
                                    <div key={`${rowId}-${colId}`}>
                                        {col === 'operatorButtons' ? (
                                            colId === 0 ? (
                                                <Fragment>
                                                    <Col {...listCol} />
                                                    <Col {...listCol} />
                                                    {this.operatorButtons({
                                                        value: '收起',
                                                        textAlign: 'right',
                                                        otherFormItem,
                                                    })}
                                                </Fragment>
                                            ) : (
                                                    this.operatorButtons({ value: '收起', textAlign: 'left', otherFormItem })
                                                )
                                        ) : (
                                                <Col {...listCol}>{col}</Col>
                                            )}
                                    </div>
                                );
                            })}
                        </Row>

                    );
                })}

            </Form>
        );
    }

    render() {
        const { expandForm } = this.state;
        const { className } = this.props;
        return (
            <div className={className}>
                {expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()}
            </div>
        );
    }
}
