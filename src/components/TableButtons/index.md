---
title: TableButtons
subtitle: 表格按钮操作
---

表格按钮操作:默认有新增按钮

## API

```html
import TableButtons from '@/components/TableButtons';

const tableButtonsParams = {
  buttons: (
    <span>
      <AdButton
        disabled={selectedRows.length === 0}
        onClick={this.checkAddress}
        text="审核"
        code={codes.ToExamine}
      />
      <AdButton
        style={{ marginLeft: 8 }}
        onClick={this.importFile}
        text="导入"
        code={codes.import}
      />
    </span>
  ),
  handleAdd: this.handleAdd,
  code: codes.add,
};
 <TableButtons {...tableButtonsParams} />
```

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| handleAdd | 新增时间，不传不显示新增 | funciton | - |
| buttons | 其他操作 | ReactNode | - |
| code | 新增权限码 | string | - |

