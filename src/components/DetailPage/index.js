import React, { Component } from 'react';
import styles from './index.less';

const DetailPage = ({ label = '', value = '', borderBottom = '1px solid #e4dddd' }) => {
  return (
    <div className={styles.detail} style={{ borderBottom }}>
      <span className={styles.detailKey}>{label}</span>
      <span className={styles.detailValue} title={value}>
        {value}
      </span>
    </div>
  );
};

export default DetailPage;
