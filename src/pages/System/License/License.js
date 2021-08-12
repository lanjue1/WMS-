import React, { Component, Fragment } from 'react';
import { Card, Select, Input, Upload, Icon, Button, Form, Modal, message, Divider } from 'antd';
import { connect } from 'dva';
import EditPage from '@/components/EditPage';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import AdSelect from '@/components/AdSelect';
import reqwest from 'reqwest';
import prompt from '@/components/Prompt';
import AdButton from '@/components/AdButton';
//import AdModal from '@/components/AdModal';
import { stringify } from 'qs';
import { codes } from './utils';
import { transferLanguage, getTimeDistance } from '@/utils/utils';
import AntdDatePicker from '@/components/AntdDatePicker'
import moment from 'moment'
import {
  formItemFragement,
} from '@/utils/common';
require('./Leadinport.less')



@connect(({ license, i18n }) => ({
  license,
  getCustomerList: license.getCustomerList,
  language: i18n.language,
  // formValues: leadInPort.formValues,
  // loading: loading.effects[allDispatchType.detail],
}))
@Form.create()
export default class License extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: '',
      customerType: [],
      customerInfo: [],
      key: 0,
      fileList: [],
      fileList2: [],
      visible: false,
      messages: [],
      excelUrl: 'license/exportLicense',
    }
  }
  componentDidMount() {
    // console.log(this.props)
  }

  // 上传文件
  uploadExcel = (e) => {
    // console.log(e)
    console.log('this.refs.pathClear.value', this.refs.pathClear.value)
    let fileList = this.refs.pathClear.value
    this.setState({
      fileList
    })

  }
  confirm = (type) => {
    const { fileList,fileList2 } = this.state;
    const {
      form, dispatch
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      
      if (err) {
        return prompt({ content: "请选择生效&失效时间", type: 'error' });
      }
    const {issuedTime,expiryTime, ...params } = values;
    params.issuedTime=moment(issuedTime).format('YYYY-MM-DD HH:mm:ss')
    params.expiryTime=moment(expiryTime).format('YYYY-MM-DD HH:mm:ss')
    const formData = new FormData();
    const _fileList=type=='servers'?fileList2:fileList
    console.log('进入这里444',fileList,_fileList, params)

    _fileList.forEach((file, index) => {
      formData.append(`file`, file);
      console.log('file', file, formData.get('file'))
    });
    console.log('进入这里333',_fileList,formData)

    this.setState({
      uploading: true,
    });
    reqwest({
      url: `/server/api/track-order/General/importExcel?${stringify(params)}`,
      method: 'post',
      processData: false,
      data: formData,
      headers: {
        token: localStorage.getItem('token'),
      },
      contentType: 'multipart/form-data',
      success: res => {
        const { code, message, data } = res;
        if (code == 0) {
          this.setState({
            messages: data.messages,
            // visible: true,
          });
          type=='servers'?this.setState({fileList2: []}):this.setState({fileList: []})
        } else {
          prompt({ content: message, type: 'error' });
        }
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        prompt({ content: '上传失败', type: 'error' });
      },
    });
  });
  }
  handleChangeUpdate = (info,type) => {
    // let a = info.file
    // let fileListTest = info.fileList.map(v => {
    //   v.__proto__ = a.__proto__
    //   return v
    // });
    // // 1. 限制上传数量
    // let _fileList = fileListTest.slice(0, 20);
    // console.log('handleChangeUpdate-info-', fileListTest, _fileList)
    this.setState({ fileList: info.fileList },()=>this.confirm(type))
    console.log('进入这里111',type,info)
    
  }
  render() {
    const { customerInfo, customerType, fileList, fileList2, excelUrl } = this.state;
    // const detail = {};
    const { form, language } = this.props;
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const formItem = [
      [
        <AntdFormItem
          label='生效时间'
          rules={[{ required: true }]}
          code="issuedTime"
          rules={[{ required: true }]}
          // initialValue={detail.customer}
          {...commonParams}
        >
          <AntdDatePicker showTime/>
        </AntdFormItem>,
        <AntdFormItem
          label='时效时间'
          rules={[{ required: true }]}
          code="expiryTime"
          // initialValue={detail.type}
          {...commonParams}
        >
          <AntdDatePicker showTime/>
        </AntdFormItem>,
      ]
    ];
    const editPageParams = {
      title: transferLanguage('expandFunction.field.InterfaceImport', language),
      // headerOperate: this.headerOperate(),
      panelValue: [{ key: '基础信息' }],
    };
    const propsFile = {
      // 点击移除图标
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      // onChange:(info)=> this.handleChangeUpdate(info,'license'),
      beforeUpload: file => {
        this.setState(state => ({
          // 显示所有上传的文件 fileList: [...state.fileList, file],
          fileList: [...state.fileList, file],
        }),()=>this.confirm('license'));
        return false;
      },
      fileList,
      multiple: true,
      accept: '.xls,.xlsx'
    };
    const propsFile2 = {
      // 点击移除图标
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList2: newFileList,
          };
        });
      },
      onChange:(info)=> this.handleChangeUpdate(info,'servers'),
      // onChange: this.handleChangeUpdate,
      beforeUpload: file => {
        this.setState(state => ({
          // 显示所有上传的文件 fileList: [...state.fileList, file],
          fileList2: [...state.fileList2, file],
        }));
        return false;
      },
      fileList: fileList2,
      multiple: true,
      accept: '.xls,.xlsx'
    };
    return (
      <div>
        <EditPage {...editPageParams}>
          <div style={{ marginTop: 80, height: 400 }}>
            <AntdForm>{formItemFragement(formItem)}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: 40 }}>
                <div style={{ flex: 1, marginLeft: 120, marginRight: 20 }}>
                  <div style={{ marginBottom: 16 }}>
                    <p>下载原始license</p>
                    <Button type='primary'>
                      <a href={`http://${window.location.host}/server/api/license/exportLicense`} download>
                        下载
                  </a>
                    </Button>
                  </div>
                  <Divider dashed/>
                  <p>上传License</p>
                  <div style={{ position: 'relative' }}>
                    <Upload {...propsFile} >
                      <Button type='primary' style={{ width: 120 }}>
                        <Icon type="upload" /> 上传License
                    </Button>
                    </Upload>
                    <div style={{ position: 'absolute', left: 120, top: 0 }}>
                      <Upload {...propsFile2} >
                        <Button type='' style={{ width: 120, backgroundColor: '#67C23A', color: 'white' }}>
                          <Icon type="upload" /> 上传到服务器
                    </Button>
                      </Upload>
                    </div>
                  </div>
                  {/* <p style={{ color: 'red', marginTop: 12, marginbottom: 0 }}>
                    （提示：支持 .xls,.xlsx 格式文件）
                    </p> */}
                </div>
              </div>
            </AntdForm>
          </div>
        </EditPage>
      </div>

    )
  }
}
