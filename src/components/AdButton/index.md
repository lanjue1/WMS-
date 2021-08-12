---
title: AdButton
subtitle: 权限按钮
---

权限按钮：分为按钮和a标签
    1. 如果是按钮，有权限展示对应按钮，没有权限什么都不展示
    2. 如果是a标签，有权限展示对应a标签，没有权限展示成span

## API

```html
import AdButton from '@/components/AdButton';
import { codes } from './utils';

1. a标签
<AdButton
    mode="a"
    onClick={()=>{}}
    text={text}
    code={codes.showDetail}
/>

2. 按钮
<AdButton
    onClick={() => {}}
    text="启用"
    code={codes.enable}
/>

```

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| mode | 如果是a标签: `a`  | string | - |
| code | 权限码 | string | - |

a标签和Button组件支持的参数都支持