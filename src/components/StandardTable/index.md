---
title: StandardTable
subtitle: 表格组件
---

表格组件：1.支持pageSize全局缓存，2.支持高度固定，3.支持页面同意设置宽度，4.支持设置自定义列，5、支持列头可伸缩，6.支持列操作宽度省略，7.支持排序

## API

```html
import StandardTable from '@/components/StandardTable';

columns = [
  {
    title: '主车牌',
    dataIndex: 'cartPlateOneNo',
    render: (text, record) => (
      <AdButton
        mode="a"
        onClick={e => this.showDetail(e, record.id)}
        text={text}
        code={codes.showDetail}
      />
    ),
    fixed: this.props.isMobile ? false : true,
  },
  {
    title: '副车牌',
    dataIndex: 'cartPlateTwoNo',
  },
];

<StandardTable
  selectedRows={selectedRows}
  loading={loading}
  data={carList}
  columns={this.columns}
  onSelectRow={this.handleSelectRows}
  onPaginationChange={this.handleStandardTableChange}
  code={codes.page}
  expandForm={expandForm}
  className={this.className}
/>

service.js 
缓存pageSize的读取
export async function selectBillList(params) {
  params.pageSize = params.pageSize || getPageSize();
  return request(`/server/api/tms/tms-bill/selectTmsBillList`, {
    method: 'POST',
    body: params,
  });
}
```

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| code | 表格页面权限码：用来判断是否是管理页面表格 | string | - |
| columns | 表格列 | array | - |
| isMobile | 是否是手机模式 | boolean | - |
| pagination | 是否分页 | boolean | - |
| onPaginationChange | 分页等事件 | function | - |
| onSelect | 复选框选择事件 | function | - |
| onSelectAll | 复选框全选事件 | function | - |
| onExpandRow | 表格查询条件是否展开 | boolean | false |
| className | 唯一的class名 | string | - |
| data | 表格数据:{pagination: {current: pageNum,pageSize,total},list:data} | object | - |
| scrollX | 表格宽 | number | false |
| disabledRowSelected | 是否不展示复选框 | boolean | false |
| selectedRows | 复选框选中值 | array | - |
| scrollY | 表格高 | number | - |
| loading | 是否显示加载图标 | boolean | - |

Table组件支持的参数都支持