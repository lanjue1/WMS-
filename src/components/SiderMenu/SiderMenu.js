import React, { PureComponent, Suspense } from 'react';
import { Layout, Icon } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import PageLoading from '../PageLoading';
import { getDefaultCollapsedSubMenus } from './SiderMenuUtils';
import { title } from '../../defaultSettings';

const BaseMenu = React.lazy(() => import('./BaseMenu'));
const { Sider } = Layout;

let firstMount = true;

@connect(({ user }) => ({ currentUser: user.currentUser }))
export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  componentDidMount() {
    firstMount = false;
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname, flatMenuKeysLen } = state;
    if (props.location.pathname !== pathname || props.flatMenuKeys.length !== flatMenuKeysLen) {
      return {
        pathname: props.location.pathname,
        flatMenuKeysLen: props.flatMenuKeys.length,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  isMainMenu = key => {
    const { menuList } = this.props;
    return menuList.some(item => {
      if (key) {
        return item.key === key || item.id === key;
      }
      return false;
    });
  };

  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
      // openKeys: [openKeys[openKeys.length - 1]]
    });
  };

  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme, isMobile, currentUser } = this.props;
    const { openKeys } = this.state;
    const defaultProps = collapsed ? {} : { openKeys };

    const siderClassName = classNames(styles.sider, {
      [styles.fixSiderBar]: fixSiderbar,
      [styles.light]: theme === 'light',
    });
    const collapseIcon = (
      <Icon
        className={styles.activeTrigger}
        type={collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={this.toggle}
      />
    );
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={collapse => {
          if (firstMount || !isMobile) {
            onCollapse(collapse);
          }
        }}
        width={200}
        theme={theme}
        className={siderClassName}
      >
        <div className={styles.logo}>
          <Link to="/" id="logo">
            <img src={logo} alt="logo" />
            {/* <h1>{title}</h1> */}
            {/* {!isMobile && (
            <span className={styles.trigger} onClick={this.toggle}>
              <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
            </span>
          )} */}
          </Link>
        </div>

        <Suspense fallback={<PageLoading />}>
          <BaseMenu
            {...this.props}
            mode="inline"
            handleOpenChange={this.handleOpenChange}
            onOpenChange={this.handleOpenChange}
            style={{ padding: '16px 0', width: '100%' }}
            {...defaultProps}
          />
        </Suspense>
      </Sider>
    );
  }
}
