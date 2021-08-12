import React, { Component } from 'react';
import { Modal } from 'antd';
import { transferLanguage } from '@/utils/utils';
import { connect } from 'dva';

@connect(({ component,i18n }) => ({
  language: i18n.language,
  isRightDrawOpen: component.isRightDrawOpen,
}))
export default class AdModal extends Component {
  componentWillReceiveProps(nextProps) {
    const { visible, dispatch, isRightDrawOpen } = nextProps;
    let isRightDrawOtherOpen = false;
    if (this.props.visible !== visible) {
      if (visible) {
        isRightDrawOtherOpen = true;
      }
      if (!isRightDrawOpen) return;
      dispatch({
        type: 'component/setRightDrawValue',
        payload: {
          isRightDrawOtherOpen,
        },
      });
    }
  }

  render() {
    const { children,language ,modHeight,...rest } = this.props;
    
    return (
      <Modal width={820} destroyOnClose={true} style={{ top: 20 }} {...rest} 
        cancelText={transferLanguage('Common.field.cancel',language)} okText={transferLanguage('Common.field.ok',language)}
      >
        
        {children}
       
      </Modal>
    );
  }
}
