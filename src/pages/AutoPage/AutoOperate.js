import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Button, Collapse, Tabs } from 'antd';
import moment from 'moment';
import AntdDatePicker from '@/components/AntdDatePicker';
import AntdForm from '@/components/AntdForm';
import AdSelect from '@/components/AdSelect';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import AdInput from '@/components/AdInput';
import AdSearch from '@/components/AdSearch';
import prompt from '@/components/Prompt';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AdButton from '@/components/AdButton';
import SearchSelect from '@/components/SearchSelect';
import { editCol, editGutter, editRow, allDictList } from '@/utils/constans';
import { queryDictData, queryPerson, queryDict, columnsDriver } from '@/utils/common';
import { plateList, dateFormat, allDispatchType, codes, routeUrl } from './utils';
import { transferLanguage } from '@/utils/utils';
import AutoForm from './components/AutoForm'
import AutoList from './AutoList'
import router from 'umi/router';
import NotConfigPage from './components/NotConfigPage'
import { queryFileList, filterAddFile, filterDeteteFile } from '@/utils/common';
import styles from '../../global.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Panel = Collapse.Panel;
const { TabPane } = Tabs;

@connect(({ component, autoPage, i18n }) => ({
  selectDetails: autoPage.selectDetails,
  ownCompany: component.ownCompany,
  dictObject: component.dictObject,
  autoPage,
  pageConfig: autoPage.operatePageConfigData,
  pageConfigData: autoPage.pageConfigData,
  language: i18n.language,
  formList: autoPage.formList,
}))
@Form.create()
export default class AutoOperate extends Component {
  state = {
    detailId: '',
    visible: false,
    disabled: true,
    selectedRows: [],
    noPageConfig: false,
    pageLoadding: true,
    activeKey: [0, 1],
    // allFileList: {},
  };
  allFileList = {}
  pageCode = this.props.match.params.pagecode
  pageId = this.props.match.params.id


  componentDidMount() {
    const {
      match: {
        params: { id },
        path,
      },
      selectDetails,
      dispatch,
      pageConfig,
    } = this.props;
    if (!id) {
      this.setState({
        disabled: false,
      })
    }
    if (!pageConfig[this.pageCode]) {
      this.getPageConfig(id)
    } else {
      this.getDetails(id)

    }
  }

  getDetails = (id) => {
    const {
      dispatch,
      pageConfig,
    } = this.props;
    if (!id) return;
    this.setState({ detailId: id });
    let requestUrl = pageConfig[this.pageCode].editLayout ? pageConfig[this.pageCode].editLayout.requestUrl : pageConfig[this.pageCode].advaneceLayout.requestUrl;
    dispatch({
      type: 'autoPage/selectDetails',
      payload: { id, requestUrl: requestUrl },
      callback: data => {
        const { formList } = this.props
        formList.forEach((item) => {
          if (!item.hidden && ['enum'].indexOf(item.type) === -1) {
            if (item.type === 'attachment') {
              this._queryFileList(item, id)
            }
          }
        })
      },
    });
  }

