import React, { Component, Fragment } from 'react';
import { Icon, Modal, Upload, Button, Form, Select } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import reqwest from 'reqwest';
import prompt from '@/components/Prompt';
import { transferLanguage } from '@/utils/utils';

const confirm = Modal.confirm;
@connect(({ component, i18n }) => ({
  component,
  language: i18n.language
}))
@Form.create()
export default class FileImport extends Component {
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
      fileList2: [],
      uploading: false,
    };
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const { urlImport, urlQuery, queryData, downloadFile, callData, importPayload, extra } = this.props;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
    });
    if (importPayload) {
      for (const key in importPayload) {
        if (importPayload.hasOwnProperty(key)) {
          formData.append(key, importPayload[key]);
        }
        if (!importPayload[key]) {
          prompt({ content: 'Please Select Options', type: 'warn' })
          return
        }
      }

    }
    // if(importPayload&&!importPayload.referenceBillType){
    //   prompt({content:'Please Select Business model',type:'warn'})
    //   return
    // }
    // if(importPayload&&!importPayload.consigner){
    //   prompt({content:'Please Select Consigner',type:'warn'})
    //   return
    // }
    // if(importPayload&&!importPayload.consignee){
    //   prompt({content:'Please Select Consignee',type:'warn'})
    //   return
    // }

    this.setState({
      uploading: true,
    });
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
        // const { code, message } = res;
        this.setState({
          uploading: false,
        });
        if (res && res.code == 0) {
          this.setState({
            fileList: [],
          });
          this.handleCancel();
          prompt({ content: 'Success' });

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
                const url = `/server/api/${downloadFile.url}?path=${res.data
                  }&token=${localStorage.getItem('token')}`;
                window.open(url);
              },
            });
        } else {
          prompt({ content: res?.message, type: 'error' });
        }
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        prompt({ content: 'Failed', type: 'error' });
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
    const { visibleFile, urlCase, urlCase2, accept, extra, language } = this.props;
    const { uploading, fileList, fileList2 } = this.state;
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

    return (
      <Fragment>
        {visibleFile && (
          <Modal
            title={transferLanguage('Modal.field.importData', language)}
            visible={visibleFile}
            onOk={this.handleUpload}
            onCancel={this.handleCancel}
            width={660}
            style={{ top: 20 }}
            destroyOnClose={true}
            confirmLoading={uploading}
            cancelText={transferLanguage('Common.field.cancel', language)}
            okText={transferLanguage('Common.field.ok', language)}
          >
            {extra && <div>{extra}</div>}
              
            {urlCase && (
              <div style={{ marginBottom: 16 }}>
                <a href={`https://${window.location.host}/server/api/${urlCase}${urlCase.indexOf('?') === -1 ? '?' : '&'}token=${localStorage.getItem('token')}`} download>
                  {transferLanguage('Modal.field.downForm', language)}
                </a>
                &nbsp;&nbsp;&nbsp;
                {urlCase2 && (
                  <a href={`https://${window.location.host}/server/api/${urlCase2}${urlCase.indexOf('?') === -1 ? '?' : '&'}token=${localStorage.getItem('token')}`} download>
                    {transferLanguage('Modal.field.downForm', language)}
                  </a>
                )}
              </div>
            )
            }
            <Upload {...propsFile}>
              <Button>
                <Icon type="upload" />{transferLanguage('Modal.field.envelope', language)}
              </Button>
            </Upload>
            {accept && (
              <p style={{ color: 'red', marginTop: 12, marginbottom: 0 }}>
                {/* （提示：支持 {accept} 格式文件） */}
                {" ( " + transferLanguage('Modal.field.fileFormats', language) + " : " + accept + " ) "}
              </p>
            )}
          </Modal>
        )}
      </Fragment>
    );
  }
}
