import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { isArray } from 'util';

const { Option } = Select;
const style = { width: '100%' };

@connect(({ common, loading }) => ({
  selectData: common.selectData,
  loading: loading.effects['common/querySelectData'],
}))
export default class AntdSelect extends Component {
  static propTypes = {
    url: PropTypes.string,
    payload: PropTypes.object,
  };

  static defaultProps = {
    url: '', // 查询数据url
    payload: {},
    onlyRead: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || undefined,
    };
  }

  componentDidMount() {
    const { selectData, value, data, payload } = this.props;
    if (data) return;
    if (payload.code) {
      if (selectData[payload.code]) return;
    } else {
      if (selectData.company) return;
    }
    this.queryData();
  }

  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        value: nextProps.value,
      };
    }
    return null;
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

  queryData = (params = {}, callback = () => {}) => {
    const { dispatch, url, payload } = this.props;
    dispatch({
      type: 'common/querySelectData',
      payload: { params: { ...params, ...payload }, url },
      callback,
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps.selectData) !== JSON.stringify(this.props.selectData) ||
      JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) ||
      nextProps.loading !== this.props.loading ||
      nextProps.disabled !== this.props.disabled ||
      nextState.value !== this.state.value ||
      nextProps.onlyRead !== this.props.onlyRead
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const {
      selectData,
      show: { id, name },
      loading,
      data,
      onlyRead,
      payload,
      url,
      onChange,
      ...rest
    } = this.props;
    const { value } = this.state;

    const optionData =
      data || (payload.code ? selectData[payload.code] || [] : selectData.company || []);
    return onlyRead ? (
      <span>
        {(selectData[payload.code] || [])
          .filter(v => v.code === value)
          .map(v => v.value)
          .join('')}
      </span>
    ) : (
      <Select
        allowClear={true}
        showSearch
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        placeholder={formatMessage({ id: 'form.select.placeholder' })}
        style={style}
        value={value}
        onChange={this.onChange}
        notFoundContent={loading ? <Spin size="small" /> : null}
        {...rest}
      >
        {!loading && <Option value="">{formatMessage({ id: 'form.select.placeholder' })}</Option>}
        {optionData.map(v => {
          return (
            <Option key={v[id]} value={v[id]}>
              {v[name]}
            </Option>
          );
        })}
      </Select>
    );
  }
}
