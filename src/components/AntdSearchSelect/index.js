import React, { Component } from 'react';
import { Table, Modal, Input, Button, Icon, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import styles from './index.less';
import { connect } from 'dva';
import Item from 'antd/lib/list/Item';
const Search = Input.Search;

@connect(({ common, loading }) => ({
  searchData: common.searchData,
  loading: loading.effects['common/querySearchData'],
}))
export default class AntdSearchSelect extends Component {
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
  };

  static defaultProps = {
    url: '', // 选中值 id 查询数据url
    dataUrl: '', // 表格数据查询 url
    // selectedData: [], // 选中值
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
    // onChange: () => {}, // 值改变
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedRows: props.value,
      isOpen: false,
      isOperation: false,
      searchValue: '',
      isInside: false,
    };
    this.onSelectSearch = debounce(this.onSelectSearch, 800);
  }

  componentWillMount() {
    const { dataUrl } = this.props;
    if (dataUrl) {
      this.queryData();
    }
  }
  componentDidMount() {
    const { value, url } = this.props;
    if (!url || (value && (value.length === 0 || value[0].id === ''))) return;
    if (value[0].id) {
      this.querySelectData(value[0].id);
    }
  }

  /**
   * 查询表格data
   */
  queryData = (params = {}, callback = () => {}) => {
    const { dispatch, dataUrl, payload } = this.props;
    dispatch({
      type: 'common/querySearchData',
      payload: { params: { ...payload, ...params }, url: dataUrl },
      callback,
    });
  };

  /**
   * 查询数据
   */
  onSelectSearch = searchValue => {
    const { searchName } = this.props;
    this.queryData({
      [searchName]: searchValue,
    });
    this.setState({ searchValue });
  };

  /**
   * 翻页
   */
  handleStandardTableChange = values => {
    const { searchValue } = this.state;
    const { searchName } = this.props;
    this.queryData({ ...values, [searchName]: searchValue });
  };

  /**
   * 查询选中值 id 数据
   */
  querySelectData = id => {
    const { url, dispatch } = this.props;
    dispatch({
      type: 'common/querySelectSearch',
      payload: {
        params: { id },
        url,
      },
      callback: data => {
        if (!data) return;
        this.setState({ selectedRows: [data] });
      },
    });
  };

  /**
   * 选择值 更新
   */
  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.payload) !== JSON.stringify(this.props.payload)) {
      this.queryData();
    }
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      const { url } = nextProps;
      if (url) {
        if (nextProps.value.length > 0 && Object.keys(nextProps.value[0]).length === 1) {
          this.querySelectData(nextProps.value[0].id);
        } else {
          this.setState({ selectedRows: nextProps.value });
        }
      } else {
        this.setState({ selectedRows: nextProps.value });
      }
    }
  }

  /**
   * 多选 双击选择与取消
   */
  onDoubleClick = record => {
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
  onClick = record => {
    this._input.focus();
    const { multiple, showValue } = this.props;
    if (multiple) {
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
    }
  };

  /**
   * 将值传到父级页面
   */
  saveSelectdRows = selectedRows => {
    const { onChange } = this.props;
    onChange(selectedRows);
    this.triggerChange(selectedRows);
  };

  triggerChange = value => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };

  /**
   * 面板显示
   */
  onFocus = () => {
    if (this.state.searchValue !== '' && this.props.multiple) {
      this.queryData();
    }
    if (this.state.isOpen) return;
    this._input.focus();
    this.queryData();
    this.setState({ isOpen: true }, () => {
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
    this._input.focus();
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
      nextState.isOperation !== this.state.isOperation
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const {
      loading,
      columns,
      multiple,
      showValue,
      scrollX,
      scrollY,
      onlyRead,
      allowClear,
      searchData,
      disabled,
      id,
    } = this.props;
    const { selectedRows, isOpen, searchValue } = this.state;
    return onlyRead ? (
      <span>{selectedRows && selectedRows.map(v => v[showValue]).join(' ')}</span>
    ) : (
      <div id={id}>
        <Select
          showSearch={true}
          ref={input => (this._input = input)}
          mode={multiple ? 'multiple' : null}
          open={isOpen}
          allowClear={allowClear}
          showArrow={true}
          maxTagCount={10}
          disabled={disabled}
          placeholder="请选择"
          value={selectedRows && selectedRows.map(v => v[showValue])}
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
                        this.onDoubleClick(record);
                      },
                      onClick: event => {
                        this.onClick(record);
                      },
                    };
                  }}
                  disabledRowSelected={!multiple}
                  loading={loading}
                  showAllCount={true}
                  selectedRows={selectedRows}
                  scroll={{ x: scrollX, y: scrollY }}
                  data={searchData}
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
          {/* {data.list &&
          data.list.map(item => (
            <Select.Option key={item[showValue]} value={item[showValue]}>
              {item[itemName]}
            </Select.Option>
          ))} */}
        </Select>
      </div>
    );
  }
}
