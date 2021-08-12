---
title: EditPage
subtitle: 新增编辑详情页面
---

新增编辑详情页面

## API

```html
import DetailPage from '@/components/DetailPage';

1. 详情页面
const editPageParams = {
    panelTitle: ['基础信息', '明细'],
};
 <EditPage {...editPageParams}>
    <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
    <BillInfo detailId={detailId} mode="detail" type={type} />
</EditPage>

2. 新增编辑页面
const editPageParams = {
    title: billNo || '新增账单',
    headerOperate: this.headerOperate(),
    panelTitle: ['基础信息', '明细'],
    extra: {
    1: (
        <Button.Group>
        <AdButton
            code={codes.removeInfo}
            disabled={!selectedRows.length > 0 || commitStatus || !saveBtn}
            onClick={this.removeInfo}
            text="移除"
            type="danger"
        />
        <AdButton
            disabled={commitStatus || !saveBtn}
            type="primary"
            onClick={this.infoAdd}
            text="新增"
            code={codes.addInfo}
        />
        </Button.Group>
        ),
    },
};
<EditPage {...editPageParams}>
    <Spin spinning={loading}>{formItemFragement(formItem)}</Spin>
    <BillInfo detailId={detailId} mode="detail" type={type} />
</EditPage>
```

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| saveInfo | header保存方法 | function | - |
| title | header显示文字 | string | - |
| headerOperate | header操作 | - | - |
| panelTitle | panel对应显示文字 | array | - |
| extra | panel对应操作 | - | - |
| children | panel显示内容 | - | - |


