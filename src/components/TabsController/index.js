import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Icon, Spin, Avatar, Menu as AMenu } from 'antd'; //Menu
import { connect } from 'dva';
import router from 'umi/router';
import Debounce from 'lodash-decorators/debounce';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { StickyContainer, Sticky } from 'react-sticky';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify';
import { transferLanguage } from '@/utils/utils';
import HeaderDropdown from '@/components/HeaderDropdown';
import NoticeIcon from '@/components/NoticeIcon';
import groupBy from 'lodash/groupBy';
import SelectLang from '@/components/SelectLang';
import SelectWarehouse from '@/components/SelectWarehouse'

import homeImage from '@/assets/hic.jpg';
import userImage from '@/assets/user.png';
import Banner from '@/components/Banner/Banner';
import 'react-contexify/dist/ReactContexify.min.css';
import styles from './index.less';
import moment from 'moment'
const TabPane = Tabs.TabPane;

@connect(({ common, login, menu, global, i18n }) => ({
  user: login.user,
  tabsName: common.tabsName,
  isReplaceTab: common.isReplaceTab,
  panes: common.panes,
  notices: global.notices,
  language: i18n.language
}))
export default class TabsController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: 'home',
      panes: [
        {
          title: <Icon type="home" />,
          content: (
            <div className="tabBanner">
              <Banner isMobile={props.isMobile} />
            </div>
          ),
          key: 'home',
        },
      ],
      isInside: false,
      types: ['IMPORT', 'OPERATION'],
    };
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  
  componentDidMount() {
    setTimeout(() => {
      const closeEle = document.querySelector('.ant-tabs-close-x');
      closeEle && (closeEle.style.display = 'none');
    }, 20);

  }

  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  componentWillReceiveProps(nextProps) {
    const { path, name, component, location, tabsName, isReplaceTab, dispatch, menuData, menuList = [], language } = nextProps;
    const { panes, activeKey, isInside } = this.state;
    const pathnameDatas = location.pathname.split('/');
    if (
      tabsName[pathnameDatas[4]] &&
      this.props.tabsName[pathnameDatas[4]] !== tabsName[pathnameDatas[4]]
    ) {
      const newPane = panes.filter(item => item.key === activeKey)[0];
      newPane.title = `${newPane.title}[${tabsName[pathnameDatas[4]]}]`;
      this.setState({ panes });
    }
    if (location.pathname === '/') {
      this.setState({ activeKey: 'home' });
      return;
    }
    const isExist = panes.some(item => item.key === location.pathname);
    if (location.pathname === activeKey || !location.pathname || !name) {
      return;
    }
    // const newName =
    //   pathnameDatas.length === 5 && tabsName[pathnameDatas[4]]
    //     ? `${name}[${tabsName[pathnameDatas[4]]}]`
    //     : name;
    let routerList = []
    menuList.map((item) => {
      if (item.children) {
        routerList = routerList.concat(item.children)
      }
    })
    let newRouter = routerList.filter((item) => { return item.id && item.id === location.pathname.split('/')[3] })[0]
    const newName = newRouter ? newRouter.name : (pathnameDatas.length === 5 && tabsName[pathnameDatas[4]]
      ? `${name}[${tabsName[pathnameDatas[4]]}]`
      : name)
    if (isExist) {
      this.setState({
        activeKey: location.pathname,
      });
      const pageWrap = document.querySelectorAll(
        '.antd-pro-components-page-header-index-pageHeader'
      );
      if (pageWrap && pageWrap.length) {
        for (let i = 0; i < pageWrap.length; i++) {
          pageWrap[i].style.position = 'static';
          pageWrap[i].style.width = 'auto';
        }
      }
    } else {
      const index = panes.findIndex(pane => {
        return pane.key.split('/').length === 3 && location.pathname.indexOf(pane.key) > -1;
      });
      const index2 = panes.findIndex(pane => {
        return (
          location.pathname.split('/').length === 3 && pane.key.indexOf(location.pathname) > -1
        );
      });

      const newPane = { title: transferLanguage(newName, language), content: component, key: location.pathname };
      let newPanes = null;
      if (isReplaceTab) {
        newPanes = panes.map(item => {
          if (item.key === activeKey) {
            return newPane;
          } else {
            return item;
          }
        });

        dispatch({
          type: 'common/setTabsName',
          payload: { isReplaceTab: false },
        });
      } else {
        if (index > -1) {
          panes.splice(index + 1, 0, newPane);
          newPanes = panes;
        } else if (index2 > -1) {
          panes.splice(index2, 0, newPane);
          newPanes = panes;
        } else {
          newPanes = [...panes, newPane];
        }
      }

      this.setState({
        activeKey: location.pathname,
        panes: newPanes,
      });
      this.setPanes(newPanes);
    }
    
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    // if (notices.length === 0) {
    //   return {};
    // }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.createTime) {
        newNotice.datetime = moment(notice.createTime).format('YYYY-MM-DD HH:mm:ss');
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.requestJson) {
        newNotice.title = newNotice.requestJson
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  componentDidUpdate(prevProps,prevState){
    const { panes, activeKey } = this.state;
    
    // 判断是否是编辑完成之后的页面跳转,如果是,删除编辑tab
    let closeWindowFunc= localStorage.getItem('closeWindowFunc')
    let closeIndex = ''
    if(closeWindowFunc){
      panes.forEach((item, index)=>{
        if(item.key.indexOf(closeWindowFunc)>-1){
          closeIndex = index
        }
      }) 
      if(closeIndex!=''){
        localStorage.removeItem('closeWindowFunc')
        this.onChange(activeKey);
        panes.splice(closeIndex, 1);
        this.setState({
          panes: panes,
        });
      }
      
    }
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  onChange = activeKey => {
    router.push({
      pathname: activeKey === 'home' ? '/' : activeKey,
    });
  };

  remove = targetKey => {
    const { activeKey, panes, isInside } = this.state;
    let newActiveKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = panes[lastIndex].key;
      } else {
        newActiveKey = panes[0].key;
      }
    }
    this.onChange(newActiveKey);
    this.setState({ panes: newPanes, newActiveKey });
    this.setPanes(newPanes);
  };

  setPanes = panes => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/setPanes',
      payload: { panes },
    });
  };

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'userCenter') {
      router.push('/account/center');
      return;
    }
    if (key === 'triggerError') {
      router.push('/exception/trigger');
      return;
    }
    if (key === 'userinfo') {
      router.push('/account/settings/base');
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
      return;
    }
    if (key === 'passwd') {
      router.push('/system/userList/passwd');
      return;
    }
    if (key === 'user') {
      router.push('/account/center');
      return;
    }
  };

  /**
   * 右键点击事件
   * flag -> 0 1 2 3这个 其他 右边 全部
   */
  rightClick = (index, key, flag) => {
    const { panes } = this.state;
    let newPanes = [];
    switch (flag) {
      case 0:
        this.setState({ isInside: true }, () => {
          this.remove(key);
        });
        break;
      case 1:
        newPanes = [panes[0], panes[index]];
        this.setState({ panes: newPanes });
        this.setPanes(newPanes);
        this.onChange(key);
        break;
      case 2:
        newPanes = panes.filter((item, i) => i <= index);
        this.setState({ panes: newPanes });
        this.setPanes(newPanes);
        this.onChange(key);
        break;
      case 3:
        newPanes = [panes[0]];
        this.setState({ panes: newPanes });
        this.setPanes(newPanes);
        this.onChange('home');
        break;
    }
  };
  handleNoticeVisibleChange = () => {
    const { types } = this.state
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchNotices',
      payload: { types: types }
    });
  };
  onNoticeClear = () => {
    message.success(`清空了${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  render() {
    const { currentUser,
      // fetchingNotices,
      location, match, showHeader, language,
      isMobile, fixedHeader, collapsed, user } = this.props;
    const { activeKey } = this.state;
    const panes = this.props.panes.length > 0 ? this.props.panes : this.state.panes;
    // console.log('panes', panes);
    if (panes.length === 0) {
      return null;
    }
    const noticeData = this.getNoticeData();
    const menu = (
      <AMenu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
        {user && (
          <AMenu.Item>
            <div style={{ fontWeight: 'bold' }}>{user.sysName}</div>
            <div>@{user.loginName}</div>
          </AMenu.Item>
        )}
        <AMenu.Divider />
        <AMenu.Item key="passwd">
          <Icon type="setting" />
          {transferLanguage('base.condition.passwd', language)}
        </AMenu.Item>
        <AMenu.Item key="logout">
          <Icon type="logout" />
          {transferLanguage('base.condition.logout', language)}
        </AMenu.Item>
      </AMenu>
    );

    const operations = (
      <span className={styles.trigger}>
        <SelectWarehouse />
        <SelectLang style={{ marginRight: 10 }} />
        {localStorage.getItem('token') ? (
          <div div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
            <NoticeIcon
              className={styles.action}
              count={currentUser.notifyCount}
              onItemClick={(item, tabProps) => {
                console.log(item, tabProps); // eslint-disable-line
              }}
              onClear={this.onNoticeClear}
              onPopupVisibleChange={this.handleNoticeVisibleChange}
              // loading={fetchingNotices}
              popupAlign={{ offset: [20, -16] }}
            >
              <NoticeIcon.Tab
                list={noticeData['IMPORT']}
                title="导入"
                emptyText="你已查看所有通知"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
              />
              <NoticeIcon.Tab
                list={noticeData['OPERATION']}
                title="操作"
                emptyText="您已读完所有消息"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
              />
              {/* <NoticeIcon.Tab
            list={noticeData['待办']}
            title="待办"
            emptyText="你已完成所有待办"
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
          /> */}
            </NoticeIcon>

            <HeaderDropdown overlay={menu}>
              <div>
              <Avatar size="small" className={styles.avatar} src={userImage} alt="avatar" />
              <span style={{ marginLeft: '5px' }}>{user.sysName}</span>
              </div>
            </HeaderDropdown>
          </div>

        ) : (
          <Spin size="small" style={{ marginLeft: 8 }} />
        )}

        <Icon
          className={styles.toggle}
          onClick={this.toggle}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          style={{ marginLeft: 8 }}
        />
      </span>
    );

    const renderTabBar = (props, DefaultTabBar) => (
      <Sticky bottomOffset={80}>
        {({ style }) => (
          <DefaultTabBar
            {...props}
            style={{
              ...style,
              paddingLeft: isMobile ? 0 : 12,
              paddingTop: 1,
              height: 41,
              zIndex: 100,
              background: '#fff',
              top: 0,
              boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
            }}
          />
        )}
      </Sticky>
    );
    return (
      <div className={styles.customTabs}>
        <StickyContainer>
          <Tabs
            hideAdd
            tabBarExtraContent={operations}
            onChange={this.onChange}
            activeKey={activeKey}
            type={'editable-card'}
            onEdit={this.onEdit}
            renderTabBar={renderTabBar}
          >
            {panes.map((pane, index) => (
              <TabPane
                tab={
                  index === 0
                    ? pane.title
                    : index !== 0 && (
                      <div style={{ display: 'inline-block' }}>
                        <MenuProvider id={pane.key}>{pane.title}</MenuProvider>
                        <Menu id={pane.key} style={{ zIndex: 101, display: 'inline-block' }}>
                          {/* <Item onClick={this.rightClick.bind(this, index, pane.key, 0)}>
                              关闭这个
                            </Item> */}
                          <Item onClick={this.rightClick.bind(this, index, pane.key, 1)}>
                            {/* 关闭其他 */}
                            {transferLanguage('Common.field.closeOther', language)}
                          </Item>
                          <Item onClick={this.rightClick.bind(this, index, pane.key, 2)}>
                            {/* 关闭右边 */}
                            {transferLanguage('Common.field.closeRight', language)}
                          </Item>
                          <Item onClick={this.rightClick.bind(this, index, pane.key, 3)}>
                            {/* 关闭全部 */}
                            {transferLanguage('Common.field.closeAll', language)}
                          </Item>
                        </Menu>
                        {/* <Icon type="close" /> */}
                      </div>
                    )
                }
                key={pane.key}
              >
                {/* {} activeKey === pane.key  && */}
                <div className={styles.tabContent}>{pane.content}</div>
              </TabPane>
            ))}
          </Tabs>
        </StickyContainer>
      </div>
    );
  }
}
