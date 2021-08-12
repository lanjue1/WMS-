import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { isArray } from 'util';
import debounce from 'lodash/debounce';
import { isString } from 'util';
import StandardTable from '@/components/StandardTable';
const { Option } = Select;
@connect(({ component, loading }) => ({
  searchValue: component.searchValue,
  loading: loading.effects['component/queryComponentList'],
}))
export default class AdSearch extends Component {
  static defaultProps = {
    multiple: true,
    label: 'id',
    name: 'name',
    onlyRead: false,
    searchName: 'name',
    expandRow: false,
    scrollX: 1000, // 表格x
    scrollY: 240, // 表格y
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isOperation: false,
      searchValue: '',
      selectedRows: [],
      expandSearchData: [],
      selectedData: [],
      allData: [],
      value: undefined,
    };
    this.onSelectSearch = debounce(this.onSelectSearch, 800);
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      if (isArray(value)) {
        if (value.length > 0) this.setState({ selectedRows: value });
      } else {
        this.querySelectData(value);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value) {
      if (isArray(value)) {
        if (value.length > 0) this.setState({ selectedRows: value });
      } else {
        this.querySelectData(value);
      }
    }
  }

  /**
   * 查询选中值 id 数据
   */
  querySelectData = id => {
    const { url, dispatch } = this.props;
    dispatch({
      type: 'component/queryComponentList',
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
   * 查询表格data
   */
  queryData = ({ params = {}, callback } = {}) => {
    const { dispatch, dataUrl, payload, expandRow } = this.props;
    const { expandSearchData } = this.state;
    dispatch({
      type: 'component/queryComponentList',
      payload: {
        params: params.id ? { flag: 'table', ...params } : { flag: 'table', ...params, ...payload },
        url: dataUrl,
      },
      callback: data => {
        if (!data) return;
        if (expandRow) {
          if (expandSearchData.length === 0) {
            this.setState({
              expandSearchData: data.map(v => {
                return { children: [], ...v };
              }),
            });
            if (data.length === 1) {
              this.onExpandRow(true, data[0]);
            }
          }
        } else {
          const { list, pageSize, total, pageNum } = data;
          this.setState({
            allData: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            },
          });
        }
        if (callback) callback(data);
      },
    });
  };

  onFocus = () => {
    const { isOpen } = this.state;
    if (!isOpen) {
      this.queryData();
      this.setState({ isOpen: true });
      // 监听输入框enter
      this.inputEnter();
      // 监听面板
      // this.tableUpDown();
    }
  };

  inputEnter = () => {
    const { id } = this.props;
    setTimeout(() => {
      const ele = document.querySelector(`#${id} .ant-select-search__field`);
      if (ele) {
        ele.addEventListener('keyup', e => {
          if (e.keyCode === 13) {
            const { label, multiple } = this.props;
            const { selectedRows, searchValue, selectedData } = this.state;
            if (multiple) {
              if (selectedData.list.length > 0 && searchValue !== '') {
                if (!selectedRows.map(v => v[label]).includes(selectedData.list[0][label])) {
                  this.setState({ selectedRows: [...selectedRows, selectedData.list[0]] });
                  this.triggerChange([...selectedRows, selectedData.list[0]]);
                  this.queryData();
                }
              }
            } else {
              this.setState({ selectedRows: [selectedData.list[0]] });
              this.triggerChange([selectedData.list[0]]);
              this._input.blur();
              this.setState({ isOpen: false, isOperation: false });
            }
          }
        });
      }
    }, 20);
  };

  onBlur = () => {
    const { isOperation } = this.state;
    if (isOperation) return;
    this.setState({ isOpen: false });
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
   * 多选 复选框选择
   */
  onSelect = (record, selected) => {
    this._input.focus();
    const { selectedRows } = this.state;
    const { label, multiple } = this.props;
    let selectedData = [];
    if (selected) {
      selectedData = [...selectedRows, record];
    } else {
      selectedData = [...selectedRows.filter(v => v[label] !== record[label])];
    }
    this.setState({ selectedRows: selectedData });
    this.triggerChange(selectedData);
  };

  /**
   * 全选
   */
  onSelectAll = (record, _, selectedRows) => {
    this._input.focus();
    const { label } = this.props;
    let selectedData = [];
    if (record) {
      selectedData = [...this.state.selectedRows, ...selectedRows];
    } else {
      selectedData = [
        ...this.state.selectedRows.filter(v => !selectedRows.map(v => v[label]).includes(v[label])),
      ];
    }
    this.setState({ selectedRows: selectedData });
    this.triggerChange(selectedData);
  };

  /**
   * 多选 取消操作
   */
  handleChange = value => {
    const { label, allowClear } = this.props;
    let selectedRows = [];
    if (!allowClear) {
      selectedRows = this.state.selectedRows.filter(v => value.includes(v[label]));
    } else {
      this.setState({ isOperation: false }, () => {
        this._input.blur();
      });
    }
    this.setState({ selectedRows });
    this.triggerChange(selectedRows);
  };

  /**
   *单选 点击选择
   */
  onClick = (record, e) => {
    e.stopPropagation();
    const { multiple, label } = this.props;
    if (multiple) {
      this._input.focus();
      const { selectedRows } = this.state;
      let selected = [];
      if (selectedRows.findIndex(v => v[label] === record[label]) === -1) {
        selected = [...selectedRows, record];
      } else {
        selected = selectedRows.filter(v => v[label] !== record[label]);
      }
      this.setState({ selectedRows: selected });
      this.triggerChange(selected);
    } else {
      this.setState({ selectedRows: [record] });
      this.triggerChange([record]);
      this._input.blur();
      this.setState({ isOpen: false, isOperation: false });
    }
  };

  /**
   * 多选 双击选择与取消
   */
  onDoubleClick = (record, e) => {
    const { multiple } = this.props;
    this.onClick(record, e);
    if (multiple) {
      this.setState({ isOperation: false }, () => {
        this._input.blur();
      });
    }
  };

  triggerChange = value => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  clickInside = () => {
    this._input.focus();
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

  onExpandRow = (expanded, record) => {
    const { isOpen } = this.state;
    if (isOpen) {
      this._input.focus();
    }

    if (!expanded) return;
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
      multiple,
      searchValue,
      columns,
      onlyRead,
      label,
      url,
      name,
      value,
      expandRow,
      loading,
      id,
      scrollY,
      scrollX,
      onChange,
      ...rest
    } = this.props;
    const { isOpen, selectedRows, selectedData, expandSearchData, allData } = this.state;
    return onlyRead ? (
      selectedRows.map(v => v[name]).join(',')
    ) : (
      <div id={id}>
        <Select
          showSearch
          maxTagCount={10}
          open={isOpen}
          mode={multiple && 'multiple'}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onSearch={this.onSelectSearch}
          onChange={this.handleChange}
          ref={input => (this._input = input)}
          value={selectedRows.map(v => v[label])}
          style={{ width: '100%' }}
          placeholder={formatMessage({ id: 'form.select.placeholder' })}
          dropdownRender={() => {
            return (
              <div
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
                onClick={this.clickInside}
                id={`${id}-myTable`}
              >
                <StandardTable
                  onSelect={this.onSelect}
                  onSelectAll={this.onSelectAll}
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
                  simple
                  disabledRowSelected={!multiple}
                  loading={loading}
                  showAllCount={true}
                  selectedRows={selectedRows}
                  scrollX={scrollX}
                  scrollY={scrollY}
                  data={expandRow ? { list: expandSearchData } : allData}
                  columns={columns}
                  onPaginationChange={this.handleStandardTableChange}
                />
              </div>
            );
          }}
          {...rest}
        >
          {selectedRows.map(v => {
            return (
              <Option key={v[label]} value={v[label]} style={{ display: 'none' }}>
                {v[name]}
              </Option>
            );
          })}
        </Select>
      </div>
    );
  }
}
