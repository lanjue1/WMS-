import React, { Component } from 'react';
import { Divider, Select, Spin } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { isArray } from 'util';
import { transferLanguage } from '@/utils/utils';
import { styles } from 'react-contexify/lib/utils/styles';
import style from './index.less';

const { Option } = Select;

@connect(({ component, loading,i18n }) => ({
  selectData: component.selectData,
  language: i18n.language,
  // loading: loading.effects['component/queryComponentList'],
}))
export default class AdSelect extends Component {
  static propTypes = {
    url: PropTypes.string,
    payload: PropTypes.object,
    filterValue: PropTypes.array,
  };

  static defaultProps = {
    url: 'mds-dict-data/selectDictByCode', // 查询数据url
    payload: {},
    onlyRead: false,
    show: { id: 'code', name: 'value' },
    isExist: false,
    filterValue: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: props.value || undefined,
      options: props.data || [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    for (const key in nextProps) {
      if (JSON.stringify(this.props[key]) !== JSON.stringify(nextProps[key])) {
        return true;
      }
    }
    for (const key in nextState) {
      if (JSON.stringify(this.state[key]) !== JSON.stringify(nextState[key])) {
        return true;
      }
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({ selected: nextProps.value });
    }

    if (nextProps.data && nextProps.data.length > 0) {
      this.setState({ options: nextProps.data });
    }
    if (JSON.stringify(nextProps.dataName) !== JSON.stringify(this.props.dataName)) {
      this.setState({ 
        options: [{
          code: nextProps.dataCode,
          value: nextProps.dataName
        }],
        selected: nextProps.dataCode
     });
    }
   
  }

  triggerChange = value => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(value);
    }
  };

  onChange = selected => {
    this.setState({ selected });
    this.triggerChange(selected);
  };

  queryData = ({ params = {}, callback } = {}) => {
    const { dispatch, url, payload, type } = this.props;
    dispatch({
      type: 'component/queryComponentList',
      payload: { params: { ...params, ...payload }, url },
      callback: options => {
        if (!options) return;
        this.setState({ options });
        if (callback) callback(options);
      },
    });
  };

  onFocus = () => {
    const { isExist } = this.props;
    !isExist &&
      this.setState({ options: [] }, () => {
        this.queryData();
      });
  };

  formatVal = (options, selected) => {
    const {
      show: { id, name },
    } = this.props;
    let text = selected;
    if (Array.isArray(options) && options.length > 0) {
      options.map(v => {
        if (v[id] === selected) {
          text = v[name];
          
        }
      });
    }

    return text;
  };

  render() {
    const {
      show: { id, name },
      onlyRead,
      width,
      data,
      value,
      onChange,
      type,
      filterValue,
      language,
      ...rest
    } = this.props;
    const { selected, options } = this.state;
    
    return onlyRead ? (
      this.formatVal(options, selected) || null
    ) : (
        <div className={style.root} style={{height:'32.5px'}}>
        <Select
          style={{width:width?'180px':''}}
          allowClear={true}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder={transferLanguage('Common.field.select',language)}
          onFocus={this.onFocus}
          value={selected}
          onChange={this.onChange}
          notFoundContent={ null}
          {...rest}
        >
          {/* {!loading && options.length > 0 && (
            <Option value="">{transferLanguage('Common.field.select',language)}</Option>
          )} */}

          {
            options
              .filter(f => !filterValue.includes(f.code))
              .map(v => {
                return (
                  <Option key={v.code} value={v.code}>
                    {v.value}
                  </Option>
                );
              })}
        </Select>
        </div>
      );
  }
}
