---
title: FileReader
subtitle: 在线查看文档组件
---

在线查看文档组件:1.支持文件上传，2.支持文件上传模式的附件显示，3.支持列表附件查看

## API

```html
import FileReader from '@/components/FileReader';

1. 上传图片模式
<FileReader urlType="tms" />

2. 列表模式
<FileReader
    type="list"
    count={text}
    params={{ bizId: record.id, fileBizType: 'DRIVER_PAPERS' }}
/>
```
| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| urlType | 图片接口对应的项目`ems|tms|...` | string | - |
| params | 查询图片数据的参数，列表模式必传 | object |- |
| type | 上传模式还是列表模式`list` | string | - |
| count | 列表模式必传，表示一共多少附件 | number |- |

上传图片支持支持的参数都支持
