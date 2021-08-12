import React, { Component } from 'react';
import { Collapse, Button } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const Panel = Collapse.Panel;

import styles from './index.less';

export default class EditPage extends Component {
  constructor(props) {
    super(props);
    const value = props.panelValue || props.panelTitle;
    this.state = {
      activeKey: value.map((_, i) => `${i}`),
    };
  }

  callback = key => {
    this.setState({
      activeKey: key,
    });
  };

  saveInfo = e => {
    e.stopPropagation();
    const { saveInfo } = this.props;
    saveInfo();
  };

  pageHeaderOperate = () => {
    const { title, headerOperate } = this.props;
    return (
      <div className={styles.customHeader}>
        <span>{title}</span>
        {headerOperate ? (
          headerOperate
        ) : (
          <Button type="primary" onClick={e => this.saveInfo(e)}>
            保存
          </Button>
        )}
      </div>
    );
  };

  render() {
    const { activeKey } = this.state;
    const { children, panelTitle, saveInfo, extra = [], headerOperate, panelValue } = this.props;
    const newChildren = React.Children.map(children, child => {
      if (child && child.props.children) {
        return child;
      }
    });
    let newPanelValue = [];
    if (panelValue) {
      newPanelValue = panelValue.filter(v => v);
    } else {
      newPanelValue = panelTitle;
    }
    const content = (
      <Collapse defaultActiveKey={activeKey} onChange={key => this.callback(key)} bordered={false}>
        {newChildren.map((child, index) => {
          return (
            child && (
              <Panel
                header={newPanelValue[index].key || panelTitle[index]}
                key={`${index}`}
                className={styles.customPanel}
                extra={newPanelValue[index] && newPanelValue[index].extra}
              >
                {child}
              </Panel>
            )
          );
        })}
      </Collapse>
    );
    return saveInfo || headerOperate ? (
      <div className={styles.customCollapse}>
        <PageHeaderWrapper title={this.pageHeaderOperate()}>{content}</PageHeaderWrapper>
      </div>
    ) : (
      <div className={styles.customCollapse}>{content}</div>
    );
  }
}
