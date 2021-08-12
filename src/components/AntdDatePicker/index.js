import React, { PureComponent } from 'react';
import moment from 'moment';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const formatDate = ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD'];
const rangeFormatDate = 'YYYY-MM-DD';
const formatTime = ['YYYY-MM-DD HH:mm', 'YYYY/MM/DD HH:mm', 'YYYYMMDD HH:mm'];

const style = { width: '100%' };

export default class AntdDatePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
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

  render() {
    const { mode, ...rest } = this.props;
    const { value } = this.state;
    const params = {
      value,
      style,
      format: mode === 'range' ? rangeFormatDate : this.props.showTime ? formatTime : formatDate,
      onChange: this.onChange,
      ...rest,
    };
    return mode === 'range' ? <RangePicker {...params} /> : <DatePicker  {...params} />;
  }
}
