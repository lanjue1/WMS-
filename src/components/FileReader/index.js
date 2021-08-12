import React, { Component, Fragment } from 'react';
import { Modal, Icon, Row, Col, Spin, Button } from 'antd';
import Media from 'react-media';
import { connect } from 'dva';
import AdUpload from '@/components/AdUpload';
import { Document, Page } from 'react-pdf';
import Zmage from 'react-zmage';
import { queryFileList } from '@/utils/common';
import styles from './index.less';

@connect(({ component }) => ({
  isRightDrawOpen: component.isRightDrawOpen,
}))
class FileReader extends Component {
  static defaultProps = {
    urlType: 'ems',
  };

  constructor(props) {
    super(props);
    const { urlType, cusDownloadUrl, readNameUrl } = props;
    this.state = {
      visible: false,
      imageList: [],
      index: 0,
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      numPages: null,
      showPage: 1,
      scale: 1,
      showFile: false,
      imageHeight: document.body.clientHeight,
      imageWidth: document.body.clientWidth,
      showAllFile: false,
    };
    this.downloadName = cusDownloadUrl ? `${cusDownloadUrl}` : `attachment/downloadFile`;
    this.readName = readNameUrl ? `${readNameUrl}` : `attachment/viewpage`;
    this.otherHeight = 120;
    this.defaultPage = 4;
    this.footerHeight = props.isMobile ? -1 : 29;
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages, showPage: numPages >= this.defaultPage ? this.defaultPage : 1 });
  };

  resize = () => {
    this.setHeightAndWidth();
  };

  setHeightAndWidth = () => {
    const { showAllFile } = this.state;
    let clientHeight = document.body.clientHeight;
    if (showAllFile) clientHeight -= this.otherHeight;
    this.setState({
      clientHeight,
      imageHeight: clientHeight,
      clientWidth: document.body.clientWidth,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    const {fileList} =this.props
    fileList&&fileList.length>0&& this.setState({imageList:fileList})
  }

  queryFileList = params => {
    queryFileList({
      props: this.props,
      params,
      // url: `attachment/uploadFile`,
      // url:isEdit?``:'',
      callback: data => {
        if (!data) return;
        console.log('')
        this.setState({ imageList: data, index: 0 });
      },
    });
  };

  setValue = ({ imageList, index }) => {
    this.setState({ imageList, index });
  };

  onClick = () => {
    const { isRightDrawOpen, dispatch } = this.props;
    if (!isRightDrawOpen) return;
    dispatch({
      type: 'component/setRightDrawValue',
      payload: 'isRightDrawOtherOpen',
    });
  };
 
  changeVisible = () => {
    const { visible } = this.state;
    const { params, isRightDrawOpen, dispatch } = this.props;
    let isRightDrawOtherOpen = false;
    if (!visible) {
      params && this.queryFileList(params);
      setTimeout(this.resize, 500);
      isRightDrawOtherOpen = true;
    }
    if (isRightDrawOpen) {
      dispatch({
        type: 'component/setRightDrawValue',
        payload: {
          isRightDrawOtherOpen,
        },
      });
    }
    this.setState({ visible: !visible }, () => {
      if (!this.state.visible) {
        setTimeout(() => {
          this.setState({ imageList: [], index: 0 });
        }, 500);
      }
    });
  };

  handlePreview = (imageList, index) => {
    // console.log('imageList, index????',imageList, index)
    this.setValue({ imageList, index });
    this.changeVisible();
  };

  changePage = type => {
    const { imageList, index, clientHeight } = this.state;
    let newIndex = index;
    if (type === 'right') {
      newIndex += 1;
    } else {
      newIndex -= 1;
    }
    this.setState({
      index: newIndex,
      numPages: null,
      showFile: false,
    });
    this.refreshParams();
  };

  isImage = ({ list = [], newFile } = {}) => {
    const { imageList, index } = this.state;
    const file = newFile || imageList[index];
    const arr = ['.jpg', '.jpeg', '.png', '.gif', ...list];
    let name = file ? file.fileName || file.name : '';
    name = name ? name.substring(name.lastIndexOf('.'), name.length) : '';
    return arr.includes(name.toLowerCase());
  };

  // 下载
  download = () => {
    const { hasCompleteUrl } = this.props;
    const { imageList, index } = this.state;
    let loadUrl=this.getSrcArr(this.downloadName)[index].src
    if (hasCompleteUrl) {
      loadUrl = imageList[index].fileUrl;
    }
    window.location.href = loadUrl;
  };

  // download = (e, url) => {
  //   let urlNew = "";
  //   if (url) {
  //     urlNew = `http://${window.location.host}/server/api/api/Common/File/GetFile?vpath=${url}`
  //   } else {
  //     urlNew = this.getNewSrc();
  //   }
  //   window.location.href = urlNew;
  // };
  // getNewSrc = readName => {
  //   const { imageList, index } = this.state;
  //   const file = imageList[index];
  //   const fileUrl = file && file.fileUrl;
  //   const fileNewUrl = `http://${window.location.host}/server/api/api/Common/File/GetFile?vpath=${fileUrl}`;
  //   return fileNewUrl;
  // };

  getNewSrc =(readName)=> {
    const { imageList, index } = this.state;
    const { hasCompleteUrl } = this.props;
    const token = localStorage.getItem('token');
    const file = imageList[index];
    // let fileUrl = file && (file.url || file.thumbUrl);
    let fileNewUrl = '';
    const _readName='attachment/downloadFile'
    fileNewUrl =
      file &&
      `${window.location.protocol}//${window.location.host}/server/api/${readName}?token=${token}&fileToken=${file.fileToken}`;
    // console.log('hasCompleteUrl',hasCompleteUrl,imageList)
    // if (hasCompleteUrl) {
    //   fileUrl = file && file.fileUrl;
    // } else {
    //   fileNewUrl =
    //     file &&
    //     `${window.location.protocol}${window.location.host}${readName}?token=${token}&fileToken=${file.fileToken}`;
    //     //https://56.hichain.com/attachment/viewpage

    // }

    return fileNewUrl;
  };

  isUnSave = () => {
    const { imageList, index } = this.state;
    const file = imageList[index];
    return file && file.response;
  };

  setNewArr = () => {
    const { showPage } = this.state;
    let arr = [];
    for (let i = 1; i < showPage + 1; i++) {
      arr.push(i);
    }
    return arr;
  };

  loading = () => (
    <div className={styles.loading}>
      <Spin />
    </div>
  );

  onScroll = () => {
    const { clientHeight, showPage, numPages } = this.state;
    const height = this.isImage() ? clientHeight - 35 : clientHeight - 39;
    const scrollBottom = this._document.scrollHeight - height - this._document.scrollTop;
    if (scrollBottom <= 10 && showPage < numPages) {
      this.setState({ showPage: this.state.showPage + 1 });
    }
  };

  fileScale = type => {
    const { scale, imageHeight, imageWidth, clientHeight, clientWidth } = this.state;
    const { isMobile } = this.props;
    let newScale = scale,
      newImageHeight = imageHeight,
      newImageWidth = imageWidth;
    if (this.isImage()) {
      if (isMobile) {
        if (type === 'plus') {
          newImageWidth += 50;
        } else if (type === 'minus') {
          if (newImageWidth - 50 <= 0) {
            return;
          }
          newImageWidth -= 50;
        } else {
          newImageWidth = clientWidth;
        }
        this.setState({ imageWidth: newImageWidth });
      } else {
        if (type === 'plus') {
          newImageHeight += 50;
        } else if (type === 'minus') {
          if (newImageHeight - 50 <= 0) {
            return;
          }
          newImageHeight -= 50;
        } else {
          newImageHeight = clientHeight;
        }
        this.setState({ imageHeight: newImageHeight });
      }
    } else {
      if (type === 'plus') {
        newScale += 0.4;
      } else if (type === 'minus') {
        if (newScale - 0.4 <= 0) {
          return;
        }
        newScale -= 0.4;
      } else {
        newScale = 1;
      }
      this.setState({ scale: newScale });
    }
  };

  renderHeaderOperateIcon = ({ onClick, type, title }) => {
    return (
      <span className={styles.operateIcon} onClick={onClick}>
        <Icon type={type} title={title} />
      </span>
    );
  };

  renderHeader = () => {
    const { imageList, index, numPages, showFile } = this.state;
    const file = imageList[index];
    return (
      <Row type="flex" justify="space-between" align="middle" className={styles.header}>
        <Col className={styles.fileName}>
          <Icon type={this.isImage() ? 'picture' : 'file'} />
          <span style={{ marginLeft: 8 }} title={file ? file.fileName || file.name : ''}>
            {file ? file.fileName || file.name : ''}
            {numPages && <span>(总{numPages}页)</span>}
          </span>
        </Col>
        <Col>
          {(showFile || this.isImage()) && (
            <Fragment>
              {this.renderHeaderOperateIcon({
                type: 'zoom-in',
                title: '放大',
                onClick: () => {
                  this.fileScale('plus');
                },
              })}
              {this.renderHeaderOperateIcon({
                type: 'fullscreen',
                title: '实际大小',
                onClick: () => {
                  this.fileScale('middle');
                },
              })}
              {this.renderHeaderOperateIcon({
                type: 'zoom-out',
                title: '缩小',
                onClick: () => {
                  this.fileScale('minus');
                },
              })}
            </Fragment>
          )}
          {!this.isUnSave() &&
            file &&
            this.renderHeaderOperateIcon({
              type: 'download',
              title: '下载',
              onClick: this.download,
            })}
        </Col>
      </Row>
    );
  };

  showAllFile = () => {
    const { showAllFile, clientHeight } = this.state;
    const otherHeight = this.otherHeight;
    let newClientHeight = !showAllFile ? clientHeight - otherHeight : clientHeight + otherHeight;
    this.setState({
      showAllFile: !showAllFile,
      clientHeight: newClientHeight,
      imageHeight: newClientHeight,
    });
  };

  refreshParams = () => {
    const { showAllFile } = this.state;
    const otherHeight = this.otherHeight;
    let imageHeight = document.body.clientHeight;
    if (showAllFile) imageHeight -= otherHeight;
    this.setState({
      scale: 1,
      imageHeight: imageHeight,
      imageWidth: document.body.clientWidth,
    });
  };

  renderFooter = () => {
    const { showAllFile, imageList, index } = this.state;
    return (
      <div className={styles.footer}>
        <div className={styles['footer-title']} onClick={this.showAllFile}>
          <span>{`${showAllFile ? '隐藏' : '显示'}所有的文件`}</span>
          <Icon type="double-right" rotate={showAllFile ? 270 : 90} style={{ marginLeft: 8 }} />
        </div>
        {showAllFile && (
          <div className={styles['footer-content']}>
            {imageList.map((file, fileIndex) => {
              return (
                <div
                  className={styles['footer-content-file']}
                  onClick={() => {
                    this.setState({ index: fileIndex });
                    this.refreshParams();
                  }}
                >
                  <div
                    className={styles['file-icon']}
                    style={{ border: `2px solid ${fileIndex === index ? '#1890FF' : '#f8f8f8'}` }}
                  >
                    <Icon
                      style={{ fontSize: 30 }}
                      type={`${this.isImage({ newFile: file }) ? 'picture' : 'file'}`}
                    />
                  </div>
                  <span className={styles['file-name']}>{file.fileName || file.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  renderOperate = () => {
    const { imageList, index } = this.state;
    return (
      <div className={styles.operate}>
        <div>
          {index !== 0 && (
            <div
              className={styles.left}
              onClick={() => {
                this.changePage('left');
              }}
            >
              <Icon type="left" style={{ fontSize: 28 }} />
            </div>
          )}
        </div>
        <div>
          {imageList.length === 0 ||
            (index !== imageList.length - 1 && (
              <div
                className={styles.right}
                onClick={() => {
                  this.changePage('right');
                }}
              >
                <Icon type="right" style={{ fontSize: 28 }} />
              </div>
            ))}
        </div>
      </div>
    );
  };

  renderListOrUpload = () => {
    const { imageList } = this.state;
    const { type, isMobile, count, params, ...rest } = this.props;
    // console.log('count,---type',count,type)
    if (type === 'list') {
      return (
        count &&
        (
          <a title={`${count}个附件`} onClick={this.handlePreview}>
            <Icon type="link" />
          </a>
        )
      );
    } else {
      return <AdUpload handlePreview={this.handlePreview} {...rest} />;
    }
  };
  getSrcArr=(type)=>{
    const {imageList}=this.state
    const token = localStorage.getItem('token');
    const arr=imageList&&imageList.length>0&&imageList.map(v=>{
      return {src:`${window.location.protocol}//${window.location.host}/server/api/${type}?token=${token}&fileToken=${v.fileToken}`}
      // return {src:`http://10.48.3.133:8080/${type}?token=${token}&fileToken=${v.fileToken}`}
    })
    return arr
  }
  renderImageFile = () => {
    const { clientHeight, imageHeight, imageWidth,index } = this.state;
    const { isMobile } = this.props;
    const newSrc = this.getNewSrc(this.readName);
    const height = clientHeight - 40 - this.footerHeight;
    const newImageHeight = imageHeight - 60 - this.footerHeight;
    const newImageWidth = imageWidth - 20;
    const firstImageHeight = clientHeight - 60 - this.footerHeight;
    const previewSrcArr=this.getSrcArr(this.readName)
    const currentSrc=previewSrcArr[index].src
    return (
      <Row type="flex" align="middle" style={{ height, overflow: 'auto', padding: 10 }}>
        <Col style={{ margin: '0 auto' }}>
          <Zmage
            src={currentSrc}
            style={{
              height: newImageHeight,
              cursor: newImageHeight > firstImageHeight ? 'grab' : 'auto',
            }}
          />
          {/* {isMobile ? (
            <Zmage src={newSrc} style={{ width: newImageWidth }} />
          ) : (
              <Zmage
                src={testSrc}
                style={{
                  height: newImageHeight,
                  cursor: newImageHeight > firstImageHeight ? 'grab' : 'auto',
                }}
              />
            )} */}
        </Col>
      </Row>
    );
  };

  renderDefaultFile = ({
    content = '我们可以选择预览或者下载该文件。',
    showEye = true,
    showDownLoad = true,
    hidden = false,
  } = {}) => {
    const { clientHeight, clientWidth } = this.state;
    const { isMobile } = this.props;
    const height = clientHeight - 40 - this.footerHeight;
    return (
      <div style={{ height }} className={styles['default-wrapper']}>
        {!hidden && (
          <div
            className={styles['default-file']}
            style={{ width: clientWidth * (isMobile ? 0.95 : 0.3) }}
          >
            <Icon type={this.isImage() ? 'picture' : 'file'} style={{ fontSize: 100 }} />
            <div style={{ fontSize: 20, marginTop: 20 }}>{content}</div>
            <div style={{ marginTop: 20 }}>
              {showEye && (
                <Button
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    this.setState({ showFile: true });
                  }}
                >
                  <Icon type="eye" />
                  预览
                </Button>
              )}
              {showDownLoad && (
                <Button onClick={this.download}>
                  <Icon type="download" />
                  下载
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { clientWidth, clientHeight, visible, showFile ,imageList} = this.state;
    const { isMobile } = this.props;
    const readName = this.readName;
    const newSrc = this.getNewSrc(readName);
    const width = clientWidth;
    const height = clientHeight - 40 - this.footerHeight;
    // console.log('imageList',imageList)
    return (
      <Fragment>
        <Modal
          ref={fileReader => (this._fileReader = fileReader)}
          style={{ top: 0 }}
          width={width}
          height={height}
          visible={visible}
          onCancel={this.changeVisible}
          footer={null}
          wrapClassName={styles.customFileReader}
        >
          <div className={styles.customIframe}>
            {this.renderHeader()}
            <div style={{ position: 'relative' }}>
              {this.isUnSave() ? (
                this.renderDefaultFile({
                  content: '我们暂不支持未保存的文件查看和下载,请先保存！',
                  showEye: false,
                  showDownLoad: false,
                })
              ) : this.isImage() ? (
                this.renderImageFile()
              ) : showFile ? (
                <div
                  ref={document => (this._document = document)}
                  style={{
                    height,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: '10px 10px 0',
                    background: 'rgba(255, 255, 255, 0.1)',
                  }}
                  onScroll={this.onScroll}
                >
                  <Document
                    file={newSrc}
                    loading={this.loading}
                    error={this.renderDefaultFile({
                      content: '我们不能预览该文件,请下载文件以查看!',
                      showEye: false,
                    })}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                  >
                    {this.setNewArr().map(number => {
                      return (
                        <div
                          key={number}
                          style={{
                            marginBottom: 10,
                            background: '#fff',
                            boxShadow: 'rgba(0, 21, 41, 0.08) 0px 1px 4px',
                          }}
                        >
                          <Row type="flex">
                            <Col style={{ margin: '0 auto' }}>
                              <Page
                                scale={this.state.scale}
                                pageNumber={number}
                                style
                                width={width - 18 - 20}
                              />
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                  </Document>
                </div>
              ) : newSrc ? (
                this.renderDefaultFile()
              ) : (
                        this.renderDefaultFile({
                          showEye: false,
                          showDownLoad: false,
                          hidden: true,
                        })
                      )}
              {this.renderOperate()}
            </div>
            {!isMobile && this.renderFooter()}
          </div>
        </Modal>
        {this.renderListOrUpload()}
      </Fragment>
    );
  }
}

export default props => (
  <Media query="(max-width: 599px)">
    {isMobile => <FileReader {...props} isMobile={isMobile} />}
  </Media>
);
