import React, { PureComponent } from 'react';
import { Upload, Modal } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import { formatYesOrNo, checkSuffix } from '@/pages/Common/common';
import SearchSelect from '@/components/SearchSelect';
import FileReader from '@/components/FileReader';
import TextArea from 'antd/lib/input/TextArea';

export default class DetailsList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
    };

  }
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
  handleCancel = e => {
    this.setState({
      previewVisible: false,
    });
  };

  setData = (details, isMobile, isThree) => {
    const arr = details ? details.fields : []; //每一行的 lable 和value
    const data = details ? details.value : {};// 所有的数据 data
    const fileListFirst = details ? details.fileList : []; //附件文件 数组
    const fileListEMS = details ? details.fileListEMS : '';
    let html = [];
    const labelStyle = {
      width: isMobile ? 90 : 136,
    };
    const threeStyle = {
      width: isThree ? "31.5% " : "48.5%",

    }
    let width = isThree ? "30% " : "48.5%"
    const formatKeys = (val, type) => {
      let arr = [];
      if (Array.isArray(val) && val.length > 0) {
        val.map(item => {
          if (data[item]) {
            arr.push(data[item]);
          }
        });
      }
      if (type == 'size') {
        return arr.join('*');
      } else {
        return `${arr}`;
      }
    };
    if (Array.isArray(arr) && arr.length > 0) {
      html = arr.map((item, i) => {
        if (item.isFile) {
          //文件
          if (fileListEMS) {
            return (
              <div
                style={threeStyle}
                className={classNames(styles.rowText, styles.detailCommom)}
                key={i}
                style={{ display: 'flex' }}
              >
                <label style={labelStyle}>{item.name}</label>
                <span className="cus_UploadDetail">
                  {/* <Upload
                    style={{ display: 'flex' }}
                    action={details.actionName}
                    listType="picture-card"
                    fileList={item.isFile}
                    showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                    onPreview={this.handlePreview}
                  /> */}
                  <FileReader
                    style={{ display: 'flex' }}
                    value={item.isFile}
                    showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                    showUpload={false}
                  />
                </span>
              </div>
            );
          } else {
            // console.log('item.isFile---',item.isFile,item)
            return (
              <div
                style={threeStyle}
                className={classNames(styles.rowText, styles.detailCommom)}
                key={i}
                style={{ display: 'flex' }}
              >
                <label style={labelStyle}>{item.name}</label>
                <span className="cus_UploadDetail">
                  <FileReader
                    style={{ display: 'flex' }}
                    value={item.isFile}
                    showUploadList={{ showPreviewIcon: true, showRemoveIcon: false }}
                    showUpload={false}

                  />
                </span>
              </div>
            );
          }
        }
        else if (item.isRegion) {
          //区间
          return (
            <div
              style={threeStyle}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              {data && data[item.key1] && (
                <span className={item.isRow || isMobile ? styles.detailsSpan : ''}>
                  <span title={data ? data[item.key1] : ''}>{data ? data[item.key1] : ''}</span>
                  <span style={{ width: 15 }}> 至 </span>
                  <span title={data ? data[item.key2] : ''}>{data ? data[item.key2] : ''}</span>
                </span>
              )}
            </div>
          );
          
        } else if (item.isContrast) {
          //对比 
          return (
            <div
              style={threeStyle}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              {data && data[item.key1] && (
                <span className={item.isRow || isMobile ? styles.detailsSpan : ''}>
                  <span title={data ? data[item.key1] : ''}>{data ? data[item.key1] : ''}</span>
                  <span style={{ width: 15 }}> | </span>
                  <span title={data ? data[item.key2] : ''}>{data ? data[item.key2] : ''}</span>
                </span>
              )}
            </div>
          );
          
        } 
        else if (item.isSize) {
          //尺寸 长*宽*高
          return (
            <div
              style={threeStyle}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              <span
                title={data ? data[item.key] : ''}
                className={item.isRow || isMobile ? '' : styles.detailsSpan}
              >
                {data
                  ? item.value
                    ? item.value
                    : item.keys
                      ? formatKeys(item.keys, item.isSize)
                      : data[item.key]
                  : ''}
              </span>
            </div>
          );
        } else if (item.isConst) {
          //计算值：常量
          return (
            <div
              style={threeStyle}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              <span title={item.key} className={item.isRow || isMobile ? '' : styles.detailsSpan}>
                {item.key}
              </span>
            </div>
          );
        } else if (item.isFormat) {
          //格式化
          return (
            <div
              style={threeStyle}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              <span
                title={data ? formatYesOrNo(data[item.key]) : ''}
                className={item.isRow || isMobile ? '' : styles.detailsSpan}
              >
                {data ? formatYesOrNo(data[item.key]) : ''}
              </span>
            </div>
          );
        } else if (item.isHtml) {
          //转文本
          const c_html = data ? data[item.key] : '';
          return (
            <div
              style={threeStyle}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              <span
                className={styles.dangerHtml_text}
                dangerouslySetInnerHTML={{
                  __html: c_html,
                }}
              />
            </div>
          );
        } else if (item.isOnlyRead) {
          const _auths = data && data[item.key] ? [{ id: data[item.key] }] : [];
          const url = item.url;
          return (
            <div
              style={threeStyle}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              <SearchSelect
                url={url}
                selectedData={_auths} // 选中值
                showValue={'sysName'}
                searchObj="账号" // 搜索文案
                itemName="sysName"
                onlyRead={true}
              />
            </div>
          );
        } else if (item.isTextArea) {
          return (
            <div
              style={{ width: '100%', display: 'flex' }}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              <TextArea style={{flex:1}}
                value={data ? (data[item.key]) : ''}
              />
            </div>
          );
        }
        else {
          return (
            <div
              style={threeStyle}
              key={i}
              className={
                item.isRow || isMobile
                  ? classNames(styles.rowText, styles.detailCommom)
                  : classNames(styles.detailCommom, styles.halfText)
              }
            >
              <label style={labelStyle}>{item.name}</label>
              <span
                title={data ? data[item.key] : ''}
                className={item.isRow || isMobile ? '' : styles.detailsSpan}
              >
                {data
                  ? item.value
                    ? item.value
                    : item.keys
                      ? formatKeys(item.keys)
                      : data[item.key]
                  : ''}
              </span>
            </div>
          );
        }
      });
    }

    return html;
  };
  render() {
    const { isMobile, detilsData, isThree } = this.props;
    const { previewVisible, previewImage } = this.state;

    return (
      <div className={styles.cus_detailsText}>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        {this.setData(detilsData, isMobile, isThree)}
      </div>
    );
  }
}
