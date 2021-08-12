---
title: RightDraw
subtitle: 右抽屉
---

右抽屉：1. 去掉蒙版，支持内容外的点击关闭，2.列表页面查看详情使用右抽屉打开

## API

```html
import FileReader from '@/components/FileReader';

const rightDrawParams = {
      isMobile,
      visible,
      code: codes.showDetail,
      title: '车辆详情',
      closeDetail: this.closeDetail,
      buttons: (
        <span>
          <Button.Group>
            <AdButton onClick={this.handleEdit} text="编辑" code={codes.edit} />
            {!vehicleAbled_check && (
              <AdButton
                onClick={() => this.useVehicleType('abled', 1)}
                text="启用"
                code={codes.enable}
              />
            )}
            {vehicleAbled_check && (
              <AdButton
                onClick={() => this.useVehicleType('disabled', 1)}
                text="禁用"
                code={codes.disable}
              />
            )}
          </Button.Group>
        </span>
    ),
};
<RightDraw {...rightDrawParams}>
    <VehicleDetails
    setDriverIds={setDriverIds}
    changeSetDriverIds={() => {
        this.setState({ setDriverIds: true });
    }}
        type="details"
        vehicleId={vehicleId}
        isMobile={isMobile}
    />
</RightDraw>
```
| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| visible | 是否打开右抽屉 | boolean | - |
| isMobile | 是否是手机模式 | boolean | - |
| title | 右抽屉头部显示文字 | string | - |
| code | 右抽屉打开和关闭权限码 | string | - |
| closeDetail | 关闭右抽屉方法 | function | - |
| buttons | 右抽屉的头部操作 | - | - |
| children | 右抽屉展示内容 | - | - |

Drawer支持的参数都支持
