import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Button, Icon, Input } from 'antd';
import moment from 'moment';
import { editGutter, listCol } from '@/utils/constans';
import AdButton from '@/components/AdButton';
import styles from './index.less';
import { transferLanguage } from '@/utils/utils';
import { connect } from 'dva';
import AntdFormItem from '@/components/AntdFormItem';

const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
@connect(({ i18n }) => ({
  language: i18n.language
}))
export default class SelectForm extends Component {
  state = {
    expandForm: false,
  };
  toggleForm = () => {
    const { expandForm } = this.state;
    const { toggleForm } = this.props;
    console.log(this.props)
    if (toggleForm) toggleForm(!expandForm);
    this.setState({
      expandForm: !expandForm,
    });
    // this.handleFormReset()
  };

  handleFormReset = () => {
    const { form: { getFieldValue }, form, handleFormReset, customSearch } = this.props;
    form.resetFields();
    handleFormReset();
  };
  setOperate = (values) => {
    const { customSearch } = this.props
    let formItem = customSearch?.map((v, index) => {
      if (!values[v.code]) {
        return
      }
      switch (v.type) {
        case 'date':
          values[v.code] = moment(values[v.code]).format(dateFormat)
          break;
        case 'dateRange':
          values[v.param1] = moment(values[v.code][0]).format(dateFormat)
          values[v.param2] = moment(values[v.code][1]).format(dateFormat)
          delete values[v.code]
          break;
        default:
          break;
      }
    })
    return values
  }
  handleSearch = e => {
    e.preventDefault();
    const { form, handleSearch, queryParams, customSearch } = this.props;
    //远程下来框取值
    let arrCallselect;
    if (customSearch && customSearch.length) {
      arrCallselect = customSearch.filter((item) => {
        if (item.type == "callSelect") {
          return item;
        }
      })
    }
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        queryParams: queryParams,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      if (customSearch && customSearch.length) {
        arrCallselect.forEach(item => {
          if (fieldsValue[item.code] && fieldsValue[item.code].length) {
            values[item.code] = fieldsValue[item.code][0].id
          } else {
            values[item.code] = undefined;
          }
        });
      }
      this.setOperate(values)
      handleSearch(values);
    });
  };

  operatorButtons = ({ value, textAlign, }) => {
    const { code, handleFormReset, otherFormItem, customSearch } = this.props;
    const marginLeft = { marginLeft: 8 };
    //当存在值得时候 显示展开收起按钮
    let isCustomSearch = customSearch && customSearch.length > 0;
    // console.log('otherFormItem',otherFormItem,Boolean(otherFormItem))
    return (
      <Col {...listCol} style={{ textAlign }}>
        <span className={styles.submitButtons}>
          <Button.Group>
            <AdButton type="primary" htmlType="submit" text={transferLanguage('base.prompt.search', this.props.language)} code={code} />
            {handleFormReset && <AdButton onClick={this.handleFormReset} text={transferLanguage('base.prompt.reset', this.props.language)} code={code} />}
          </Button.Group>
          {/* {otherFormItem && ( */}
          {
            isCustomSearch && <a style={marginLeft} onClick={this.toggleForm}>
              {value} <Icon type={`${value === transferLanguage('base.prompt.Expand', this.props.language) ? 'down' : 'up'}`} />
            </a>
          }
          {/* )} */}
        </span>
      </Col>
    );
  };
  renderSimpleForm() {
    const { firstFormItem, secondFormItem, otherFormItem, quickQuery, width, form: { getFieldDecorator } } = this.props;
    const commonParams = { getFieldDecorator };
    let components = (
      <Form onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
        <Row hidden={!quickQuery} gutter={editGutter}>
          <Col {...listCol}>
            <AntdFormItem label={transferLanguage('base.condition.quickSearch', this.props.language)}
              width={width}
              code='keyWord'
              {...commonParams}
            >
              <Input placeholder="" />
            </AntdFormItem>
          </Col>
          {this.operatorButtons({ value: transferLanguage('base.prompt.Expand', this.props.language), textAlign: 'left', quickQuery })}
        </Row>
        <Row hidden={quickQuery} gutter={editGutter}>
          <Col {...listCol}>{firstFormItem}</Col>
          {secondFormItem && <Col {...listCol}>{secondFormItem}</Col>}
          {this.operatorButtons({ value: transferLanguage('base.prompt.Expand', this.props.language), textAlign: 'left', quickQuery })}
        </Row>
      </Form>
    );
    return components
  }

  renderAdvancedForm() {
    const { otherFormItem, firstFormItem, secondFormItem } = this.props;
    const coll = {
      labelCol: { span: 12 },
      wrapperCol: { span: 12 },
    }
    return (
      // listCol = { md: 8, sm: 24 };
      <Form onSubmit={this.handleSearch} layout="inline" className="cus_searchFrom">
        <Row gutter={editGutter}>
          <Col {...listCol} >{firstFormItem}</Col>
          {secondFormItem && <Col {...listCol}>{secondFormItem}</Col>}
          {otherFormItem && <Col {...listCol}>{otherFormItem[0][0]}</Col>}
          {(!otherFormItem || otherFormItem.length === 0) && this.operatorButtons({ value: transferLanguage('base.prompt.Collapse', this.props.language), textAlign: 'left', otherFormItem })}
        </Row>
        {otherFormItem && otherFormItem.map((row, rowId) => {
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
                            value: transferLanguage('base.prompt.Collapse', this.props.language),
                            textAlign: 'right',
                            otherFormItem,
                          })}
                        </Fragment>
                      ) : (
                        this.operatorButtons({ value: transferLanguage('base.prompt.Collapse', this.props.language), textAlign: 'left', otherFormItem })
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
    const { className, customSearch } = this.props;
    return (
      <div className={className}>
        {expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()}
      </div>
    );
  }
}
