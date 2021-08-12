import React, { Component } from 'react';
import { connect } from 'dva';
import moment, { isDate } from 'moment';
import router from 'umi/router';
import Media from 'react-media';
import {
  Modal,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Collapse,
  DatePicker,
  Upload,
  PageHeader,
  Divider,
  Table,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import AdButton from '@/components/AdButton';
import styles from '@/pages/Operate.less';
// import SearchSelect from '@/components/SearchSelect';
import AntdSelectRegion from '@/components/AntdSelectRegion';
import { transferLanguage } from '@/utils/utils';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
let VehicleAarr = ['code', 'name', 'bizType', 'parentName', 'remarks'];
@connect(({ tmsOrg, common }) => ({
  tmsOrg,
  ownCompany: common.ownCompany,
  dictObject: common.dictObject,
}))
@Form.create()
export default class UpdateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: '',
      activeKey: ['1', '2'],
      organizations: [],
      disabled: false,
    };
  }
  componentDidMount() {
    // console.log('update', this.props);
    const { dispatch, dictObject } = this.props;
    const ID = this.props.match ? this.props.match.params.id : '';

    this.setState({
      currentId: ID,
    });
    if (ID) {
      this.getSelectDetails(ID);
    } else {
      this.props.form.resetFields(VehicleAarr);
    }
  }

  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'tmsOrg/selectDetails',
      payload: { id: ID },
    });
  };

  componentWillReceiveProps(nextProps) {}
  //保存基本信息：
  saveBasicInfo = e => {
    e.stopPropagation();
    const { currentId, organizations } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const { parentId, ...value } = values;

      value.parentId = parentId.length && parentId.length > 0 ? parentId[parentId.length - 1] : '';

      //编辑时传入id
      if (currentId) {
        value.id = currentId;
      }
      this.props.dispatch({
        type: 'tmsOrg/orgOperate',
        payload: value,
        callback: res => {
          this.setState(preState => ({
            disabled: !preState.disabled,
          }));
          if (res.data) {
            this.setState({
              currentId: res.data, //新增成功，获取id
            });
          }
        },
      });
    });
  };

  callback = key => {
    // console.log(key);
    this.setState({
      activeKey: key,
    });
  };
  getValueOrg = values => {
    this.setState({
      organizations: values,
    });
  };

  render() {
    const { currentId, vehicleDriver, disabled, organizations } = this.state;
    let selectDetails = {};
    if (currentId) {
      selectDetails = this.props.tmsOrg.selectDetails[currentId];
    }
    const checkDisabled = selectDetails && Object.keys(selectDetails).length > 0 ? true : false;
    const {
      form: { getFieldDecorator },
      ownCompany,
      tmsOrg: {},
      dictObject,
    } = this.props;
    const vehicleList = [];
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{currentId ? transferLanguage('OrgList.field.editOrg', this.props.language) : transferLanguage('OrgList.field.addOrg', this.props.language)}</span>
        {disabled ? (
          <AdButton
            type="primary"
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text={transferLanguage('OrgList.field.edit', this.props.language)}
          />
        ) : (
          <Button.Group>
            <Button type="primary" onClick={e => this.saveBasicInfo(e)}>
            {transferLanguage('OrgList.field.save', this.props.language)}
            </Button>
            {currentId && (
              <AdButton
                onClick={() => {
                  this.setState(preState => ({
                    disabled: !preState.disabled,
                  }));
                }}
                text={transferLanguage('OrgList.field.cancel', this.props.language)}
              />
            )}
          </Button.Group>
        )}
      </div>
    );
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };
    const columnsOrg = [
      {
        title: transferLanguage('OrgList.field.code', this.props.language),
        dataIndex: 'code',
        width: '33.3%',
      },
      {
        title: transferLanguage('OrgList.field.name', this.props.language),
        dataIndex: 'name',
        width: '33.3%',
      },
      // {
      //   title: '业务类型',
      //   dataIndex: 'bizType',
      // },
      {
        title: transferLanguage('OrgList.field.parentName', this.props.language),
        dataIndex: 'parentName',
        width: '33.3%',
      },
    ];

    const _gutter = { md: 8, lg: 24, xl: 48 };
    const _col = { md: 12, sm: 24 };
    const _row = { md: 24 };

    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <Collapse
            activeKey={this.state.activeKey}
            onChange={key => this.callback(key)}
            bordered={false}
          >
            <Panel header={transferLanguage('OrgList.field.baseInfo', this.props.language)} key="1" style={customPanelStyle}>
              <div className={styles.tableListForm}>
                <Form layout="inline">
                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('OrgList.field.code', this.props.language)}>
                        {getFieldDecorator('code', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.code : undefined,
                        })(<Input placeholder="请输入组织编码" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('OrgList.field.name', this.props.language)}>
                        {getFieldDecorator('name', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.name : undefined,
                        })(<Input placeholder="请输入组织名称" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={_gutter}>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('OrgList.field.bizType', this.props.language)}>
                        {getFieldDecorator('bizType', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.bizType : undefined,
                        })(<Input placeholder="请输入业务类型" disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                    <Col {..._col}>
                      <Form.Item label={transferLanguage('OrgList.field.parentName', this.props.language)}>
                        {getFieldDecorator('parentId', {
                          rules: [{ required: true, message: '请输入' }],
                          initialValue: selectDetails ? selectDetails.parentIds : undefined,
                        })(
                          <AntdSelectRegion
                            url="mds-organization/selectFirstOrg"
                            paramsLabel="id"
                            label="name"
                            filter={false}
                            isParent={true}
                            split="/"
                            disabled={disabled}
                          />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={_gutter}>
                    <Col {..._row}>
                      <Form.Item label={transferLanguage('OrgList.field.remark', this.props.language)}>
                        {getFieldDecorator('remarks', {
                          initialValue: selectDetails ? selectDetails.remarks : '',
                        })(<TextArea rows={4} disabled={disabled} />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Panel>
          </Collapse>
        </PageHeaderWrapper>
      </div>
    );
  }
}
