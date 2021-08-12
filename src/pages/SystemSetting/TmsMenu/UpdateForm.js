import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment, { isDate } from 'moment';
import router from 'umi/router';
import AdButton from '@/components/AdButton';
import Media from 'react-media';
import { editCol, editGutter, editRow } from '@/utils/constans';

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
  TreeSelect,
  Radio,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditPage from '@/components/EditPage';
import AntdInput from '@/components/AntdInput';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AntdSelect from '@/components/AntdSelect';
import StandardTable from '@/components/StandardTable';
// import AntdTreeSelect from '@/components/AntdTreeSelect';
import AntdSelectRegion from '@/components/AntdSelectRegion';
import styles from '@/pages/Operate.less';
import { menuTypeData,pageType } from './utils';
import { transferLanguage } from '@/utils/utils';


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;
const dateFormat = 'YYYY-MM-DD';
let VehicleAarr = [
  'cartPlateTypeOne',
  'cartPlateTypeTwo',
  'cartPlateOneNo',
  'cartPlateTwoNo',
  'ownCompanyId',
  'property',
  'category',
  'cartType',
  'remarks',
];
@connect(({ tmsMenu, common }) => ({
  tmsMenu,
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
      menuList: [],
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
    // this.getMenuList();
  }

  //详情信息：
  getSelectDetails = ID => {
    this.props.dispatch({
      type: 'tmsMenu/selectDetails',
      payload: { id: ID },
    });
  };

  componentWillReceiveProps(nextProps) { }
  headerOperate = () => {
    const { disabled, currentId } = this.state;
    return disabled ? (
      <AdButton
        type="primary"
        onClick={() => {
          this.setState(preState => ({
            disabled: !preState.disabled,
          }));
        }}
        text={transferLanguage('MenuList.field.edit', this.props.language) }
      />
    ) : (
        <Button.Group>
          <AdButton type="primary" onClick={e => this.saveInfo(e)} text={transferLanguage('MenuList.field.save', this.props.language) } />
          {currentId && (
            <AdButton
              onClick={() => {
                this.setState(preState => ({
                  disabled: !preState.disabled,
                }));
              }}
              text={transferLanguage('MenuList.field.cancel', this.props.language) }
            />
          )}
        </Button.Group>
      );
  };
  saveInfo = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const { currentId } = this.state;
      const { parentId, ...value } = values;
      if (currentId) {
        value.id = currentId;
      }
      value.parentId = parentId && parentId.length > 0 ? parentId[parentId.length - 1] : '';
      // console.log('value--',value)
      this.props.dispatch({
        type: 'tmsMenu/menuOperate',
        payload: value,
        callback: data => {
          // this.setState(preState => ({
          //   disabled: !preState.disabled,
          // }));
          this.detailCallback(data);
        },
      });
    });
  };

  detailCallback = res => {
    const { dispatch } = this.props;
    dispatch({
      type: 'tmsMenu/selectDetails',
      payload: { id: res },
      callback: data => {
        if (!data) return;
        this.setState(preState => ({
          disabled: !preState.disabled,
        }));
        dispatch({
          type: 'common/setTabsName',
          payload: {
            id: res,
            // name: data.oilNo,
            isReplaceTab: true,
          },
          callback: result => {
            if (result) {
              router.push(`/system/MenuList/edit-form/${res}`);
            }
          },
        });
      },
    });
  };
  getValue = (values,type) => {
    this.setState({
      [type]:values
    })
  }
  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  render() {
    const { currentId, vehicleDriver, disabled, menuList,type } = this.state;
    const {
      form: { getFieldDecorator },
      ownCompany,
      tmsMenu: { driverList, selectAllMenuList, selectDetails },
      dictObject,
    } = this.props;
    const details = currentId ? selectDetails[currentId] : {};
    const checkDisabled = details && Object.keys(details).length > 0 ? true : false;
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      border: 0,
      overflow: 'hidden',
    };

    const editPageParams = {
      title: currentId ? transferLanguage('MenuList.field.editMenu', this.props.language) : transferLanguage('MenuList.field.addMenu', this.props.language),
      headerOperate: this.headerOperate(),
      panelTitle: [transferLanguage('MenuList.field.baseInfo', this.props.language) ],
    };

    const commonParams = {
      getFieldDecorator,
    };
    const formItem = [
     
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.type', this.props.language) }
          code="type"
          initialValue={details ? details.type : undefined}
          {...commonParams}
        >
          <AntdSelect
            data={menuTypeData}
            disabled={disabled}
            onChange={(val)=>this.getValue(val,'type')}
            show={{ id: 'code', name: 'value' }}
          />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.parentId', this.props.language) }
          code="parentId"
          initialValue={details ? details.allParentIds : undefined}
          {...commonParams}
        >
          {/* <AntdTreeSelect dataUrl="mds-menu/selectAllMenuList" /> */}
          <AntdSelectRegion
            url="mds-menu/selectFirstMenu"
            paramsLabel="id"
            label="name"
            filter={false}
            isParent={true}
            // disabled={disabled}
            split="/"
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.sort', this.props.language) }
          code="sort"
          initialValue={details ? details.sort : undefined}
          {...commonParams}
        >
          <Input disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.pageType', this.props.language) }
          code="pageType"
          initialValue={details ? details.pageType : undefined}
          {...commonParams}
        >
          <AntdSelect
            data={pageType}
            disabled={disabled}
            show={{ id: 'code', name: 'value' }}
          />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.code', this.props.language) }
          code="code"
          rules={[{ required: true }]}
          initialValue={details ? details.code : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.name', this.props.language) }
          code="name"
          rules={[{ required: true }]}
          initialValue={details ? details.name : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
     
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.path', this.props.language) }
          code="path"
          rules={[{ required:  type=='MENU'||type=='PAGE'? true:false }]}
          initialValue={details ? details.path : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.pathName', this.props.language) }
          code="pathName"
          rules={[{ required: type=='MENU'||type=='PAGE'? true:false }]}
          initialValue={details ? details.pathName : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
     
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.component', this.props.language) }
          code="component"
          rules={[{ required: type=='PAGE'? true:false }]}
          initialValue={details ? details.component : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.hideInMenu', this.props.language) }
          code="hideInMenu"
          rules={[{ required: type=='PAGE'? true:false}]}
          initialValue={details ? details.hideInMenu : undefined}
          {...commonParams}
        >
           <Radio.Group
                  
            >
              <Radio value="false" disabled={disabled}>{transferLanguage('MenuList.field.no', this.props.language) }</Radio>
              <Radio value="true" disabled={disabled}>{transferLanguage('MenuList.field.is', this.props.language) }</Radio>
          </Radio.Group>
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.path', this.props.language) }
          code="path"
          // rules={[{ required: true }]}
          initialValue={details ? details.path : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.pathName', this.props.language) }
          code="pathName"
          // rules={[{ required: true }]}
          initialValue={details ? details.pathName : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.component', this.props.language) }
          code="component"
          // rules={[{ required: true }]}
          initialValue={details ? details.component : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.hidden', this.props.language) }
          code="hideInMenu"
          // rules={[{ required: true }]}
          initialValue={details.hideInMenu ? details.hideInMenu :"false"}
          // initialValue={details ? details.hideInMenu : false}
          {...commonParams}
        >
          <Radio.Group

          >
            <Radio value="false" disabled={disabled}>{transferLanguage('MenuList.field.no', this.props.language) }</Radio>
            <Radio value="true" disabled={disabled}>{transferLanguage('MenuList.field.is', this.props.language) }</Radio>
          </Radio.Group>
        </AntdFormItem>,
      ],

      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.url', this.props.language) }
          code="url"
          initialValue={details ? details.url : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.trueUrl', this.props.language) }
          code="trueUrl"
          initialValue={details ? details.trueUrl : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.icon', this.props.language) }
          code="icon"
          rules={[{ required: true }]}
          initialValue={details ? details.icon : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
        <AntdFormItem
          label={transferLanguage('MenuList.field.clazz', this.props.language) }
          code="clazz"
          initialValue={details ? details.trueUrl : undefined}
          {...commonParams}
        >
          <AntdInput disabled={disabled} />
        </AntdFormItem>,
      ],
      [
        <AntdFormItem
          label={transferLanguage('MenuList.field.remark', this.props.language) }
          code="remarks"
          initialValue={details ? details.remarks : undefined}
          {...commonParams}
        >
          <AntdInput mode="area" disabled={disabled} />
        </AntdFormItem>,
      ],
    ];
    return (
      <EditPage {...editPageParams}>
        <AntdForm>
          {formItem.map((item, index) => {
            return (
              <Row gutter={editGutter} key={index}>
                {item.map((v, i) => {
                  const colSpan = item.length === 1 ? editRow : editCol;
                  return (
                    <Col {...colSpan} key={index + i}>
                      {v}
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </AntdForm>
      </EditPage>
    );
  }
}
