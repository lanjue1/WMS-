import React, { Component } from 'react';
import { Card, Drawer } from 'antd';
import Media from 'react-media';
import styles from './index.less';

const ManageList = WrappedComponent => {
  return class extends Component {
    render() {
      return (
        <Media query="(max-width: 599px)">
          {isMobile => (
            <Card bordered={false}>
              <div className={styles.tableListForm}>
                <WrappedComponent {...this.props} isMobile={isMobile} />
              </div>
            </Card>
          )}
        </Media>
      );
    }
  };
};
export default ManageList;
