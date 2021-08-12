import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { TreeSelect } from 'antd';
import { connect } from 'dva';
import { isArray } from 'util';
const TreeNode = TreeSelect.TreeNode;

@connect(({ component }) => ({
  component,
}))
export default class AntdTreeSelect extends Component {
  static defaultProps = {
    next: 'menuBODetail',
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      list: [],
      tempList: [],
      treeExpandedKeys: [],
    };
  }

  queryData = ({ params = {}, callback } = {}) => {
    const { dispatch, dataUrl, dynamic, next, filter, paramsLabel } = this.props;
    dispatch({
      type: 'component/queryComponentList',
      payload: { params: { ...params }, url: dataUrl },
      callback: list => {
        if (!list) return;
        if (dynamic) {
          if (filter) {
            if (this.state.list.length === 0 && params[paramsLabel] !== 0) {
              const newList = list.map((item, index) => {
                if (item.childNumber !== undefined && item.childNumber === 0) {
                  return item;
                } else {
                  return { [next]: [{ id: index }], ...item };
                }
              });
              this.setState({ list: newList });
            }
          } else {
            if (this.state.list.length === 0) {
              const newList = list.map((item, index) => {
                if (item.childNumber !== undefined && item.childNumber === 0) {
                  return item;
                } else {
                  return { [next]: [{ id: index }], ...item };
                }
              });
              this.setState({ list: newList });
            }
          }
        } else {
          this.setState({ list });
        }
        if (callback) callback(list);
      },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      const { value, filter } = nextProps;
      if (isArray(value)) {
        const length = filter ? 3 : 3;
        this.querySelectData(value.length - length, value);
        this.setState({ value: value[value.length - length + 1], treeExpandedKeys: value });
      } else {
        this.setState({ value });
      }
    }
  }

  triggerChange = value => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };

  onChange = value => {
    this.setState({ value });
    this.triggerChange(value);
  };

  renderTreeNodes = data => {
    const { next, label } = this.props;
    return data.map(item => {
      if (item[next]) {
        return (
          <TreeNode title={item[label]} key={item.id} value={item.id} dataRef={item}>
            {this.renderTreeNodes(item[next])}
          </TreeNode>
        );
      } else {
        return <TreeNode title={item[label]} value={item.id} key={item.id} dataRef={item} />;
      }
    });
  };

  querySelectData = (index, selectedData) => {
    const { next, paramsLabel, label, filter } = this.props;
    this.queryData({
      params: { [paramsLabel]: selectedData[index] },
      callback: data => {
        const length = filter ? 3 : 3;
        if (index === selectedData.length - length) {
          const newOptions = data.map((item, i) => {
            return {
              id: item.id,
              name: item[label],
              [next]:
                item.childNumber !== undefined && item.childNumber === 0
                  ? []
                  : [{ id: `${selectedData[index]}-${i}` }],
            };
          });
          this.setState({
            options: newOptions,
          });
        } else {
          const targetOptions = data.map((item, i) => {
            if (item.id === selectedData[index + 1]) {
              return {
                id: item.id,
                name: item[label],
                [next]: this.state.list,
              };
            } else {
              return {
                id: item.id,
                name: item[label],
                [next]:
                  item.childNumber !== undefined && item.childNumber === 0
                    ? []
                    : [{ id: `${selectedData[index]}-${i}` }],
              };
            }
          });
          this.setState({
            list: targetOptions,
          });
        }
        if (--index >= 0) {
          this.querySelectData(index, selectedData);
        }
      },
    });
  };

  onTreeExpand = expandedKeys => {
    const { paramsLabel, dynamic } = this.props;
    if (!dynamic) return;
    const { list } = this.state;
    this.queryData({
      params: { [paramsLabel]: expandedKeys[expandedKeys.length - 1] },
      callback: data => {
        if (!data) return;
        this.formateData(list, data, expandedKeys[expandedKeys.length - 1]);
      },
    });
  };

  formateData = (expandSearchData, data, id) => {
    const { next } = this.props;
    expandSearchData.forEach(v => {
      if (v[next].length === 1 && Object.keys(v[next][0]).length === 1 && v.id === id) {
        v[next] = data.map((item, index) => {
          if (item.childNumber !== undefined && item.childNumber === 0) {
            return item;
          } else {
            return { [next]: [{ id: `${id}-${index}` }], ...item };
          }
        });
        this.setState({ tempList: data });
      } else {
        if (v[next].length > 1) {
          this.formateData(v[next], data, id);
        }
      }
    });
  };

  onFocus = () => {
    const { list } = this.state;
    if (list.length > 0) return;
    const { dynamic, paramsLabel, filter } = this.props;
    if (dynamic) {
      if (filter) {
        this.queryData({
          params: { [paramsLabel]: 0 },
          callback: data => {
            if (!data) return;
            this.queryData({ params: { [paramsLabel]: data[0].id } });
          },
        });
      } else {
        this.queryData({ params: { [paramsLabel]: 0 } });
      }
    } else {
      this.queryData();
    }
  };

  render() {
    const { dataUrl, dynamic, value, ...rest } = this.props;
    const { list, treeExpandedKeys } = this.state;
    return (
      <TreeSelect
        showSearch={!dynamic}
        allowClear
        onTreeExpand={this.onTreeExpand}
        filterTreeNode={(input, option) =>
          option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={formatMessage({ id: 'form.select.placeholder' })}
        onChange={this.onChange}
        onFocus={this.onFocus}
        treeDefaultExpandedKeys={treeExpandedKeys}
        value={this.state.value}
        {...rest}
      >
        {this.renderTreeNodes(list)}
      </TreeSelect>
    );
  }
}
