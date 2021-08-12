import React, { Component } from 'react';
import { Form } from 'antd';
import styles from './index.less';
const AntdForm = ({ children },ref) => {
  return (
    <div className={styles.tableListForm}>
      <Form layout="inline"  autoComplete="on" >
        {children}
      </Form>
    </div>
  );
};

export default AntdForm;
