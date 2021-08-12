---
title: AntdInput
subtitle: 输入框
---

输入框：1.集成输入框、密码框、数字框和文本域，2.对输入的值按规则处理

## API

```html
import AntdInput from '@/components/AntdInput';

1. 普通输入框
<AntdInput />

2. 密码输入框
<AntdInput type="password" />

3. 数字输入框
<AntdInput
    min={1}
    max={4}
    type="number"
/>

4. 文本域
<AntdInput type="textarea" />

5. 输入金额
<AntdInput
    mode="money"
    placeholder="输入数字,可保留两位小数,长度不超过18位"
    addonBefore={prefixSelector}
    disabled={checkDisabled}
/>

```
| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| type | 输入框类型 `password|number|textarea` | string | - |
| mode | 模式 `money|number` | string | - |
| maxlen | 输入文本最长长度 | - |- |

对应输入框支持的参数都支持
