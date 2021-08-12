import React, { Component, Fragment } from 'react';
import { Modal, Upload, Icon } from 'antd';
import prompt from '@/components/Prompt';
import { checkSuffix } from '@/pages/Common/common';

export default class AntdUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      deleteFileIds: [],
      fileList: [],
    };
    this.beforeUpload = this.beforeUpload.bind(this);
  }

  getRandomCode = (length = 16) => {
    let code = '';
    const codeBasicString = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const maxNum = codeBasicString.length + 1;
    for (let i = 0; i < length; i += 1) {
      code += codeBasicString.charAt(Math.floor(Math.random() * maxNum));
    }
    return code;
  };

  randomUploadImgKey = uploadImgName => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDay() + 1;
    const imgPostfix = uploadImgName ? uploadImgName.split('.').pop() : '';
    return `${year}/${month}/${day}/${this.getRandomCode()}.${imgPostfix}`;
  };
  beforeUpload(file) {
    const _key = this.randomUploadImgKey(file.name);
    this.setState({
      key: _key,
    });
  }

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handlePreview = file => {
    const checkFile = checkSuffix(file.name);
    if (file.name && !checkFile) {
      window.open(file.url);
      return;
    }
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('======nextProps.fileList', nextProps.fileList);
    const { actionName } = nextProps;
    if (nextProps.fileList && nextProps.fileList.length > 0) {
      const fileList = nextProps.fileList.map(file => {
        if (!file.fileUrl) {
          return file;
        }
        const { id, fileUrl } = file;
        const _readFile = actionName
          ? actionName + '/readFile'
          : '/server/api/tms/tms-attachment/readFile';

        let data = {
          uid: id,
          thumbUrl: `http://${
            window.location.host
          }${_readFile}?path=${fileUrl}&token=${localStorage.getItem('token')}`,
          // id,
          name: fileUrl.substring(fileUrl.lastIndexOf('\\') + 1, fileUrl.length),
          status: 'done',
          url: `http://${
            window.location.host
          }${_readFile}?path=${fileUrl}&token=${localStorage.getItem('token')}`,
          id,
        };
        if (file.fileUrl.substring(file.fileUrl.lastIndexOf('.'), file.fileUrl.length) === '.pdf') {
          data.type = 'application/pdf';
        }
        return data;
      });
      // fileList.push({
      //   id: '-1',
      //   uid: '-1',
      //   name: 'xxx.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // });
      this.setState({ fileList });
    }
  }

  handleChange = ({ fileList, file }) => {
    this.setState({ fileList });
    const { handleChange } = this.props;
    if (fileList.length === 0) {
      handleChange([]);
    }
    fileList.filter(file => {
      if (!file.response) {
        handleChange(fileList);
        return;
      }
      const { code, message } = file.response;
      if (code === 0) {
        handleChange(fileList);
        return file;
      } else {
        this.setState({ fileList: fileList.filter(oldFile => oldFile.uid !== file.uid) });
        handleChange(fileList.filter(oldFile => oldFile.uid !== file.uid));
        prompt({ type: 'error', title: 'Error', content: message });
      }
    });
  };

  onRemove = file => {
    if (file.response) return;
    const { deleteFileIds } = this.state;
    this.setState(
      {
        deleteFileIds: [...deleteFileIds, file.id],
      },
      () => {
        const { onRemove } = this.props;
        onRemove(this.state.deleteFileIds);
      }
    );
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { fileLength, actionName } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>上传</div>
      </div>
    );
    // console.log('---------', fileList);
    return (
      <Fragment>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Upload
          action={
            actionName ? actionName + '/uploadFile' : '/server/api/tms/tms-attachment/uploadFile'
          }
          headers={{ token: localStorage.getItem('token') }}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.onRemove}
          beforeUpload={this.beforeUpload}
          data={{
            key: this.state.key,
          }}
        >
          {fileList.length >= fileLength ? null : uploadButton}
        </Upload>
      </Fragment>
    );
  }
}
