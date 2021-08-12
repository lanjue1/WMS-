---
title: Prompt
subtitle: 消息弹出框
---

消息弹出框

## API

```html
import prompt from '@/components/prompt';

prompt({ type: 'error', title: '上传错误', content: message });
```
| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| type | 消息类型`error|warn|success` | string | success |
| title | 标题 | string | 信息 |
| content | 内容 | string | - |
| duration | 持续时间 | number | - |

notification支持的参数都支持
