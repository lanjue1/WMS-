import React, { Component } from 'react';
import { Drawer, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';
import AdButton from '@/components/AdButton';

@connect(({ component }) => ({
  isRightDrawOpen: component.isRightDrawOpen,
  isRightDrawOtherOpen: component.isRightDrawOtherOpen,
}))
export default class RightDraw extends Component {
  // componentWillMount() {
  //   window.addEventListener('click', this.onClick);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('click', this.onClick);
  // }

  // componentWillReceiveProps(nextProps) {
  //   const { visible, dispatch, isRightDrawOpen } = nextProps;
  //   if (this.props.visible !== visible) {
  //     dispatch({
  //       type: 'component/setRightDrawValue',
  //       payload: { isRightDrawOpen: !isRightDrawOpen },
  //     });
  //   }
  // }

  // onClick = e => {
  //   const { closeDetail, isMobile, isRightDrawOpen, isRightDrawOtherOpen } = this.props;
  //   if (!isRightDrawOtherOpen && e.screenX < document.body.clientWidth * (isMobile ? 0.12 : 0.3)) {
  //     closeDetail && closeDetail();
  //   }
  // };

  render() {
    const {
      children,
      visible,
      isMobile,
      title,
      code,
      closeDetail,
      buttons,
      onClick,
      widthX,
    } = this.props;
    const header = (
      <div className={styles.customHeader}>
        <h2 className={styles.title}>{title}</h2>
        <div>
          {buttons}
          <AdButton code={code} style={{ marginLeft: 8 }} onClick={closeDetail} text="关闭" />
        </div>
      </div>
    );
    // isMobile ? '88%' : '70%'
    return (
      <Drawer
        className={styles.customDraw}
        title={header}
        width={isMobile ? '88%' : '70%'}
        visible={visible}
        destroyOnClose={true}
        closable={false}
        onClose={closeDetail}
        // maskClosable={isMobile}
        // mask={false}
      >
        {children}
      </Drawer>
    );
  }
}
