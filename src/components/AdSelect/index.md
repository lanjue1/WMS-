---
title: AdSelect
subtitle: 下拉选择框
---

下拉选择框：选择数据不多的字典项,支持查看模式

## API

```html
import AdSelect from '@/components/AdSelect';

1. 查看模式
<AdSelect 
  onlyRead={true} 
  value={text} 
  data={this.props.dictObject['EMS_LEVEL']} 
/>

2. 非查看模式
<AdSelect payload={{ code: 'coach' }} />
```

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| url | 查询可以选择的数据url  | string | mds-dict-data/selectDictByCode |
| payload | 查询数据的条件 | object | - |
| show | 匹配展示的key，value  |  object | { id: 'code', name: 'value' } |
| payload | 查询所有可以选择的数据的查询条件 | object | - |
| data | 可以选择的数据，data存在不需要传url  | array | - |
| isExist | 如果数据时存在的必传  | boolean | - |


Select支持的参数都支持