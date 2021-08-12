---
title: AntdFormItem
subtitle: 表单元素组件
---

表单元素组件

## API

```html
import AntdFormItem from '@/components/AntdFormItem';

<AntdFormItem
    label="固定前几列"
    code="freezingColumn"
    initialValue={initialValue}
    getFieldDecorator={getFieldDecorator}
>
</AntdFormItem>
```
| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| label | 表单组件label | string | - |
| code | 表单组件取值的key | string | - |
| initialValue | 表单组件初始值 | - |- |
| getFieldDecorator | form属性getFieldDecorator | - | - |
| children | 表单组件| - | - |
| rules | 表单组件规则| object | - |

Form.Item支持的参数都支持
