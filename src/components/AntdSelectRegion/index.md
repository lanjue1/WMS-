---
title: AntdSelectRegion
subtitle: 级联选择框
---

级联选择框

## API

```html
import AntdSelectRegion from '@/components/AntdSelectRegion';

<AntdSelectRegion
    url="mds-address-lib/selectMdsDistList"
    paramsLabel="id"
    label="name"
    filter={false}
    split="/"
/>

```
| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| value | 选中值 | string | - |
| url | 查询数据的接口url | string | - |
| filter | 是否过滤掉第一层级：如中华人民共和国 | boolean |- |
| split | 选中的值url用','隔开就用','拆成数组 | string | - |
| isParent | 是否是显示当前值的父层级 | boolean |- |
| label | 展示内容对应的列 | string |- |
| paramsLabel | 查询数据对应的参数列名 | string |- |
| isRate | 是否用默认的展示和查找方式 | boolean |- |
cusValue -- 列表自定义值--目的清空数据

级联选择组件支持的参数都支持
