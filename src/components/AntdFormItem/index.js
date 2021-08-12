import React, { Component } from 'react';
import { Form } from 'antd';
const { Item } = Form;
class AntdFormItem extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { code,width } = this.props
    if(width){
      let ItemEle = document.querySelector(`.${code} .ant-form-item-control`)
      ItemEle.style.width=`${width}px`
    }
  }
  render() {
    const {
      getFieldDecorator,
      label,width,
      code = '',
      initialValue = undefined,
      children,
      rules = [{ required: false, message: ' ' }],
    } = this.props
    return (
      <div className={width?code:''}>
        {label !== undefined ?
          <Item label={label} style={{ display: 'flex' }} >
            {getFieldDecorator(code, {
              rules,
              initialValue,
            })(children)}
          </Item>
          :
          getFieldDecorator(code, {
            rules,
            initialValue,
          })(children)}
      </div>

    )
  }
}
// const AntdFormItem = ({
//   getFieldDecorator,
//   label,
//   code = '',
//   initialValue = undefined,
//   children,
//   className,
//   rules = [{ required: false, message: ' ' }],
// }) => {

//   return label !== undefined ? (
//     <Item label={label} style={{display: 'flex'}} className={className}>
//       {getFieldDecorator(code, {
//         rules,
//         initialValue,
//       })(children)}
//     </Item>
//   ) : (
//     getFieldDecorator(code, {
//       rules,
//       initialValue,
//     })(children)
//   );
// };

export default AntdFormItem;
