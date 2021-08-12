import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Button, Icon, Input } from 'antd';
import { editGutter, } from '@/utils/constans';
import AdButton from '@/components/AdButton';
import styles from './index.less';
import { transferLanguage } from '@/utils/utils';
import { connect } from 'dva';
const FormItem = Form.Item;
@connect(({ i18n }) => ({
    language: i18n.language
}))
export default class OneForm extends Component {
    state = {
        expandForm: false,
        listCol: {
            md: 8, sm: 24
        }
    };
    componentDidMount() {
        const { col } = this.props
        const { listCol } = this.state
        if (col) {
            this.setState({ listCol: col })
        }
    }
    handleFormReset = () => {
		const { form, handleFormReset } = this.props;
		form.resetFields();
		handleFormReset();
    };
    handleSearch = e => {
		e.preventDefault();
		const { form, handleSearch } = this.props;
		form.validateFields((err, fieldsValue) => {
			if (err) return;
			const values = {
				...fieldsValue,
			};
			handleSearch(values);
		});
	};
    operatorButtons = ({ value, textAlign, otherFormItem }) => {
        const { code } = this.props;
        const { listCol } = this.state
        const marginLeft = { marginLeft: 8 };
        return (
            <Col {...listCol} style={{ textAlign }}>
                <span className={styles.submitButtons}>
                    <Button.Group>
                        <AdButton type="primary" htmlType="submit" text={transferLanguage('base.prompt.search', this.props.language)} code={code} />
                        <AdButton onClick={this.handleFormReset} text={transferLanguage('base.prompt.reset', this.props.language)} code={code} />
                    </Button.Group>
                </span>
            </Col>
        );
    };
    render() {
        const { firstFormItem, secondFormItem } = this.props;
        const { listCol } = this.state
        return (
            <Form onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
                <Row gutter={editGutter}>
                    <Col {...listCol} >{firstFormItem}</Col>
                    {secondFormItem && <Col {...listCol}>{secondFormItem}</Col>}
                    {this.operatorButtons({ textAlign: 'left', })}
                </Row>

            </Form>
        )
    }
}