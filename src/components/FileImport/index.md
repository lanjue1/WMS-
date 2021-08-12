---
title: FileImport
subtitle: 导入
---

## API

```html
import FileImport from '@/components/FileImport';

1. 组件
 <FileImport
    visibleFile={visibleFile}
    handleCancel={() => {
      this.handleImportFile();
    }}
    urlImport={`mds-address-lib/matchExcelDistrict`}
    urlCase={`attachment/地址匹配模板.xlsx`}
    urlQuery={[
      { url: `mds-address-lib/selectMdsAddressLibList`, payload: {} },
      { url: `tms/tms-upkeep/viewDetails`, payload: { id: detailId } },
    ]}
    queryData={[this.query]}
    downloadFile={{
      flag: true,
      url: `mds-attachment/readFile`,
      content: '导入文件匹配地址成功，是否下载？',
      }}
    accept=".xls,.xlsx"
  />

```

| 参数        | 说明                                      | 类型         | 默认值 |
| ---------   |------------------------------------------|------------- |-------|
| visibleFile | 显示弹窗                                  | bool         | false |
| payload     | 查询数据的条件                             | object       | -    |
| urlImport   | 导入接口地址                               | string       | -    |
| urlCase | 下载模板地址                                   | string       | -    |
| urlQuery    | 导入成功后要更新的数据接口地址（数组集合)     | array        | []   |
| queryData   | 导入成功后要更新的数据并刷新当前页面数据（数组集合)     | array        | []   |
| downloadFile| 导入成功后 是否要下载文件                   | object        | []   |
|              参数:flag(是否下载)， url(下载地址)，content:(提示内容)
| accept      | 接受上传的文件类型                          | string       | -    |