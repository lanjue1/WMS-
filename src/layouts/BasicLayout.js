import React, { Suspense } from 'react';
import { Layout, Spin } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import logo from '../assets/hicainLogo_write.png';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import pathToRegexp from 'path-to-regexp';
import getPageTitle from '@/utils/getPageTitle';
import TabsController from '@/components/TabsController';
import router from 'umi/router';
import styles from './BasicLayout.less';
// import pageProfile from '@/pageProfile/index'
import XMLParser from 'react-xml-parser'
// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
const tabss = props => {
  return props;
};
class Tabss extends React.Component {
  render() {
    return;
  }
}
@connect(({ menu }) => ({ menuData: menu.menuData }))

class BasicLayout extends React.Component {
  state = {
    showHeader: false,
    currentRouter: {}
  };
  componentDidMount() {
    const {
      dispatch,
      route: { routes, path, authority },
      location: { pathname },
    } = this.props;

    // dispatch({
    //   type: 'user/fetchCurrent',
    // });
    // if (!localStorage.getItem('menuList')) {
    if (localStorage.getItem('token')) {
      dispatch({
        type: 'menu/getMenuList',
        payload: {
        },
        callback: (data) => {
          localStorage.setItem('menuList', JSON.stringify(data))
        }
      })
    }

    // }
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, path, authority },
    });
    // const reader = new FileReader();
    // pageProfile.testList.tobolb
    // reader.readAsText(pageProfile.testList);

    // let xml1 = '<?xml version="1.0" encoding="UTF-8"?><note><to>George</to><from>John</from><heading>Reminder</heading><body>Dont forget the meeting!</body></note>'

    // var xml = new XMLParser().parseFromString(xml1);
  }

  // Changes XML to JSON
  xmlToJson(xml) {
    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    }
    else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }
    // do children
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof (obj[nodeName]) == "undefined") {
          obj[nodeName] = xmlToJson(item);
        }
        else {
          if (typeof (obj[nodeName].length) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  };
  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '200px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    if (process.env.NODE_ENV === 'production' && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  };

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => {
      return pathToRegexp(key).test(pathname)
    });
    // 通过 pathname 匹配到全部包含routes的breadcrumbNameMap的对应的key，即path，再返回key对应的对象route
    // {
    //   path: '/inboundManagement/ASNDetail/add',
    //   name: 'ASNAdd',
    //   id: 'ASNDetail',
    //   component: './Inbound/ASN/ASNOperator',
    // },
    return breadcrumbNameMap[pathKey];
  };

  showOrHideHeader = showHeader => {
    this.setState({
      showHeader,
    });
  };

  setCurrentRouter = (currentRouter) => {
    const { dispatch } = this.props;
    this.setState({ currentRouter })
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location,
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
      dispatch,
      collapsed,
      match,
      menuLists,
      currentUser
    } = this.props;

    let menuList = !localStorage.getItem('menuList') ? menuLists : JSON.parse(localStorage.getItem('menuList'))
    // let menuList = JSON.parse(localStorage.getItem('menuList'))||menuLists
    const { pathname } = location;
    const { showHeader } = this.state;
    const tabsParams = {
      dispatch,
      match,
      location,
      showHeader,
      showOrHideHeader: this.showOrHideHeader,
      collapsed,
      isMobile,
      onCollapse: this.handleMenuCollapse,
      currentUser,
      ...this.matchParamsPath(pathname, breadcrumbNameMap),
      component: children,
      menuData,
      menuList
    };
    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuList}
            isMobile={isMobile}
            {...this.props}
            setCurrentRouter={(item) => this.setCurrentRouter(item)}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          {showHeader && (
            <Header
              menuData={menuList}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={logo}
              isMobile={isMobile}
              {...this.props}
            />
          )}

          <Content
            className={!showHeader ? styles.hideHeaderContent : styles.content}
            style={contentStyle}
          >
            <TabsController {...tabsParams} />
            {/* {children} */}
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname,this.state.currentRouter)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={null}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}

export default connect(({ user, global, common, setting, menu: menuModel }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  menuList: menuModel.menuList,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  spin: common.spin,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => (
      <Spin spinning={props.spin}>
        <BasicLayout {...props} isMobile={isMobile} />
      </Spin>
    )}
  </Media>
));
