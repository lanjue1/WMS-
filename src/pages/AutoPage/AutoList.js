import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Button, Modal, Badge, Card, Spin, Input } from 'antd';
import SelectForm from '@/components/SelectForm';
import AdSearch from '@/components/AdSearch';
import { formatMessage } from 'umi-plugin-react/locale';
import FileReader from '@/components/FileReader';
import RightDraw from '@/components/RightDraw';
import AdSelect from '@/components/AdSelect';
import AdButton from '@/components/AdButton';
import ManageList from '@/components/ManageList';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
import TableButtons from '@/components/TableButtons';
import StandardTable from '@/components/StandardTable';
import SearchSelect from '@/components/SearchSelect';
import router from 'umi/router';
import { queryDictData, queryPerson, queryDict } from '@/utils/common';
import { allDictList } from '@/utils/constans';
import { allDispatchType, codes, renderTableAdSelect, routeUrl } from './utils';
import QuickSearchModal from './components/QuickSearchModal'
import AdvancedQueryModal from './components/AdvancedQueryModal'
import isLocalFileExist$ from 'dingtalk-jsapi/api/biz/util/isLocalFileExist';
import NotConfigPage from './components/NotConfigPage'
import AntdDatePicker from '@/components/AntdDatePicker';
import AntoModal from './components/AutoModal'
import { transferLanguage } from '@/utils/utils'
const { TextArea } = Input;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const dateFormatByM = 'YYYY-MM';
// import DemoDetails from './DemoDetails';
const confirm = Modal.confirm;
// 设置远程搜索清空功能
var reset = false;
@ManageList
@connect(({ loading, component, autoPage, common, i18n }) => ({
  dictObject: component.dictObject,
  searchValue: component.searchValue,
  loading: loading.effects[allDispatchType.list],
  pageConfigData: autoPage.pageConfigData,
  pageList: autoPage.pageList,
  autoPage,
  common,
  language: i18n.language
}))
@Form.create()
export default class AutoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      expandForm: false,
      visible: false,
      detailId: '',
      columns: [],
      fixedColumn: 0,
      previewVisible: false,
      previewImage: '',
      pageLoadding: true,
      noPageConfig: false,
      checkId: [],
      quickSearchVisible: false,
      advancedQueryVisible: false,
      quickSearch: false,
      autoModalVisible: false,
      modalPageId: '',
      modalOpen: '',
      modalTitle: '',
      modalParamName: '',
      configJsonTable:{}
    };
    this.reset = false

  }
  className = 'vehicle-table';
  componentWillMount() {
    // const allDict = [
    //   allDictList.coach,
    //   allDictList.vehicleProperties,
    //   allDictList.vehicleType,
    //   allDictList.vehicleCategory,
    //   allDictList.cabinetType,
    // ];
    // queryDict({ props: this.props, allDict });
  }

  pageCode = this.props?.match?.params?.pagecode
  componentDidMount() {
    if (this.props.pageData) {
      this.setState({
        pageLoadding: false
      })
      this.selectList()
      return
    }
    this.getPageConfig()
  }

  getPageConfig = () => {
    this.setState({
      pageLoadding: true
    })
    const { dispatch } = this.props
    dispatch({
      type: 'autoPage/getPageConfig',
      payload: {
        id: this.pageCode
      },
      callback: (data) => {
        if (data.code === 0) {

          this.selectList()
        } else {
          this.setState({
            noPageConfig: true
          })
        }
        this.setState({
          pageLoadding: false
        })
      }
    })
  }
  selectList = ({ payload = {} } = {}) => {
    const { dispatch, searchValue, pageConfigData, pageData, paramId, paramVal } = this.props;
    let customSearch = pageData ? pageData.customSearch ? pageData.customSearch : [] : pageConfigData[this.pageCode].listLayout.customSearch
    let listField = pageData ? pageData.listField : pageConfigData[this.pageCode].listLayout.listField
    let requestUrl;
    //关联列表后端返回字段不一致
    if (pageData && pageData.queryUrl) {
      requestUrl = pageData.queryUrl
    } else {
      requestUrl = pageData ? pageData['requestUrl'] : pageConfigData[this.pageCode].listLayout.requestUrl
    }

    if (pageConfigData[this.pageCode]?.listLayout.userConfig && pageConfigData[this.pageCode].listLayout.userConfig.length && pageConfigData[this.pageCode].listLayout.userConfig[0]) {
      const configJson = JSON.parse(pageConfigData[this.pageCode].listLayout.userConfig[0].configJson)
      //固定列
      configJson.cloums.forEach((item, index) => {
        if (index < configJson.fixedColumn) {
          item.fixed = true;
        }
      });
      this.setState({
        configJsonTable: configJson
      })
      this.setColums(configJson.cloums)
    } else {
      this.setColums(listField)
    }
    if (customSearch.length >= 1) {
      this.selectFormParams.firstFormItem = this.setSearch('first')
    }
    if (customSearch.length >= 2) {
      this.selectFormParams.secondFormItem = this.setSearch('second')
    }
    if (customSearch.length >= 3) {
      this.selectFormParams.otherFormItem = this.setSearch('other')
    }
    let keyParm = paramVal ? paramVal : this.pageCode
    dispatch({
      type: 'autoPage/fetchList',
      payload: {
        ...payload,
        listUrl: requestUrl,
        id: keyParm,
        [paramId]: paramVal
      },
      callback: data => {
        if (!data) return;
        queryPerson({ data, searchValue, dispatch });
      },
    });
    this.reset = false
  };

  setSearch = (type) => {
    const { pageConfigData, pageData } = this.props;
    let searchArray;
    if (pageData) {
      if (pageData.listLayout && pageData.listLayout.customSearch) {
        searchArray = pageData.listLayout.customSearch
      } else if (pageData.customSearch) {
        searchArray = pageData.customSearch
      }
    } else {
      if (pageConfigData[this.pageCode] && pageConfigData[this.pageCode].listLayout.customSearch) {
        searchArray = pageConfigData[this.pageCode].listLayout.customSearch
      } else {
        searchArray = pageConfigData[this.pageCode].listLayout.customSearch;
      }
    }
    // const searchArray=pageData ? pageData.listLayout.customSearch : pageConfigData[this.pageCode].listLayout.customSearch
    let result = (<></>);
    switch (type) {
      case 'first':
        result = this.setSearchFormItem(searchArray[0])
        break;
      case 'second':
        result = this.setSearchFormItem(searchArray[1])
        break;
      case 'other':
        result = []
        let colArray = []
        searchArray.slice(2, searchArray.length).map((item, index) => {
          if (index === 0) {
            result.push([this.setSearchFormItem(item)])
            if (searchArray.length === 3) {
              result.push(['operatorButtons'])
            }
          } else {
            if (searchArray.slice(2, searchArray.length).length === 1) {
              result.push(['operatorButtons'])
            }
            else {
              colArray.push(this.setSearchFormItem(item)) 
              if (index === searchArray.length - 3) {
                if (colArray.length === 3) {
                  result.push(colArray)
                  result.push(['operatorButtons'])
                } else {
                  colArray.push('operatorButtons')
                  result.push(colArray)
                }
              } else {
                if (colArray.length === 3) {
                  result.push(colArray)
                  colArray = []
                }
              }
            }
          }

        })
        break;
      default:
        break;
    }
    return result;
  }
  setSearchFormItem = (searchData) => {
    const { form, language } = this.props
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    return (<AntdFormItem
      label={transferLanguage(searchData.name, language)}
      code={searchData.code}
      {...commonParams}
    >
      {this.switchFormComponent(searchData)}
    </AntdFormItem>)
  }
  onChange = () => {
    if (this.reset) {
      this.reset = false
      const { pageConfigData, pageData } = this.props;
      let customSearch = pageData ? pageData.customSearch ? pageData.customSearch : [] : pageConfigData[this.pageCode].listLayout.customSearch
      if (customSearch.length >= 1) {
        this.selectFormParams.firstFormItem = this.setSearch('first')
      }
      if (customSearch.length >= 2) {
        this.selectFormParams.secondFormItem = this.setSearch('second')
      }
      if (customSearch.length >= 3) {
        this.selectFormParams.otherFormItem = this.setSearch('other')
      }
    }


  }
  switchFormComponent = (value) => {
    const { dictObject } = this.props
    let component = <AntdInput />
    switch (value.type) {
      case 'text':
        break;
      case 'enum':
        component = <AdSelect
          data={dictObject[value.value]}
          payload={{ code: value.value }}
          show={{ id: 'value', name: 'code' }}
        />
        break;
      case 'callSelect':
        // 新增情况下是没有detail是
        component = <SearchSelect
          reset={this.reset}
          onChange={(val, type) => this.onChange(val, type, value)} // 获取选中值
          dataUrl={value.requestUrl}
          // url={value.queryUrl}
          showValue={value.showName ? value.showName : value.columns[0].dataIndex}
          multiple={false} // 是否多选
          // selectedData={mainDriver} // 选中值
          columns={value.columns} // 表格展示列
          id="managerCar_1"
          allowClear={true}
        />
        break;
      case 'date':
        component = <AntdDatePicker format={value.format} />
        break;
      case 'dateRange':
        component = <AntdDatePicker mode="range" format={value.format} />
        break;
      case 'number':
        component = <InputNumber style={{ width: '100%' }} />
        break;
      case 'textArea':
        component = <div style={{ position: 'relative', width: '100%' }}><AntdInput type='textarea' mode='search' /></div>
        break;
      default:
        break;
    }

    return component
  }

  setColums = (column) => {
    const { pageData, language } = this.props
    const columns = column.map((item, index) => {
      item.ellipsis = true;
      item.title = transferLanguage(item.title, language)
      if (item.sorter) {
        item.sorter = (a, b) => {
          if (typeof a === 'number') {
            return a[item.dataIndex] - b[item.dataIndex]
          }
          return (a[item.dataIndex]?.length || 0) - (b[item.dataIndex]?.length || 0)
        }
        item.sortDirections = ['descend', 'ascend']
      }
      if (!pageData && item.type === 'LINK') {
        item.render = (text, record) => {
          return (<a onClick={() => this.handleEdit(item, record)} >{text}</a>)
        }
      }
      if (item.title === '#') {
        item.render = (text, record, index) => (<span>{index + 1}</span>)
      }
      if (item.type === 'ATTACHMENT') {
        item.render = (text, record) => {
            /* text &&
            Number(text) > 0 &&  */ return (
            <Badge className="cus_badge" count={text}>
              <div className="head-example">
                <FileReader
                  type="list"
                  count={text}
                  params={{ bizId: record.id, fileBizType: item.fileBizType, fileToken: record[item.dataIndex] }}
                />
              </div>
            </Badge>)
        }
      }
      return item
    })
    if (columns[0].title !== '#')
      columns.unshift({
        title: '#',
        render: (text, record, index) => (<span>{index + 1}</span>)
      })
    this.setState({
      columns: columns
    })
  }

  selectVehicleDetail = ({ id, callback }) => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.detail,
      payload: { id },
      callback: data => {
        if (!data) return;
        callback && callback(data);
      },
    });
  };

  /**
   * form 查找条件 展开 收起
   */
  toggleForm = expandForm => {
    this.setState({
      expandForm,
    });
  };

  /**
   * form 查找条件 重置
   */
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.reset = true


    // this.saveAllValues({ formValues: {} });
    this.selectList();
  };

  /**
   * form 查找条件 查询
   */
  handleSearch = formValues => {
    // if (!formValues) return;
    this.saveAllValues({ formValues });
    this.selectList({ payload: formValues });
  };

  setOperate = (values) => {
    const { pageConfigData } = this.props
    let customSearch = pageData ? pageData.customSearch : pageConfigData[this.pageCode].listLayout.customSearch
    let formItem = customSearch?.map((v, index) => {
      if (!values[v.code]) {
        return
      }
      switch (v.type) {
        case 'date':
          values[v.code] = moment(values[v.code]).format(dateFormat)
          break;
        case 'dateRange':
          values[v.param1] = moment(values[v.code][0]).format(dateFormat)
          values[v.param2] = moment(values[v.code][1]).format(dateFormat)
          delete values[v.code]
          break;
        default:
          break;
      }
    })
    return values
  }


  /**
   * table 表格 批量选择
   */
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
      checkId: rows.map(item => { return item.id })
    });
  };

  // 设置弹窗
  setVisbleModal = (type, item, modalOpen) => {
    this.setState({
      [type]: !this.state[type]
    })
    if (type === 'autoModalVisible' && item) {
      this.setState({
        modalPageId: item.pageId,
        modalOpen: modalOpen,
        modalTitle: item.title,
        modalParamName: item.param
      })
    }
  }
  sortOk = (newColumns, fixedIndex) => {
    const { dispatch } = this.props;
    const data = {
      fixedColumn: fixedIndex,
      cloums: newColumns
    }
    dispatch({
      type: 'autoPage/updatePageUserConfig',
      payload: {
        configJson: JSON.stringify(data),
        menuId: this.pageCode,
        type: 'COLUMN'
      },
      callback: (data) => {
        if (data.code == 0) {
          this.setState({
            columns: newColumns,
            fixedColumn: fixedIndex
          })
        }
      }
    });
  }

  /**
   * table 表格 分页操作
   */
  handleStandardTableChange = param => {
    const { formValues } = this.props;
    this.selectList({ payload: { ...formValues, ...param } });
  };

  saveAllValues = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: allDispatchType.allValus,
      payload,
    });
  };

  //详情
  showDetail = detailId => {
    this.selectVehicleDetail({
      id: detailId,
      callback: data => {
        if (!data) return;
        this.setState({ detailId, visible: true });
      },
    });
  };

  // 左侧按钮提交
  btnOperation = (value) => {
    const { dispatch } = this.props
    dispatch({
      type: 'autoPage/saveFormData',
      payload: {
        [value.param]: this.state.checkId,
        requestUrl: value.requestUrl
      },
      callback: () => this.selectList()
    })
  }

  jumpToJudge = (pageId) => {
    let obj = {
      beCustom: true,
      router: ''
    }
    const menuList = JSON.parse(localStorage.getItem('menuList'))
    menuList.map(item => {
      item.children.map(children => {
        if (children.id === pageId) {
          obj.beCustom = children.beCustom
          obj.router = `/${item.id}/${children.id}`
        }
      })
    })
      
    return obj
  }

  //新建
  handleAdd = (buttonData) => {
    const { dispatch } = this.props
    const beCustomData = this.jumpToJudge(buttonData.pageId)
    if (!beCustomData.beCustom) {
      router.push(`${beCustomData.router}/add`);
      return
    }
    dispatch({
      type: 'autoPage/getOperatePageConfig',
      payload: {
        id: buttonData.pageId
      },
      // callback: (data) => {
      //   if (data.code === 0) {
      //     this.selectList()
      //   } else {
      //     this.setState({
      //       noPageConfig: true
      //     })
      //   }
      //   this.setState({
      //     pageLoadding: false
      //   })
      // }
    })
    router.push(`/pageAdd/${this.props.match.params.menu}/${buttonData.pageId}?parentPage=${this.pageCode}`);
  };

  //编辑
  handleEdit = (item, record) => {
    const beCustomData = this.jumpToJudge(item.pageId)
    if (!beCustomData.beCustom) {
      router.push(`${beCustomData.router}/edit/${record.id}`);
      return
    }
    router.push(`/pageEdit/${this.props.match.params.menu}/${item.pageId}/${record.id}`)
  };
  //导出事件
  exportFn = (item) => {
    const checkId = this.state.checkId
    const { dispatch, formValues } = this.props;
    if (item.message) {
      confirm({
        title: item.message,
        okText: 'Yes',
        okType: 'primary',
        cancelText: 'No',
        onOk() {
          dispatch({
            type: 'common/globalExportFn',
            payload: {
              url: item.requestUrl,
              params: {
                ...formValues,
                ids: checkId
              }
            },
          });
        },

      });
    } else {
      dispatch({
        type: 'common/globalExportFn',
        payload: {
          url: item.requestUrl,
          params: {
            ...formValues,
            ids: this.state.checkId
          }
        },
      });
    }

  }

  selectFormParams = {
    // firstFormItem: this.firstFormItem,
    // secondFormItem: this.secondFormItem,
    // otherFormItem: this.otherFormItem,
    // form,
    // code: codes.select,
    className: this.className,
    handleFormReset: this.handleFormReset,
    handleSearch: this.handleSearch,
    toggleForm: this.toggleForm,
    quickQuery: true
  };

  render() {
    const { loading, form, isMobile, vehicleDetail, pageList, formValues, pageConfigData, pageData, paramVal, language } = this.props;
    const { noPageConfig, modalOpen, modalTitle, selectedRows, expandForm, detailId, visible, columns, checkId, pageLoadding, advancedQueryVisible, quickSearchVisible, autoModalVisible, modalPageId, modalParamName,configJsonTable } = this.state;
    let autoList;
    if (paramVal) {
      autoList = pageList[paramVal] || {}
    } else {
      autoList = pageList[this.pageCode] || {}
    }
    const commonParams = {
      getFieldDecorator: form.getFieldDecorator,
    };
    const buttons = pageData ? pageData.buttons : pageConfigData[this.pageCode]?.listLayout?.buttons
    // const buttons = this.state.buttons.buttons
    this.selectFormParams.form = form
    // 配置列表左下角按钮
    const exportButton = pageConfigData[this.pageCode]?.listLayout?.exportButton
    let exportButtonList = ''
    if (exportButton) {
      exportButtonList = (
        <AdButton
          icon="download"
          onClick={() => this.exportFn(exportButton)}
          text={transferLanguage(exportButton.title, language)}
          style={{ position: 'absolute', bottom: '0' }}
        />
      )
    }
    const customSearch = pageData ? pageData.customSearch : pageConfigData[this.pageCode]?.listLayout?.customSearch
    const queryParams = pageConfigData[this.pageCode]?.listLayout?.quickSearchs?.queryParams;
    this.selectFormParams.customSearch = customSearch;
    this.selectFormParams.queryParams = queryParams;
    this.selectFormParams.form = form;
    const disabled = selectedRows.length > 0 ? false : true;
    const tableButtonsParams = {
      selectedLength: checkId.length,
      // handleAdd: this.handleAdd,
      buttons: (
        <Fragment>
          {buttons?.map((item, index) => {
            let enable = true;
            switch (item.enableType) {
              case 'NONE':
                enable = false
                break;
              case 'SINGELE':
                if (checkId.length === 1) {
                  // enableRule 规则需要重写
                  // if (item.enableRule && !eval(item.enableRule)) {

                  // } else {
                  enable = false
                  // }
                }
                break;
              case 'MULTI':
                if (checkId.length >= 1) {
                  // if (item.enableRule && !eval(item.enableRule)) {

                  // }
                  enable = false
                }
              default:
                break;
            }
            if (item.type !== 'COMMIT') {
              return
            }
            let enableRule = item.enableRule;
            let selectedRowsLength = selectedRows.length;
            if (selectedRows && selectedRowsLength > 0 && enableRule) {
              if (selectedRowsLength == 1) {
                //单选
                selectedRows.forEach((item, index) => {
                  if (enableRule && eval(enableRule)) {
                    enable = false
                  } else {
                    enable = true
                  }
                })
              } else {
                //多选
                let selectedNum = 0;
                selectedRows.forEach((item, index) => {
                  if (enableRule && eval(enableRule)) {
                    selectedNum += 1;
                  } else {
                    selectedNum -= 1;
                  }
                })
                if (selectedRowsLength === selectedNum) {
                  enable = false
                } else {
                  enable = true
                }
              }
            }else{
              enable = false;
            }
            return (<AdButton
              key={index}
              onClick={() => this.btnOperation(item)}
              disabled={enable}
              text={transferLanguage(item.title, language)}
              style={{ marginRight: '10px' }}
            />)
          })}
        </Fragment>
      ),
      rightButtons: (
        <Fragment>
          {buttons?.map((item, index) => {
            let enable = true
            switch (item.enableType) {
              case 'NONE':
                enable = false
                break;
              case 'SINGELE':
                if (checkId.length === 1) {
                  // enableRule 规则需要重写
                  // if (item.enableRule && !eval(item.enableRule)) {

                  // } else {
                  enable = false
                  // }
                }
                break;
              case 'MULTI':
                if (checkId.length >= 1) {
                  // if (item.enableRule && !eval(item.enableRule)) {

                  // }
                  enable = false
                }
              default:
                break;
            }
            if (item.type !== 'REDIRECT' && item.type !== 'POPUP') {
              return
            }
            let enableRule = item.enableRule;
            let selectedRowsLength = selectedRows.length;
            if (selectedRows && selectedRowsLength > 0 && enableRule) {
              if (selectedRowsLength == 1) {
                //单选
                selectedRows.forEach((item, index) => {
                  if (eval(enableRule)) {
                    enable = false
                  } else {
                    enable = true
                  }
                })
              } else {
                //多选
                let selectedNum = 0;
                selectedRows.forEach((item, index) => {
                  if (eval(enableRule)) {
                    selectedNum += 1;
                  } else {
                    selectedNum -= 1;
                  }
                })
                if (selectedRowsLength === selectedNum) {
                  enable = false
                } else {
                  enable = true
                }
              }
            }else{
              enable = false
            }
            return (<AdButton
              key={index}
              onClick={() => item.type === 'REDIRECT' ? this.handleAdd(item) : this.setVisbleModal('autoModalVisible', item, 'ADD')}
              disabled={enable}
              // code={codes.enable}
              text={transferLanguage(item.title, language)}
              style={{ marginRight: '10px' }}
            />)
          })}
        </Fragment>
      ),
    };
    const quickSearchParams = {
      visible: quickSearchVisible,
      columnsData: columns,
      modalEmpty: () => this.setVisbleModal('quickSearchVisible'),
      searchList: (payload) => { this.setState({ quickSearch: true }); this.selectList(payload) }
    }
    const advancedQueryParams = {
      visible: advancedQueryVisible,
      columnsData: columns,
      modalEmpty: () => this.setVisbleModal('advancedQueryVisible'),
      searchList: (payload) => { this.setState({ quickSearch: true }); this.selectList(payload) }
    }

    return (
      <Fragment>
        <Spin size="small" spinning={pageLoadding} style={{ margin: '0 auto' }} tip="Loadding" >
          {!noPageConfig && <div>
            <SelectForm {...this.selectFormParams} />
            {/* {!expandForm && <>
              <Button shape="round" onClick={() => this.setVisbleModal('quickSearchVisible')} icon="search" size='small' style={{ position: 'absolute', right: '70px', top: '0px' }} >
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red', position: 'absolute', right: '5px', top: '3px' }} />
              </Button>
              <Button shape="round" onClick={() => this.setVisbleModal('advancedQueryVisible')} icon="search" size='small' style={{ position: 'absolute', right: '20px', top: '0px' }} >
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'red', position: 'absolute', right: '5px', top: '3px' }} />
              </Button>
            </>} */}
            <TableButtons {...tableButtonsParams} />
            <StandardTable
              sortOk={this.sortOk}
              selectedRows={selectedRows}
              loading={loading}
              data={autoList}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onPaginationChange={this.handleStandardTableChange}
              code={codes.page}
              scrollX={1800}
              expandForm={expandForm}
              className={this.className}
              configJsonTable={configJsonTable}
              // exportBtn={JSON.stringify(pageConfigData) !== '{}' && pageConfigData[this.pageCode]?.listLayout.exportUrl ? true : false}
              // exportParams={{
              //   url: JSON.stringify(pageConfigData) !== '{}' && pageConfigData[this.pageCode]?.layout.exportUrl,
              //   params: {
              //     ...formValues,
              //     ids: checkId
              //   }
              // }}
              exportButtonList={exportButtonList}
            />
          </div>}
          {noPageConfig && <NotConfigPage getPageConfig={() => this.getPageConfig()} />}
          {autoModalVisible && <AntoModal refreshPage={() => this.selectList()} visible={true} modalOpen={modalOpen} modalTitle={modalTitle} modalParamName={modalParamName} modalParamVal={checkId} paramVal={paramVal} handleCancel={() => this.setVisbleModal('autoModalVisible')} pagecode={modalPageId || 'userEdit'} />}
          <AdvancedQueryModal {...advancedQueryParams} className={this.className} />
          <QuickSearchModal {...quickSearchParams} className={this.className} />
        </Spin >
      </Fragment>
    );
  }
}
