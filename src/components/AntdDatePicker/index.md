---
title: AntdDatePicker
subtitle: 时间选择
---

时间选择：支持不同格式输入选择

## API

```html
import AntdDatePicker from '@/components/AntdDatePicker';

1. 时间段选择
 <AntdDatePicker mode="range" />

2. 时间点选择
 <AntdDatePicker  />
```

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| mode | 时间段选择：` range`  | string | - |
| formatDate | 日期选择输入格式匹配 | object | ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD'] |
| formatTime | 日期时间选择输入格式匹配  |  object | ['YYYY-MM-DD HH:mm', 'YYYY/MM/DD HH:mm', 'YYYYMMDD HH:mm'] |

时间组件支持的参数都支持

