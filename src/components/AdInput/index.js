import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input } from 'antd';
import AntdFormItem from '@/components/AntdFormItem';
import AntdInput from '@/components/AntdInput';
const { TextArea } = Input;

export default class AdInput extends PureComponent {
  render() {
    const {
      mode,
      label,
      code,
      rules = [],
      initialValue,
      getFieldDecorator,
      type,
      maxLength,
      ...rest
    } = this.props;
    const moneyPattern = '^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$';
    switch (mode) {
      case 'money':
        rules.push({ pattern: moneyPattern });
    }
    return (
      <AntdFormItem
        label={label}
        code={code}
        rules={rules}
        initialValue={initialValue}
        getFieldDecorator={getFieldDecorator}
      >
        <AntdInput pattern={moneyPattern} {...rest} maxLength={maxLength}/>
      </AntdFormItem>
    );
  }
}
