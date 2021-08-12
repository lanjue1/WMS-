import React, { Component } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';

@connect(({ menu }) => ({ menuAuthority: menu.menuAuthority }))
export default class AdButton extends Component {
  state = {
    isAuthority: false,
  };

  componentDidMount() {
    const { menuAuthority, dispatch } = this.props;
    this.getCode(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { menuAuthority } = nextProps;
    if (JSON.stringify(menuAuthority) !== JSON.stringify(this.props.menuAuthority)) {
      this.getCode(nextProps);
    }
  }

  getCode = props => {
    const { code, menuAuthority } = props;
    const { isAuthority } = this.state;
    if (!code) {
      this.setState({ isAuthority: true });
      return;
    }
    let operateData = [];
    let newOperateData = [];
    menuAuthority.map(item => item.menuBODetail.map(item => operateData.push(item)));
    operateData.map(item => item.menuBODetail.map(item => {
      newOperateData.push(item)
    }));
    // console.log('按钮权限',operateData,'newAuthority',newOperateData)
    const newAuthority = newOperateData.filter(item => item.code === code);
    if (newAuthority.length > 0 && !isAuthority) {
      this.setState({ isAuthority: true });
    }
  };

  render() {
    const { code, text, menuAuthority, mode, dispatch, ...rest } = this.props;
    const { isAuthority } = this.state;
    return mode === 'a' ? (
      isAuthority ? (
        <a  {...rest}>{text}</a>
      ) : (
          <span  style={{pointerEvents: 'none'}} {...rest}>{text}</span>
        )
    ) : (
        isAuthority && <Button  {...rest}>{text}</Button>
      );
  }
}
