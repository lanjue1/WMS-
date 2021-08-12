import React, { Component, Fragment } from 'react';
import { Icon, Modal, Upload, Button, Form,Select } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import reqwest from 'reqwest';
import prompt from '@/components/Prompt';
import AntdForm from '@/components/AntdForm';
import AntdFormItem from '@/components/AntdFormItem';
import { columnsIC } from '@/pages/Common/common';
import { formItemFragement, queryDict ,formatPrice} from '@/utils/common';
import SearchSelect from '@/components/SearchSelect';
import { transferLanguage } from '@/utils/utils';



const confirm = Modal.confirm;
@connect(({ component, i18n }) => ({
  component,
  language: i18n.language
}))
@Form.create()
export default class FileImportPlus extends Component {
  static propTypes = {
    visibleFile: PropTypes.bool,
    urlImport: PropTypes.string,
    urlQuery: PropTypes.array,
    accept: PropTypes.string,
    queryData: PropTypes.array,
  };

  static defaultProps = {
    visibleFile: false,
    urlImport: '',
    urlQuery: [],
    queryData: [],
    accept: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileList2:[],
      uploading: false,
      ICCards: [],
     
    };
  }
  getValue = (values,type) => {
    
    this.setState({
      [type]: values,
    });
  }
  handleUpload = () => {
    const { fileList ,ICCards} = this.state;
    const { urlImport, urlQuery, queryData, downloadFile, callData } = this.props;
    let ICCard=''
    ICCards.forEach(v=>ICCard=v.id)
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
    });
    
    this.setState({
      uploading: true,
    });
    // formData.icCardId=ICCards
    formData.append('icCardId', ICCard);
    
    reqwest({
      url: `/server/api/${urlImport}`,
      method: 'post',
      processData: false,
      data: formData,
      headers: {
        token: localStorage.getItem('token'),
      },
      contentType: 'multipart/form-data',
      success: res => {
        const { code, message } = res;
        this.setState({
          uploading: false,
        });
        if (code == 0) {
          this.setState({
            fileList: [],
          });
          this.handleCancel();
          prompt({ content: '上传成功' });

          // this.dispatchFun(urlQuery);
          this.query(queryData);
          if (callData) {
            callData(res);
          }

          //导入成功后下载
          downloadFile &&
            downloadFile.flag &&
            confirm({
              title: '信息',
              content: downloadFile.content,
              okText: '确认',
              cancelText: '取消',
              onOk: () => {
                const url = `/server/api/${downloadFile.url}?path=${
                  res.data
                }&token=${localStorage.getItem('token')}`;
                window.open(url);
              },
            });
        } else {
          prompt({ content: message, type: 'error' });
        }
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        prompt({ content: '上传失败' });
      },
    });
  };

  dispatchFun = url => {
    const { dispatch } = this.props;
    if (Array.isArray(url) && url.length > 0) {
      url.map(v => {
        v &&
          dispatch({
            type: 'component/queryComponentList',
            payload: { params: v.payload, url: v.url },
          }); 
              });
    }
  };
  query = val => {
    const { dispatch } = this.props;
    if (Array.isArray(val) && val.length > 0) {
      val.map(fun => {
        fun();
      });
    }
  };

  handleCancel = () => {
    const { handleCancel } = this.props;
    this.setState({
      fileList: [],
    });
    handleCancel();
  };

  render() {
    const { 
      visibleFile, urlCase,urlCase2, accept, extra ,isICCard,form:{getFieldDecorator},
      isPlus, language
      } = this.props;
    const { uploading, fileList,ICCards } = this.state;

    const propsFile = {
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
      beforeUpload: file => {
        if (accept) {
          const name = file.name;
          const fileext = name ? name.substring(name.lastIndexOf('.'), name.length) : '';
          if (accept.indexOf(fileext) != -1) {
            this.setState(state => ({
              fileList: [file],
            }));
          } else {
            prompt({
              content: `${transferLanguage('Modal.field.fileErrorPrefix', language)}：${accept} ${transferLanguage('Modal.field.fileErrorSuffix', language)}`,
              type: 'error',
            });
          }
        } else {
          this.setState(state => ({
            fileList: [...state.fileList, file],
          }));
        }
        return false;
      },
      fileList,
      accept,
    };
    const commonParams = {
      getFieldDecorator,
    };
    const formItem=[
      [
        <AntdFormItem
          label="IC卡"
          code="driverIds"
          initialValue={ICCards}
          rules={[{ required: true }]}
          {...commonParams}
        >
          <SearchSelect 
            dataUrl="mds-ic-card/selectMdsIcCardList"
            url=""
            multiple={false} // 是否多选
            selectedData={ICCards} // 选中值
            columns={columnsIC} // 表格展示列
            onChange={val => this.getValue(val, 'ICCards')} // 获取选中值
            id="ICCardOperate_2"
            disabled={false}
            allowClear={true}
            // scrollX={350}
            
            payload={{ type :isPlus?'PREPLAN':'ORIGINAL' }} //PREPLAN是预配 的参数 ，ORIGINAL是原始的参数
          />
        </AntdFormItem>,
      ],
    ]

    return (
      <Fragment>
        {visibleFile && (
          <Modal
            title="导入数据"
            visible={visibleFile}
            onOk={this.handleUpload}
            onCancel={this.handleCancel}
            width={620}
            style={{ top: 20 }}
            destroyOnClose={true}
            confirmLoading={uploading}
          >
            {urlCase && (
              <div style={{ marginBottom: 16 }}>
                <a href={`http://${window.location.host}/${urlCase}`} download>
               下载模板
                </a>
                &nbsp;&nbsp;&nbsp;
                {urlCase2&&(
                  <a href={`http://${window.location.host}/${urlCase2}`} download>
                下载模板
                </a>
                )}
              </div>
            )
           
            }

            <div >
            <Upload {...propsFile}>
              <Button>
                 <Icon type="upload" /> 附件
              </Button>
            </Upload>
           <div style={{marginLeft:'-70px',marginTop:'20px'}} >
           {isICCard&&
              <AntdForm>{formItemFragement(formItem)}</AntdForm>
            }
            </div>
            </div>
           
            {accept && (
              <p style={{ color: 'red', marginTop: 12, marginbottom: 0 }}>
                （提示：支持 {accept} 格式文件）
              </p>
            )}
            {extra && <div>{extra}</div>}
          </Modal>
        )}
      </Fragment>
    );
  }
}
