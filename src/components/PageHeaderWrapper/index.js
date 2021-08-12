import React from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import PageHeader from '@/components/PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';
import MenuContext from '@/layouts/MenuContext';
import { StickyContainer, Sticky } from 'react-sticky';

const PageHeaderWrapper = ({ children, contentWidth, wrapperClassName, top, ...restProps }) => (
  <StickyContainer>
    <div style={{ margin: '-12px -12px 0 -12px' }} className={wrapperClassName}>
      {top}
      <MenuContext.Consumer>
        {value => (
          <Sticky bottomOffset={80}>
            {({ style }) => (
              <PageHeader
                style={{
                  ...style,
                  zIndex: 100,
                  background: '#fff',
                  // top: 4,
                }}
                wide={contentWidth === 'Fixed'}
                home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
                {...value}
                key="pageheader"
                {...restProps}
                linkElement={Link}
                itemRender={item => {
                  if (item.locale) {
                    return <FormattedMessage id={item.locale} defaultMessage={item.title} />;
                  }
                  return item.title;
                }}
              />
            )}
          </Sticky>
        )}
      </MenuContext.Consumer>
      {children ? (
        <div className={styles.content}>
          <GridContent>{children}</GridContent>
        </div>
      ) : null}
    </div>
  </StickyContainer>
);

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
