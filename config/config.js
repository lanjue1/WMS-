// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const { pwa, primaryColor } = defaultSettings;
const { APP_TYPE, TEST } = process.env;

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      uglifyJSOptions(opts) {
        opts.uglifyOptions.compress.warning = true;
        opts.uglifyOptions.compress.drop_console = true;
        return opts;
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
      ...(!TEST && os.platform() === 'darwin'
        ? {
          dll: {
            include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
            exclude: ['@babel/runtime'],
          },
          hardSource: false,
        }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
if (APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  // add for transfer to umi
  // history: 'hash',
  hash: true,
  // publicPath:'',
  plugins,
  define: {
    APP_TYPE: APP_TYPE || '',
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
    'font-size-base': '13px',
  },
  proxy: {
    '/server/api/': {
       target: 'http://wzl.ngrok.24k.fun/', //王志林
      // target: 'http://10.48.3.198:9020/', // 陈丰本地
      //  target: 'http://8080.ngrok.24k.fun/', // 程俊本地
      // target: 'http://hang.ngrok.24k.fun/server/api/', // 杭建祥本地
      // target: 'http://sanguo.ngrok.24k.fun/', // 魏书杰本地
      // target: 'http://10.48.3.219:9020/', // 魏书杰本地
      //target: 'http://10.48.3.198:9020/', // 陈丰本地
      // target: 'http://10.48.3.192:9020/', //姜伟本地
      // target: 'http://192.168.1.125:8050/', //测试
      // target: 'http://10.48.3.133:8080/', //卫华测试
      //  target: ' http://wzl.ngrok.24k.fun/', //王志林
      // target: ' http://nutm5r.natappfree.cc/', //李卫华
      // target: 'http://10.48.3.130:8081/',
      // target: 'http://192.168.1.126:8050/', //mock
      // target: 'http://10.48.3.219:9020/',
      // target: 'http://wei.ngrok.24k.fun/', // 魏书杰
      // target: "http://10.48.3.198:9020/", // 陈丰本地
      changeOrigin: true,
      pathRewrite: { '^/server/api/': '' },
    },
    '/server/easyMock/': {
      target: 'http://192.168.1.60:7300/mock/5cd53c536c54c94765696c98/', //测试
      changeOrigin: true,
      pathRewrite: { '^/server/easyMock/': '' },
    },
    '/getIcCardCookie': {
      target:
        'https://app.singlewindow.cn/cas/login?service=https%3A%2F%2Fswapp.singlewindow.cn%2Fdeskserver%2Fj_spring_cas_security_check&logoutFlag=1&_swCardF=1', //测试
      changeOrigin: true,
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  disableDynamicImport: false,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
