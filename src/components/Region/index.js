import React, { Component, Fragment } from 'react';
import { Cascader, Input, Button, Row, Col, Tag } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { formatMessage } from 'umi-plugin-react/locale';
import { isString } from 'util';
import { editGutter } from '@/utils/constans';

@connect(({ common }) => ({
  common,
}))
export default class Region extends Component {
  static propTypes = {
    url: PropTypes.string,
    label: PropTypes.string,
    length: PropTypes.number,
    onChange: PropTypes.func,
    // disabled: PropTypes.boolean,
  };

  static defaultProps = {
    url: 'selectOrgById',
    label: 'name',
    length: 0,
    selected: [],
    onChange: () => {}, // 值改变
    disabled: false,
    filter: true,
    paramsLabel: 'id',
  };

  constructor(props) {
    super(props);
    this.state = {
      options: [],
      selected: props.value,
      tempSelected: [],
    };
  }
  firstId = 0;

  /**
   *  第一次查询 options
   */
  onFocus = () => {
    const { dispatch, url, label, filter } = this.props;
    const { options } = this.state;
    if (options.length > 0) return;
    this.queryById({
      id: 0,
      callback: data => {
        if (!data) return;
        this.firstId = data[0].id;
        if (filter) {
          this.queryById({
            id: data[0].id,
            callback: data2 => {
              if (!data2) return;
              this.setState({
                options: data2.map(item => {
                  return { value: item.id, label: item[label], isLeaf: false };
                }),
              });
            },
          });
        } else {
          this.setState({
            options: data.map(item => {
              return { value: item.id, label: item[label], isLeaf: false };
            }),
          });
        }
      },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.value) !== JSON.stringify(nextProps.value)) {
      const { value } = nextProps;
      if (isString(value)) {
        const data = value.split('/');
        this.onChange(data.filter((item, index) => index !== 0), null);
        this.setState({ selected: data.filter((item, index) => index !== 0) });
        this.queryRegion(data.length - 2, data);
      } else {
        this.setState({ selected: value });
      }
    }
  }

  /**
   * 回显 查询options
   */
  queryRegion = (index, selectedData) => {
    this.queryById({
      id: selectedData[index],
      callback: data => {
        const newOptions = data.map(item => {
          return {
            value: item.id,
            label: item.name,
            isLeaf: false,
          };
        });
        if (index === selectedData.length - 2) {
          this.setState({
            options: newOptions,
          });
        } else {
          const targetOptions = data.map(item => {
            if (item.id === selectedData[index + 1]) {
              return {
                value: item.id,
                label: item.name,
                isLeaf: false,
                children: this.state.options,
              };
            } else {
              return {
                value: item.id,
                label: item.name,
                isLeaf: false,
              };
            }
          });
          this.setState({
            options: targetOptions,
          });
        }
        if (--index >= 0) {
          this.queryRegion(index, selectedData);
        }
      },
    });
  };

  /**
   * 查询options 接口
   */
  queryById = ({ id, callback }) => {
    const { dispatch, url, paramsLabel } = this.props;
    dispatch({
      type: 'common/selectReginList',
      payload: {
        params: { [paramsLabel]: id },
        url,
      },
      callback: data => {
        if (!data) return;
        callback(data);
      },
    });
  };

  /**
   * 选中加载数据
   */
  loadData = selectedOptions => {
    const { dispatch, label } = this.props;
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    this.queryById({
      id: targetOption.value,
      callback: data => {
        if (!data) return;
        targetOption.loading = false;
        if (data.length === 0) {
        } else {
          targetOption.children = data.map(item => {
            return {
              value: item.id,
              label: item[label],
              isLeaf: false,
            };
          });
        }
        this.setState({
          options: [...this.state.options],
        });
      },
    });
  };

  triggerChange = value => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };

  /**
   * 值改变
   */
  onChange = (keys, values) => {
    const { onChange, length } = this.props;
    this.setState({ tempSelected: { id: keys, name: values } });
  };

  onClose = key => {
    const { selected } = this.state;
    const newSelected = selected.filter(v => v.id !== key);
    this.setState({
      selected: newSelected,
    });
    this.triggerChange(newSelected);
  };

  confirm = () => {
    const { selected, tempSelected } = this.state;
    if (!tempSelected.id) return;
    const newSelected = [
      { id: tempSelected.id.join('/'), name: tempSelected.name.map(v => v.label).join('/') },
      ...selected,
    ];
    this.setState({
      selected: newSelected,
      tempSelected: {},
    });
    this.triggerChange(newSelected);
  };

  render() {
    const { options, selected, tempSelected } = this.state;
    const { disabled } = this.props;
    return (
      <Fragment>
        <Row>
          <Col span={22}>
            <Cascader
              ref={table => (this._table = table)}
              onFocus={this.onFocus}
              allowClear={true}
              options={options}
              value={tempSelected.id}
              loadData={this.loadData}
              onChange={this.onChange}
              placeholder={formatMessage({ id: 'form.select.placeholder' })}
              changeOnSelect
              disabled={disabled}
            />
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={this.confirm} style={{ float: 'right' }}>
              确定
            </Button>
          </Col>
        </Row>
        {selected.map(v => {
          if (v.name === '') return;
          return (
            <Tag
              key={v.id}
              closable
              onClose={() => {
                this.onClose(v.id);
              }}
            >
              {v.name}
            </Tag>
          );
        })}
      </Fragment>
    );
  }
}