  getPageConfig = (id) => {
    this.setState({
      pageLoadding: true
    })
    const { dispatch } = this.props
    dispatch({
      type: 'autoPage/getOperatePageConfig',
      payload: {
        id: this.pageCode
      },
      callback: (data) => {

        if (data.code === 0) {
          // this.selectList()
          const { pageConfig } = this.props
          let editLayout = pageConfig[this.pageCode]?.editLayout;
          let activeKey;
          let formList;
          if (editLayout) {
            //editLayout
            activeKey = Array.from({ length: pageConfig[this.pageCode]?.editLayout.cardLayout.length }, (v, k) => k)
            formList = pageConfig[this.pageCode] ? pageConfig[this.pageCode].editLayout.cardLayout[0].moduleList : []
          } else {
            //advaneceLayout
            activeKey = Array.from({ length: pageConfig[this.pageCode]?.advaneceLayout.main.cardLayout.length }, (v, k) => k)
            formList = pageConfig[this.pageCode] ? pageConfig[this.pageCode].advaneceLayout.main.cardLayout[0].moduleList : []
          }
          this.setState({
            activeKey: activeKey
          })
          //保存formList
          dispatch({
            type: 'autoPage/saveFormList',
            payload: { formList }
          })
        } else {
          this.setState({
            noPageConfig: true
          })

        }
        this.getDetails(id)
        this.setState({
          pageLoadding: false
        })
      }

    })
  }
  _queryFileList = (item, id) => {
    const { allFileList } = this.state
    queryFileList({
      props: this.props,
      params: { bizId: id, fileBizType: item.fileBizType, filedName: item.dataIndex },
      callback: data => {
        this.allFileList[item.dataIndex] = data
        this.props.form.setFieldsValue({ [item.dataIndex]: data });
      },
    });
  };
  setTabName = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/setTabsName',
      ...payload,
      callback: payload.callback,
    });
  };

  selectList = ({ payload = {} } = {}) => {
    const { dispatch, searchValue } = this.props;
    dispatch({
      type: allDispatchType.list,
      payload,
      callback: data => {
        if (!data) return;
        queryPerson({ data, searchValue, dispatch });
      },
    });
  };

  /**
   * 保存数据
   */
  saveInfo = (data) => {
    const { form, dispatch, selectDetails, match, location: { query }, formList, pageConfigData } = this.props;
    const { detailId } = this.state;
    const detail = selectDetails[detailId];
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (detailId) {
        values.id = detailId
      }
      const fileInfo = formList.filter(v => !v.hidden && v.type === 'attachment').map(item => {
        let obj = {
          fileBizType: item.fileBizType,
          fieldName: item.dataIndex,
          fileTokens: filterAddFile(values[item.dataIndex]),
          deleteFileIds: detailId ? filterDeteteFile(values[item.dataIndex], this.allFileList[item.dataIndex]) : [],
        }
        //去除掉 values上带了附件数组的字段
        values[item.dataIndex] = ''
        return obj
      })
      values = this.setOperate(values)
      values.fileInfo = fileInfo
      dispatch({
        type: 'autoPage/saveFormData',
        payload: { ...values, requestUrl: data.requestUrl },
        callback: (success) => {
          this.setState(preState => ({
            disabled: !preState.disabled,
          }));
          // 按钮提交之后的操作
          data.eventFunction ? data.eventFunction.map(item => {
            switch (item.name) {
              // 刷新跳转过来的页面
              case 'refreshParentFunc':
                dispatch({
                  type: 'autoPage/fetchList',
                  payload: {
                    listUrl: pageConfigData[query.parentPage].listLayout.requestUrl,
                    id: query.parentPage
                  },
                });
                break;
              // 关闭当前页跳转至之前的页面
              case 'closeWindowFunc':
                dispatch({
                  type: 'common/setTabsName',
                  payload: {
                    id: data.data,
                    isReplaceTab: true,
                  }
                })
                // 本地保存当前页面的路由,方便关闭tab
                localStorage.setItem('closeWindowFunc', match.url)
                router.goBack()
                break;

              // 重置表单
              case 'resetWindowFunc':
                // 添加才能刷新
                if (!detailId) {
                  form.resetFields()
                }
                break;

              default:
                dispatch({
                  type: 'common/setTabsName',
                  payload: {
                    id: data.data,
                    isReplaceTab: true,
                  },
                  callback: () => {
                    !detailId ? router.push(`/pageEdit/${match.params.menu}/${this.pageCode}/${success.data}`) : null;
                  }
                })
                break;
            }
          }) : !detailId ? router.push(`/pageEdit/${match.params.menu}/${this.pageCode}/${success.data}`) : null;
        }
      });
    }
    )
  };

  setOperate = (values) => {
    const { pageConfig, } = this.props
    let editLayout = pageConfig[this.pageCode]?.editLayout;
    if (editLayout) {
      let formItem = pageConfig[this.pageCode]?.editLayout.cardLayout?.map((item, index) => {
        if (item.type === 'EDIT' && item.moduleList.length > 0) {
          item.moduleList.map(v => {
            if (!values[v.dataIndex]) {
              return
            }
            //处理下来类型callselect 传值给后台对应id值
            // if (v.type == "callselect") {
            //   values[v.dataIndex] = values[v.dataIndex][0].id;
            // }
            switch (v.type) {
              case 'date':
                values[v.dataIndex] = moment(values[v.dataIndex]).format(v.format)
                break;
              case 'dateRange':
                values[v.param1] = moment(values[v.dataIndex][0]).format(v.format)
                values[v.param2] = moment(values[v.dataIndex][1]).format(v.format)
                delete values[v.dataIndex]
                break;
              case 'callSelect':
                //处理下来类型callselect 传值给后台对应id值
                values[v.dataIndex] = values[v.dataIndex][0].id;
                break;
              default:
                break;
            }
          })
        }
      })
    } else {
      //cardLayout
      let formItem = pageConfig[this.pageCode]?.advaneceLayout.main.cardLayout?.map((item, index) => {
        if (item.type === 'EDIT' && item.moduleList.length > 0) {
          item.moduleList.map(v => {
            if (!values[v.dataIndex]) {
              return
            }
            //处理下来类型callselect 传值给后台对应id值
            // if (v.type == "callselect") {
            //   values[v.dataIndex] = values[v.dataIndex][0].id;
            // }
            switch (v.type) {
              case 'date':
                values[v.dataIndex] = moment(values[v.dataIndex]).format(v.format)
                break;
              case 'dateRange':
                values[v.param1] = moment(values[v.dataIndex][0]).format(v.format)
                values[v.param2] = moment(values[v.dataIndex][1]).format(v.format)
                delete values[v.dataIndex]
                break;
              case 'callSelect':
                //处理下来类型callselect 传值给后台对应id值
                values[v.dataIndex] = values[v.dataIndex][0].id;
                break;
              default:
                break;
            }
          })
        }
      })
    }

    return values
  }

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  getValue = (values, type) => {
    this.setState({
      [type]: values,
    });
  };

  generateButton = () => {
    const { pageConfig } = this.props
    const { detailId, disabled } = this.state;
    let editLayoutFlag = pageConfig[this.pageCode]?.editLayout;
    let advaneceLayoutFlag = pageConfig[this.pageCode]?.advaneceLayout;
    return disabled ? (
      <AdButton
        type="primary"
        onClick={() => {
          this.setState(preState => ({
            disabled: !preState.disabled,
          }));
        }}
        text="编辑"
      // code={detailId ? codes.edit : codes.add}
      />
    ) : (
      <Button.Group>
        {
          editLayoutFlag && pageConfig[this.pageCode]?.editLayout.buttons.map((item, index) => {
            const btn = <AdButton
              text={item.title}
              type="primary"
              // code={detailId ? codes.edit : codes.add}
              onClick={() => this.saveInfo(item)}
            />
            if (detailId && item.operType === 'EDIT') {
              return btn
            }
            if (!detailId && item.operType === 'ADD') {
              return btn
            }
            if (item.operType === '') {
              return btn
            }
          })
        }
        {
          advaneceLayoutFlag && pageConfig[this.pageCode]?.advaneceLayout.main.buttons.map((item, index) => {
            const btn = <AdButton
              text={item.title}
              type="primary"
              // code={detailId ? codes.edit : codes.add}
              onClick={() => this.saveInfo(item)}
            />
            if (detailId && item.operType === 'EDIT') {
              return btn
            }
            if (!detailId && item.operType === 'ADD') {
              return btn
            }
            if (item.operType === '') {
              return btn
            }
          })
        }
        {detailId && (
          <AdButton
            onClick={() => {
              this.setState(preState => ({
                disabled: !preState.disabled,
              }));
            }}
            text="取消"
          // code={detailId ? codes.edit : codes.add}
          />
        )}
      </Button.Group>
    );
  }


  convertFormFormat = (moduleList) => {
    let formItem = []
    let itemArr = []

    moduleList.map((item, index) => {
      const { form: { getFieldDecorator }, selectDetails } = this.props
      const { detailId, disabled } = this.state
      const detail = selectDetails[detailId] || {};
      const commonParams = {
        getFieldDecorator,
      };
      if (item.hidden || item.type === 'attachment') {
        return
      }
      let component = (<AntdFormItem
        label={item.title}
        code={item.dataIndex}
        rules={[{ required: item.required }]}

        initialValue={detail ? detail[item.dataIndex] : ''}
        {...commonParams}
      >
        <AntdInput disabled={item.readyOnly ? true : disabled} />
      </AntdFormItem>)
      itemArr.push(component)
      if (moduleList.length - 1 !== index) {
        if (itemArr.length === 2) {
          formItem.push(itemArr)
          itemArr = []
        }
      } else {
        formItem.push(itemArr)
      }
    })
    return formItem
  }
  callbackTab(key) {
    console.log(key);
  }
  // 获取子组件
  onRef = (ref) => {

  }
  render() {
    const { detailId, visible, selectedRows, disabled, noPageConfig, pageLoadding, } = this.state;
    const {
      form,
      form: { getFieldDecorator },
      selectDetails,
      ownCompany,
      dictObject,
      pageConfig,
      language,
      formList
    } = this.props;

    let editLayoutFlag = pageConfig[this.pageCode]?.editLayout;
    let advaneceLayoutFlag = pageConfig[this.pageCode]?.advaneceLayout;
    let advaneceLayoutTabsLayout = pageConfig[this.pageCode]?.advaneceLayout?.main?.tabsLayout;
    let tabsLayoutFlag = advaneceLayoutTabsLayout && advaneceLayoutTabsLayout.length > 0 ? true : false;
    const detail = selectDetails[detailId] || {};
    formList && formList.length > 0 && formList.forEach(item => {
      if (!item.hidden && item.type === 'attachment') {
        detail[item.dataIndex] = this.allFileList[item.dataIndex]
      }
    })
    const commonParams = {
      getFieldDecorator,
    };
    const customPanelStyle = {
      borderRadius: 4,
      marginBottom: 12,
      background: '#fff',
      border: 0,
      overflow: 'hidden',
    };
    const prefixSelector = (name, type) => (
      <AntdFormItem code={name} initialValue={undefined} {...commonParams}>
        <AdSelect
          data={plateList}
          isExist={true}
          allowClear={type == 2 ? true : false}
          show={{ id: 'key', name: 'val' }}
          style={{ width: 120 }}
          disabled={disabled}
        />
      </AntdFormItem>
    );
    const genExtraBasicInfo = () => (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {editLayoutFlag && <span>{transferLanguage(pageConfig[this.pageCode]?.editLayout?.title, language) }</span>}
        {advaneceLayoutFlag && <span>{transferLanguage(pageConfig[this.pageCode]?.advaneceLayout?.title, language) }</span>}
        {this.generateButton()}
      </div>
    );
    return (
      <div className={styles.CollapseUpdate}>
        <PageHeaderWrapper title={genExtraBasicInfo()}>
          <AntdForm>
            <Collapse
              activeKey={this.state.activeKey}
              onChange={key => this.callback(key)}
              bordered={false}
            >
              {
                editLayoutFlag && pageConfig[this.pageCode]?.editLayout.cardLayout?.map((item, index) => {
                  return (<Panel header={transferLanguage(item.title, language)} key={index} style={customPanelStyle}>
                    {item.type === 'EDIT' && <AutoForm key={index} onRef={this.onRef} form={form} detail={detail} disabled={disabled} formList={item.moduleList} currentId={detailId} getFileList={this.getFileList} />}
                    {item.type === 'LIST' && <AutoList key={index} pageData={item} />}
                  </Panel>)
                })
              }
              {
                advaneceLayoutFlag && !tabsLayoutFlag && pageConfig[this.pageCode]?.advaneceLayout.main.cardLayout?.map((item, index) => {
                  return (<Panel header={transferLanguage(item.title, language)} key={index} style={customPanelStyle}>
                    {item.type === 'EDIT' && <AutoForm key={index} onRef={this.onRef} form={form} detail={detail} disabled={disabled} formList={item.moduleList} advaneceLayoutFlag={advaneceLayoutFlag} currentId={detailId} getFileList={this.getFileList} />}
                  </Panel>)
                })
              }
              {
                advaneceLayoutFlag && tabsLayoutFlag && advaneceLayoutTabsLayout.map((item, index) => {
                  return (
                    <div style={customPanelStyle} header={index} key={index}>
                      <Tabs defaultActiveKey={index} onChange={this.callbackTab}>
                        {
                          item.tabPane.map((citem, cindex) => {
                            return (<TabPane tab={transferLanguage(citem.title, language)} key={cindex} style={{ marginTop: '10px' }}>
                              {<AutoForm key={index} onRef={this.onRef} form={form} detail={detail} disabled={disabled} formList={citem.moduleList} advaneceLayoutFlag={advaneceLayoutFlag} currentId={detailId} getFileList={this.getFileList} />}
                            </TabPane>)

                          })
                        }
                      </Tabs>
                    </div>
                  )
                })

              }
              {
                advaneceLayoutFlag && pageConfig[this.pageCode]?.advaneceLayout.detail.cardLayout?.map((item, index) => {
                  return (<Panel header={ transferLanguage(item.listLayout.title, language)} key={index} style={customPanelStyle}>
                    {<AutoList pageData={item.listLayout} paramId={item.listLayout.param} paramVal={this.pageId} key={index} />}
                  </Panel>)
                })
              }
            </Collapse>
          </AntdForm>
        </PageHeaderWrapper>
        {noPageConfig && <NotConfigPage getPageConfig={() => this.getPageConfig()} />}
      </div>
    );
  }
}
