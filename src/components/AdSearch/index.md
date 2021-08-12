---
title: AdSearch
subtitle: 查找框
---

查找框：下拉组件-1.支持服务器条件查询，2.表格展示内容，可分页、可展开收起表格列，3.支持查看模式根据key返回value

## API

```html
import AdSearch from '@/components/AdSearch';

1. 查看模式
<AdSearch
    label="loginName"
    name="sysName"
    value={this.props.searchValue[text]}
    onlyRead={true}
/>

2. 非查看模式
columns = [
  {
    title: '主车牌',
    dataIndex: 'cartPlateOneNo',
    width: '25%',
  },
  {
    title: '副车牌',
    dataIndex: 'cartPlateTwoNo',
    width: '25%',
  },
  {
    title: '所属公司',
    dataIndex: 'ownCompanyName',
  },
];

<AdSearch
    dataUrl="mds-user/selectList"
    url="ems/abnormal-info/userViewDetails_s"
    multiple={false} // 是否多选
    name="sysName"
    searchName="keyWord"
    columns={columns} // 表格展示列
    scrollX={240}
    id="errAbnormal_3"
/>

```

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| value | 选中值：如果是字符串，必须传url查询选中值对应的对象  | array | string | - |
| url | 查询选中值的对象,如果value为字符串必传 | string | - |
| dataUrl | 查询所有可以选择的数据  |  string | - |
| payload | 查询所有可以选择的数据的查询条件 | object | - |
| expandRow | 是否支持展示表格可收缩展开列  | boolean | false |
| id | 给每个查找框一个唯一Id | string | - |
| label | 选中对应的key名  |  string | - |
| name | 选中对应的value名 | string | - |
| multiple | 是否支持多选 | boolean | true |
| searchName | 服务器条件查询的传参key  |  string | name |
| allowClear | multiple为false时，是否支持清空 | boolean | - |
| columns | 表格的列定义  |  array |  |
| onlyRead | 是否是查看模式 | boolean | false |
| columns | 表格的列定义  |  array |  |
| scrollX | 表格的宽度 | boolean | 1000 |
| scrollY | 表格的高度 | boolean | 240 |

Select组件支持的参数都支持