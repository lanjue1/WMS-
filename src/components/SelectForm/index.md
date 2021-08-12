---
title: SelectForm
subtitle: 表格查询条件
---

表格查询条件

## API

```html
import SelectForm from '@/components/SelectForm';

const firstFormItem = (
  <FormItem label="单据号">
    {getFieldDecorator('insuranceNo')(<Input  />)}
  </FormItem>
);
const secondFormItem = (
  <AntdFormItem label="状态" code="billStatus" {...commonParams}>
    <AdSelect isExist={true} data={billStateList} mode="multiple" />
  </AntdFormItem>
);
// otherFormItem数组里第一个数组长度为1，其他为3
const otherFormItem = [
  [
    <FormItem label="保单号">
      {getFieldDecorator('insuranceCode')(<Input  />)}
    </FormItem>,
  ],
  [
    <FormItem label="车牌号">
      {getFieldDecorator('vehicleId')(
        <SearchSelect
          dataUrl="tms/tms-insurance/selectInsuranceVehicle"
          url="tms/tms-insurance/selectInsuranceVehicleView_s" // selectedData只只有id时需要传url
          selectedData={this.state.cars} // 选中值
          multiple={false} // 是否多选
          showValue="cartPlateOneNo"
          searchName="cartPlate"
          columns={columns1} // 表格展示列
          onChange={values => this.getValue(values, 'cars')} // 获取选中值
          scrollX={480}
          id="InsuranceList_1"
          allowClear={true}
        />
      )}
    </FormItem>,'operatorButtons'
  ]
]
const selectFormParams = {
  firstFormItem,
  secondFormItem,
  otherFormItem,
  form,
  code: codes.select,
  className: this.className,
  handleFormReset: this.handleFormReset,
  handleSearch: this.handleSearch,
  toggleForm: this.toggleForm,
};
<SelectForm {...selectFormParams} />
```

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| toggleForm | 展开收起 | boolean | false |
| form | 表单属性 | - | - |
| handleFormReset | 重置表单后操作 | function | - |
| handleSearch | 查询操作 | function | - |
| code | 查询的code权限码 | string | - |
| firstFormItem | 第一个表单组件 | - | - |
| secondFormItem | 第二个表单组件 | - | - |
| otherFormItem | 剩余表单组件 | - | - |
| className | 唯一的class名 | string | - |

