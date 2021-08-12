import React, { Component } from 'react';
import { Table, Modal, Input, Button, Icon, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import styles from './index.less';
import { connect } from 'dva';
import Item from 'antd/lib/list/Item';
import { transferLanguage } from '@/utils/utils'
import { getPageSize } from '@/utils/common';
const Search = Input.Search;

@connect(({ common, loading, i18n }) => ({
  searchData: common.searchData,
  loading: loading.effects['common/querySearchData'],
  language: i18n.language,
}))
export default class SearchSelect extends Component {
  static propTypes = {
    url: PropTypes.string,
    dataUrl: PropTypes.string,
    selectedData: PropTypes.array,
    multiple: PropTypes.bool,
    columns: PropTypes.array,
    showValue: PropTypes.string,
    scrollX: PropTypes.number,
    scrollY: PropTypes.number,
    onlyRead: PropTypes.bool,
    allowClear: PropTypes.bool,
    disabled: PropTypes.bool,
    searchName: PropTypes.string,
    onChange: PropTypes.func,
    defaultParams: PropTypes.object,
  };

  static defaultProps = {
    url: '', // 选中值 id 查询数据url
    dataUrl: '', // 表格数据查询 url
    selectedData: [], // 选中值
    multiple: true, // 是否多选
    columns: [], // 表格展示列
    showValue: 'name', // 选中展示列
    scrollX: 1000, // 表格x
    scrollY: 240, // 表格y
    onlyRead: false, // 是否查看模式
    allowClear: false, // 是否显示清除按钮
    disabled: false, // 是否禁用
    searchName: 'name', // 搜索字段
    payload: {},
    expandRow: false,
    onChange: () => { }, // 值改变
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: props.selectedData,
      isOpen: false,
      isOperation: false,
      searchValue: '',
      isInside: false,
      expandSearchData: [],
      paramsValue: props.paramsValue
    };
    this.onSelectSearch = debounce(this.onSelectSearch, 800);
  }

  componentWillMount() {
    const { selectedData, url, dataUrl, expandRow } = this.props;
    // if (dataUrl) {
    //   this.queryData();
    // }
  }

  componentDidMount() {
    const { selectedData, url } = this.props;
    if (!url || (selectedData && (selectedData.length === 0 || selectedData[0].id === ''))) return;
    this.querySelectData(selectedData);
  }

  /**
   * 查询表格data
   */
  queryData = ({ params = {}, callback } = {}) => {
    const { dispatch, dataUrl, payload, expandRow, filterParent, objParams } = this.props;
    const { expandSearchData, paramsValue } = this.state;
    let param = {}
    param = params.id ? params : { ...params, ...payload }
    param = { ...param, ...paramsValue, ...objParams }
    // 需要分页,列表默认是从本地取的size
    param['needPages'] = true
    dispatch({
      type: 'common/querySearchData',
      payload: { params: param, url: dataUrl, ...paramsValue },
      callback: data => {
        if (!data) return;
        if (expandRow) {
          if (expandSearchData.length === 0) {
            if (!filterParent) {
              this.setState({
                expandSearchData: data.map(v => {
                  return { children: [], ...v };
                }),
              });
            }

            if (data.length === 1) {
              if (filterParent) {
                this.queryData({
                  params: { id: data[0].id },
                  callback: newData => {
                    this.setState({
                      expandSearchData: newData.map(v => {
                        return { children: [], ...v };
                      }),
                    });
                  },
                });
              } else {
                this.onExpandRow(false, data[0]);
              }
            }
          }
        }
        if (callback) callback(data);
      },
    });
  };

  formateData = (expandSearchData, data, id) => {
    expandSearchData.forEach(v => {
      if (v.children.length === 0 && v.id === id) {
        v.children = data.map(v => {
          return { children: [], ...v };
        });
      } else {
        this.formateData(v.children, data, id);
      }
    });
  };

  /**
   * 查询数据
   */
  onSelectSearch = searchValue => {
    const { searchName, expandRow } = this.props;
    if (expandRow) return;
    this.queryData({
      params: { [searchName]: searchValue },
    });
    this.setState({ searchValue });
  };

  /**
   * 翻页
   */
  handleStandardTableChange = values => {
    const { searchValue } = this.state;
    const { searchName } = this.props;
    this.queryData({ params: { ...values, [searchName]: searchValue } });
  };

  /**
   * 查询选中值 id 数据
   */
  querySelectData = data => {
    const { url, dispatch } = this.props;

    const newData = data.filter(v => v.id);

    const read = item => {
      return item.map(v => {
        return new Promise(resolve => {
          dispatch({
            type: 'common/querySelectSearch',
            payload: {
              params: { id: v.id },
              url,
            },
            callback: res => {
              if (!res) return;
              resolve(res);
            },
          });
        });
      });
    };
    Promise.all(read(newData))
      .then(result => {
        this.setState({ selectedRows: result });
      })
      .catch(error => { });
  };

  /**
   * 选择值 更新
   */
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.payload) !== JSON.stringify(this.props.payload)) {
      this.queryData();
    }
    if (JSON.stringify(nextProps.selectedData) !== JSON.stringify(this.props.selectedData)) {
      const { dataUrl, dispatch } = nextProps;
      if (dataUrl) {
        if (nextProps.selectedData.length) {
          this.setState({ selectedRows: nextProps.selectedData });
          this.saveSelectdRows(nextProps.selectedData, 1)
        }
      } else {
        this.setState({ selectedRows: nextProps.selectedData });
      }
    }
    // 废弃
    // if (JSON.stringify(nextProps.dataName) !== JSON.stringify(this.props.dataName)) {
    //   let s = {}
    //   s['id']= nextProps.dataCode
    //   s[this.props.showValue] = nextProps.dataName
    //   this.setState({ selectedRows: [s] });
    //   // 详情回显
    //   this.saveSelectdRows([s], 1);
    // }
    if (JSON.stringify(nextProps.paramsValue) != "{}" && (JSON.stringify(nextProps.paramsValue) !== JSON.stringify(this.props.paramsValue))) {
      this.setState({ selectedRows: [] });
      this.saveSelectdRows();
      this.setState({
        paramsValue: nextProps.paramsValue
      })
    }
    if (nextProps.reset) {
      this.setState({ selectedRows: [] });
    }

  }

  /**
   * 多选 双击选择与取消
   */
  onDoubleClick = (record, e) => {
    e.stopPropagation();
    const { multiple, showValue } = this.props;
    const { selectedRows } = this.state;
    if (multiple) {
      let selected = [];
      if (selectedRows.findIndex(v => v[showValue] === record[showValue]) === -1) {
        selected = [...selectedRows, record];
      } else {
        selected = selectedRows.filter(v => v[showValue] !== record[showValue]);
      }
      this.setState({ selectedRows: selected });
      this.saveSelectdRows(selected);
    } else {
      this.saveSelectdRows([record]);
      this.setState({ selectedRows: [record] });
    }

    this.setState({ isOperation: false }, () => {
      this._input.blur();
    });
  };

  /**
   * 多选 取消操作
   */
  handleChange = value => {
    const { showValue, allowClear } = this.props;
    let selectedRows = [];
    if (!allowClear) {
      selectedRows = this.state.selectedRows.filter(v => value.includes(v[showValue]));
    }
    this.setState({ selectedRows });
    this.saveSelectdRows(selectedRows);
  };

  /**
   * 复选框选择
   */
  onSelect = (record, selected) => {
    this._input.focus();
    const { selectedRows } = this.state;
    const { showValue, multiple } = this.props;
    let selectedData = [];
    if (selected) {
      selectedData = [...selectedRows, record];
    } else {
      selectedData = [...selectedRows.filter(v => v[showValue] !== record[showValue])];
    }
    this.setState({ selectedRows: selectedData });
    this.saveSelectdRows(selectedData);
  };

  /**
   * 全选
   */
  onSelectAll = (record, selected, selectedRows) => {
    this._input.focus();
    const { showValue } = this.props;
    let selectedData = [];
    if (record) {
      selectedData = [...this.state.selectedRows, ...selectedRows];
    } else {
      selectedData = [
        ...this.state.selectedRows.filter(
          v => !selectedRows.map(v => v[showValue]).includes(v[showValue])
        ),
      ];
    }

    this.setState({ selectedRows: selectedData });
    this.saveSelectdRows(selectedData);
  };

  /**
   *单选 点击选择
   */
  onClick = (record, e) => {
    e.stopPropagation();
    const { multiple, showValue } = this.props;
    if (multiple) {
      this._input.focus();
      const { selectedRows } = this.state;
      let selected = [];
      if (selectedRows.findIndex(v => v[showValue] === record[showValue]) === -1) {
        selected = [...selectedRows, record];
      } else {
        selected = selectedRows.filter(v => v[showValue] !== record[showValue]);
      }
      this.setState({ selectedRows: selected });
      this.saveSelectdRows(selected);
    } else {
      this.saveSelectdRows([record]);
      this.setState({ selectedRows: [record] });
      this._input.blur();
      this.setState({ isOpen: false, isOperation: false });
      // this.clickInside();
      // this.setState({ isOperation: false }, () => {
      //   this._input.blur();
      // });
    }
  };

  /**
   * 将值传到父级页面
   */
  saveSelectdRows = (selectedRows, type) => {
    const { onChange } = this.props;
    onChange(selectedRows, type);
  };

  /**
   * 面板显示
   */
  onFocus = () => {
    if (this.state.searchValue !== '' && this.props.multiple) {
      this.queryData();
    }
    this._input.focus();
    if (this.state.isOpen) return;
    this.setState({ isOpen: true }, () => {
      this.queryData();
      setTimeout(() => {
        const { id } = this.props;
        if (document.querySelector(`#${id} .ant-select-search__field`)) {
          // document.querySelector('#myInput .ant-select-search__field')
          document
            .querySelector(`#${id} .ant-select-search__field`)
            .addEventListener('keyup', e => {
              if (e.keyCode === 13) {
                const { searchData, showValue, multiple } = this.props;
                const { selectedRows, searchValue } = this.state;
                if (multiple) {
                  if (searchData.list.length > 0 && searchValue !== '') {
                    if (
                      !selectedRows.map(v => v[showValue]).includes(searchData.list[0][showValue])
                    ) {
                      this.saveSelectdRows([...selectedRows, searchData.list[0]]);
                      this.setState({ selectedRows: [...selectedRows, searchData.list[0]] });
                    }
                  }
                } else {
                  this.saveSelectdRows([searchData.list[0]]);
                  this.setState({ selectedRows: [searchData.list[0]] });
                  this.clickInside();
                  this.setState({ isOperation: false }, () => {
                    this._input.blur();
                  });
                }
              }
            });
        }
      }, 1000);
    });
  };

  /**
   * 失去焦点
   */
  onBlur = () => {
    const { isOperation } = this.state;
    if (isOperation) return;
    this.closeSelect();
  };

  clickInside = () => {
    // this._input.focus();
  };

  /**
   * 关闭面板
   */
  closeSelect = () => {
    this.setState({ isOpen: false });
  };

  /**
   * 鼠标离开面板
   */
  onMouseLeave = () => {
    const { isOperation } = this.state;
    if (!isOperation) return;
    this.setState({ isOperation: false });
  };

  /**
   * 鼠标进入面板
   */
  onMouseEnter = () => {
    const { isOperation } = this.state;
    if (isOperation) return;
    this.setState({ isOperation: true });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) ||
      JSON.stringify(nextState.selectedRows) !== JSON.stringify(this.state.selectedRows) ||
      nextProps.loading !== this.props.loading ||
      nextState.isOpen !== this.state.isOpen ||
      nextProps.disabled !== this.props.disabled ||
      nextState.isOperation !== this.state.isOperation ||
      nextProps.expandRow !== this.props.expandRow
    ) {
      return true;
    } else {
      return false;
    }
  }
  onExpandRow = (expanded, record, r) => {
    const { isOpen } = this.state;
    if (isOpen) {
      this._input.focus();
    }

    if (!expanded) return;
    // if (record.children.length > 0) return;
    this.queryData({
      params: { id: record.id },
      callback: data => {
        if (!data) return;
        this.formateData(this.state.expandSearchData, data, record.id);
      },
    });
  };

  render() {
    const {
      loading,
      columns,
      multiple,
      showValue,
      scrollX,
      scrollY,
      selectedData,
      onlyRead,
      allowClear,
      searchData,
      disabled,
      expandRow,
      id,
      language
    } = this.props;
    const { selectedRows, isOpen, searchValue, expandSearchData } = this.state;
    // console.log('expandSearchData', searchValue, expandSearchData)
    return onlyRead ? (
      <span>{selectedRows.map(v => v[showValue]).join(' ')}</span>
    ) : (
      <div id={id} style={{ height: '32.5px' }}>
        <Select
          showSearch={true}
          ref={input => (this._input = input)}
          mode={multiple ? 'multiple' : null}
          open={isOpen}
          allowClear={allowClear}
          showArrow={true}
          maxTagCount={10}
          disabled={disabled}
          placeholder={transferLanguage('Common.field.select', language)}
          value={selectedRows.filter(v => v[showValue]).map(v => v[showValue])}
          // value={selectedRows.map(v => v[showValue])}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onSearch={this.onSelectSearch}
          onChange={this.handleChange}
          dropdownRender={() => {
            return (
              <div
                className={styles.customTable}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onClick={this.clickInside}
              >
                <StandardTable
                  id="myTable"
                  ref={table => (this._table = table)}
                  onSelect={this.onSelect}
                  onSelectAll={this.onSelectAll}
                  size="small"
                  borderd={true}
                  simple={true}
                  onRow={record => {
                    return {
                      onDoubleClick: event => {
                        this.onDoubleClick(record, event);
                      },
                      onClick: event => {
                        this.onClick(record, event);
                      },
                    };
                  }}
                  onExpandRow={this.onExpandRow}
                  defaultExpandedRowKeys={
                    expandRow ? (expandSearchData.length === 1 ? [expandSearchData[0].id] : []) : []
                  }
                  disabledRowSelected={!multiple}
                  loading={loading}
                  showAllCount={true}
                  selectedRows={selectedRows}
                  scroll={{ x: scrollX, y: scrollY }}
                  data={expandRow ? { list: expandSearchData } : searchData}
                  columns={columns}
                  onPaginationChange={this.handleStandardTableChange}
                // title={() => {
                //   return (
                //     <Search placeholder={`${searchObj}搜索`} autoFocus onSearch={this.onSearch} />
                //   );
                // }}
                />
                {/* <div className={styles.modalClose} onClick={this.closeSelect}>
                <Icon type="close" />
              </div> */}
              </div>
            );
          }}
        >
        </Select>
      </div>
    );
  }
}
