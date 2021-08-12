import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'dva';
import { Radio, Spin, Form, Card } from 'antd';
// import SyntaxHighlighter from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';

import AdModal from '@/components/AdModal';
import AntdForm from '@/components/AntdForm';
import AdButton from '@/components/AdButton';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import EditPage from '@/components/EditPage';
import DebugOperate from './DebugOperate';
import CodeEditor from './CodeEditor';
import prompt from '@/components/Prompt';
import StandardTable from '@/components/StandardTable';
import styles from './index.less';

import { formItemFragement } from '@/utils/common';
import { codes, allDispatchType, saveAllValues } from './utils';

@connect(({ businessRules, component, loading }) => ({
  dictObject: component.dictObject,
  debuglist: businessRules.debuglist,
  jsonData: businessRules.jsonData,
  loading: loading.effects[allDispatchType.debuglist],
}))
@Form.create()
export default class Debug extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cType: 'RowData',
      debugData: '',
      columns: [{ '': '' }],
      dataList: { list: [] },
      debugLog: {},
    };
  }
  componentDidMount() {
    SyntaxHighlighter.registerLanguage('javascript', js);
  }
  modalOperate = () => {
    const { modalOperate } = this.props;
    modalOperate();
  };
  //添加规则
  addInfo = e => {
    e.stopPropagation();
    this.child.addInfo();
  };

  onRef = ref => {
    this.child = ref;
  };
  carryOn = e => {
    e.stopPropagation();
    e.preventDefault();
    const { dispatch, id, debuglist, jsonData } = this.props;
    const { cType } = this.state;
    //处理数据：key,value {name:'lan'}
    let obj = {};
    if (cType == 'Json' && jsonData && Object.keys(jsonData).length > 0) {
      // obj = jsonData.replace(/\s/g, '');
      obj = jsonData.replace(/\s/g, '').toString();
      if (/:/.test(obj)) {
        obj = eval('(' + obj + ')');
      } else {
        prompt({
          content: '输入格式有误',
          type: 'warn',
        });
        return;
      }
    } else if (debuglist && debuglist.length > 0 && (debuglist[0].Key || debuglist[0].value)) {
      
      debuglist.map((v, i) => {
        // v={Key:'name',Value:'lan'} --> {"nmae":'lan'}请输入参数
        if (v.Key || v.Value) obj[v.Key] = v.Value;
      });
    }
    let params = {
      id,
      data: JSON.stringify(obj),
    };
    //数据为空也可以执行
    dispatch({
      type: 'businessRules/debug',
      payload: params,
      callback: res => {
        if (res) {
          this.setState({
            visibleDebug: true,
            debugData: res,
            debugLog: res.debugLog || [],
          });
          if (cType == 'RowData' && res.result) {
            const obj = res.result[0];
            let newColumns = [];
            for (let k in obj) {
              newColumns.push({ title: k, dataIndex: k });
            }
            this.setState(
              {
                columns: newColumns,
                debugLog: res.debugLog,
              },
              () => {
                this.setState({
                  dataList: { list: res.result || [] },
                });
              }
            );
          }
        }
      },
    });
  };
  changeType = e => {
    this.setState({
      cType: e.target.value,
    });
  };
  //利用插件，需要将普通的数据格式化结果为字符串，否则会报错
  formatToObject = data => {
    if (typeof data === 'object') {
      if (data instanceof Object) {
        return JSON.stringify(data);
      }
      return data;
    }
    return data.toString();
  };

  render() {
    const { form, visible, isRule, id, debuglist } = this.props;
    const { cType, debugData, columns, dataList, debugLog } = this.state;
    const defaultCodes = {
      showInlineLineNumbers: true,
      language: 'javascript',
      style: { docco },
    };
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const disabled = false;
    const editPageParams = {
      panelValue: [{ key: 'Query Params' }, { key: 'Response' }],
    };

    const formItem = [
      [
        <AntdFormItem label="" code="type" initialValue={cType} {...commonParams}>
          <Radio.Group onChange={e => this.changeType(e)}>
            <Radio value="RowData" disabled={disabled}>
              RowData
            </Radio>
            <Radio value="Json" disabled={disabled}>
              Json
            </Radio>
          </Radio.Group>
        </AntdFormItem>,
      ],
    ];

    const modalHead = (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{isRule ? '规则调试' : '数据源调试'}</span>
        <div>
          <AdButton
            type="primary"
            onClick={e => {
              this.carryOn(e);
            }}
            text="执行"
          />
          <AdButton
            onClick={e => {
              this.modalOperate();
            }}
            style={{ marginLeft: 8 }}
            text="取消"
          />
        </div>
      </div>
    );
    return (
      <div>
        {visible && (
          <AdModal
            visible={visible}
            title={modalHead}
            onOk={this.handleOk}
            okButtonProps={{ disabled }}
            onCancel={() => {
              this.modalOperate();
            }}
            okText="保存"
            width="60%"
            bodyStyle={{
              height: 'calc(100vh - 140px)',
              overflowY: 'auto',
              padding: '10px 24px',
            }}
            footer={null}
            closable={null}
          >
            <div
              className="custom-formitem"
              //   style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              {isRule ? <AntdForm>{formItemFragement(formItem)}</AntdForm> : <span></span>}
            </div>
            <EditPage {...editPageParams}>
              <Fragment>
                {cType == 'RowData' ? (
                  <DebugOperate isRule={isRule} onRef={this.onRef} detailId={id} />
                ) : (
                  <CodeEditor />
                )}
              </Fragment>
              <Fragment>
                {!isRule ? (
                  <StandardTable
                    data={dataList}
                    columns={columns}
                    disabledRowSelected={true}
                    pagination={false}
                    code="debug"
                    className="table_info_total"
                    scrollY={200}
                    // canInput={true}
                  />
                ) : (
                  <div>
                    <Card style={{ padding: 0 }} type="inner" bordered={false} title="Result">
                      {debugData.result ? (
                        <SyntaxHighlighter language="javascript" style={docco}>
                          {this.formatToObject(debugData.result)}
                        </SyntaxHighlighter>
                      ) : (
                        <div
                          style={{
                            textAlign: 'center',
                            paddingBottom: 15,
                            borderBottom: '1px dashed #ccc',
                          }}
                        >
                          暂无数据
                        </div>
                      )}
                    </Card>
                  </div>
                )}

                <Card
                  type="inner"
                  bodyStyle={{
                    background: debugLog && debugLog.length > 0 ? '#000' : '#fff',
                    color: 'green',
                  }}
                  title="DeBugLog"
                  bordered={false}
                  style={{ marginTop: 15 }}
                >
                  {debugLog && debugLog.length > 0
                    ? debugLog.map((v, i) => {
                        return v ? (
                          <div>
                            <span style={{ marginRight: 10 }}>{i + 1}</span>
                            {v}
                          </div>
                        ) : (
                          <div
                            style={{
                              textAlign: 'center',
                              paddingBottom: 15,
                              borderBottom: '1px dashed #ccc',
                            }}
                          >
                            暂无数据
                          </div>
                        );
                      })
                    : ''}
                </Card>
              </Fragment>
            </EditPage>
          </AdModal>
        )}
      </div>
    );
  }
}
