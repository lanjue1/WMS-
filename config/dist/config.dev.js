"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _os = _interopRequireDefault(require("os"));

var _router = _interopRequireDefault(require("./router.config"));

var _plugin = _interopRequireDefault(require("./plugin.config"));

var _defaultSettings = _interopRequireDefault(require("../src/defaultSettings"));

var _slash = _interopRequireDefault(require("slash2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var pwa = _defaultSettings["default"].pwa,
    primaryColor = _defaultSettings["default"].primaryColor;
var _process$env = process.env,
    APP_TYPE = _process$env.APP_TYPE,
    TEST = _process$env.TEST;
var plugins = [['umi-plugin-react', _objectSpread({
  antd: true,
  dva: {
    hmr: true
  },
  locale: {
    enable: true,
    // default false
    "default": 'zh-CN',
    // default zh-CN
    baseNavigator: true // default true, when it is true, will use `navigator.language` overwrite default

  },
  dynamicImport: {
    loadingComponent: './components/PageLoading/index',
    webpackChunkName: true,
    level: 3
  },
  uglifyJSOptions: function uglifyJSOptions(opts) {
    opts.uglifyOptions.compress.warning = true;
    opts.uglifyOptions.compress.drop_console = true;
    return opts;
  },
  pwa: pwa ? {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      importWorkboxFrom: 'local'
    }
  } : false
}, !TEST && _os["default"].platform() === 'darwin' ? {
  dll: {
    include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
    exclude: ['@babel/runtime']
  },
  hardSource: false
} : {})]]; // 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个

if (APP_TYPE === 'site') {
  plugins.push(['umi-plugin-ga', {
    code: 'UA-72788897-6'
  }]);
}

var _default = {
  // add for transfer to umi
  // history: 'hash',
  hash: true,
  // publicPath:'',
  plugins: plugins,
  define: {
    APP_TYPE: APP_TYPE || ''
  },
  treeShaking: true,
  targets: {
    ie: 11
  },
  // 路由配置
  routes: _router["default"],
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
    'font-size-base': '13px'
  },
  proxy: {
    '/server/api/': {
      // target: 'http://10.48.3.198:9020/', // 陈丰本地
      // target: 'http://10.48.3.192:9020/', //姜伟本地
      // target: 'http://192.168.1.125:8050/', //测试
      // target: 'http://10.48.3.133:8080/', //卫华测试
      // target: 'http://vpeqk8.natappfree.cc/', //李卫华
      // target: ' http://nutm5r.natappfree.cc/', //李卫华
      // target: 'http://10.48.3.130:8081/',
      // target: 'http://192.168.1.126:8050/', //mock
      target: 'http://10.48.3.219:9020/',
      // target: 'http://wei.ngrok.24k.fun/', // 魏书杰
      changeOrigin: true,
      pathRewrite: {
        '^/server/api/': ''
      }
    },
    '/server/easyMock/': {
      target: 'http://192.168.1.60:7300/mock/5cd53c536c54c94765696c98/',
      //测试
      changeOrigin: true,
      pathRewrite: {
        '^/server/easyMock/': ''
      }
    },
    '/getIcCardCookie': {
      target: 'https://app.singlewindow.cn/cas/login?service=https%3A%2F%2Fswapp.singlewindow.cn%2Fdeskserver%2Fj_spring_cas_security_check&logoutFlag=1&_swCardF=1',
      //测试
      changeOrigin: true
    }
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  disableRedirectHoist: true,
  disableDynamicImport: false,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: function getLocalIdent(context, localIdentName, localName) {
      if (context.resourcePath.includes('node_modules') || context.resourcePath.includes('ant.design.pro.less') || context.resourcePath.includes('global.less')) {
        return localName;
      }

      var match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        var antdProPath = match[1].replace('.less', '');
        var arr = (0, _slash["default"])(antdProPath).split('/').map(function (a) {
          return a.replace(/([A-Z])/g, '-$1');
        }).map(function (a) {
          return a.toLowerCase();
        });
        return "antd-pro".concat(arr.join('-'), "-").concat(localName).replace(/--/g, '-');
      }

      return localName;
    }
  },
  manifest: {
    basePath: '/'
  },
  chainWebpack: _plugin["default"]
};
exports["default"] = _default;