// import React, { Component } from 'react';
// import { connect } from 'dva';
// import { Popover, Button, Form, Input, Cascader } from 'antd';
// const { TextArea } = Input;

// const options = [
//   {
//     value: 'zhejiangccccc',
//     label: 'Zhejiangcccccc',
//     isLeaf: false,
//   },
//   {
//     value: 'jiangsuccccc',
//     label: 'Jiangsucccc',
//     isLeaf: false,
//   },
// ];
// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 8 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 16 },
//   },
// };
// @Form.create()
// @connect(({ common }) => ({
//   selectAreaById: common.selectAreaById,
// }))
// export default class ConcatenatedAddress extends Component {
//   state = {
//     visible: false,
//     options,
//   };

//   onChange = (value, selectedOptions) => {
//     console.log(value, selectedOptions);
//   };

//   loadData = selectedOptions => {
//     const {} =
//     const targetOption = selectedOptions[selectedOptions.length - 1];
//     targetOption.loading = true;
//     dispatch({
//       type: 'common/selectAreaById',
//       payload: { id: id },
//       callback: res => {
//         if (id == '0') {
//           this.getSelectArea(res.data[0].id); //国家id,获取省
//         } else {
//           if (type == 'child') {
//             this.loadData(selectedOptions, res.data);
//           }
//           // else if (type == 'auto_child') {
//           //   this.setOptions(id, res.data, type1);
//           // }
//           else {
//             this.setState({
//               options: res.data,
//             });
//           }
//         }
//       },
//     });
//     // targetOption.loading = false;
//     // targetOption.children = [
//     //   {
//     //     label: `${targetOption.label} Dynamic 1`,
//     //     value: 'dynamic1',
//     //   },
//     //   {
//     //     label: `${targetOption.label} Dynamic 2`,
//     //     value: 'dynamic2',
//     //   },
//     // ];
//     // this.setState({
//     //   options: [...this.state.options],
//     // });
//     // load options lazily
//     // setTimeout(() => {

//     // }, 1000);
//   };

//   hide = () => {
//     this.setState({
//       visible: false,
//     });
//   };

//   handleVisibleChange = visible => {
//     this.setState({ visible });
//   };
//   render() {
//     const {
//       form: { getFieldDecorator },
//     } = this.props;
//     const text = <span>Title</span>;
//     const content = (
//       <Form {...formItemLayout} onSubmit={this.handleSubmit}>
//         <Form.Item label="联系地址">
//           {getFieldDecorator('contactAddress', {
//             // rules: [
//             //   {
//             //     type: 'email',
//             //     message: 'The input is not valid E-mail!',
//             //   },
//             //   {
//             //     required: true,
//             //     message: 'Please input your E-mail!',
//             //   },
//             // ],
//           })(
//             <Cascader
//               options={this.state.options}
//               loadData={this.loadData}
//               onChange={this.onChange}
//               changeOnSelect
//             />
//           )}
//         </Form.Item>
//         <Form.Item label="详细地址">
//           {getFieldDecorator('detailAddress', {
//             // rules: [
//             //   {
//             //     required: true,
//             //     message: 'Please input your password!',
//             //   },
//             //   {
//             //     validator: this.validateToNextPassword,
//             //   },
//             // ],
//           })(<TextArea rows={4} />)}
//         </Form.Item>
//       </Form>
//     );
//     return (
//       <Popover
//         title={text}
//         content={content}
//         trigger="click"
//         placement="bottomLeft"
//         visible={this.state.visible}
//         onVisibleChange={this.handleVisibleChange}
//       >
//         <Button>请选择</Button>
//       </Popover>
//     );
//   }
// }
