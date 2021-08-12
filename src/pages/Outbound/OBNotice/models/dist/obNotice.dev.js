"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _obNotice = require("@/services/outbound/obNotice");

var _Prompt = _interopRequireDefault(require("@/components/Prompt"));

var _common = require("@/services/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  namespace: 'obNotice',
  state: {
    obNoticeDetails: {},
    obNoticeDetailList: {},
    packageList: {}
  },
  effects: {
    // 详情
    obNoticeDetails:
    /*#__PURE__*/
    regeneratorRuntime.mark(function obNoticeDetails(_ref, _ref2) {
      var payload, callback, call, put, response, filePayLoad, filePayLoadSign, fileResponse1, fileResponse2;
      return regeneratorRuntime.wrap(function obNoticeDetails$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              payload = _ref.payload, callback = _ref.callback;
              call = _ref2.call, put = _ref2.put;
              _context.next = 4;
              return call(_obNotice.obNoticeDetails, payload);

            case 4:
              response = _context.sent;
              filePayLoad = {
                bizId: payload.id,
                fileBizType: 'ASNBaseInfo'
              };
              filePayLoadSign = {
                bizId: payload.id,
                fileBizType: 'ASNSignForm'
              };
              _context.next = 9;
              return call(_common.selectFileList, filePayLoad);

            case 9:
              fileResponse1 = _context.sent;
              _context.next = 12;
              return call(_common.selectFileList, filePayLoadSign);

            case 12:
              fileResponse2 = _context.sent;

              if (fileResponse1.code == 0) {
                response.data.fileToken = fileResponse1.data;
                response.data.signForm = fileResponse2.data;
              }

              if (!(response.code === 0)) {
                _context.next = 18;
                break;
              }

              _context.next = 17;
              return put({
                type: 'detail',
                payload: {
                  obNoticeDetails: _defineProperty({}, payload.id, response.data)
                }
              });

            case 17:
              callback && callback(response.data);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, obNoticeDetails);
    }),
    // 明细列表
    obNoticeDetailList:
    /*#__PURE__*/
    regeneratorRuntime.mark(function obNoticeDetailList(_ref3, _ref4) {
      var payload, callback, call, put, type, params, typeList, response, code, data, _data$list, list, pageSize, total, pageNum;

      return regeneratorRuntime.wrap(function obNoticeDetailList$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              payload = _ref3.payload, callback = _ref3.callback;
              call = _ref4.call, put = _ref4.put;
              type = payload.type, params = _objectWithoutProperties(payload, ["type"]);
              typeList = 'obNoticeDetailList';
              _context2.t0 = type;
              _context2.next = _context2.t0 === 'obNoticeDetailList' ? 7 : 9;
              break;

            case 7:
              typeList = 'obNoticeDetailList';
              return _context2.abrupt("break", 9);

            case 9:
              _context2.next = 11;
              return call(_obNotice.obNoticeDetailList, payload);

            case 11:
              response = _context2.sent;
              code = response.code, data = response.data;

              if (!(code !== 0)) {
                _context2.next = 15;
                break;
              }

              return _context2.abrupt("return");

            case 15:
              _data$list = data.list, list = _data$list === void 0 ? [] : _data$list, pageSize = data.pageSize, total = data.total, pageNum = data.pageNum;
              _context2.next = 18;
              return put({
                type: 'show',
                payload: _defineProperty({}, typeList, _defineProperty({}, payload.outboundNoticeId, {
                  pagination: {
                    current: pageNum,
                    pageSize: pageSize,
                    total: total
                  },
                  list: list
                }))
              });

            case 18:
              callback && callback(list);

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, obNoticeDetailList);
    }),
    // 状态扭转 
    ableOperate:
    /*#__PURE__*/
    regeneratorRuntime.mark(function ableOperate(_ref5, _ref6) {
      var payload, callback, call, response;
      return regeneratorRuntime.wrap(function ableOperate$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              payload = _ref5.payload, callback = _ref5.callback;
              call = _ref6.call;
              _context3.next = 4;
              return call(_obNotice.ableOperate, payload);

            case 4:
              response = _context3.sent;

              if (!(response.code !== 0)) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt("return");

            case 7:
              (0, _Prompt["default"])({
                content: response.message
              });
              callback && callback(response);

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, ableOperate);
    })
  },
  reducers: {
    // PO列表数据
    show: function show(state, _ref7) {
      var payload = _ref7.payload;
      return _objectSpread({}, state, {}, payload);
    },
    // 详情数据
    detail: function detail(state, _ref8) {
      var payload = _ref8.payload;
      return _objectSpread({}, state, {
        obNoticeDetails: _objectSpread({}, state.obNoticeDetails, {}, payload.obNoticeDetails)
      });
    },
    detailDefault: function detailDefault(state, _ref9) {
      var payload = _ref9.payload;
      var param = '';

      for (var k in payload) {
        param = k;
      }

      return _objectSpread({}, state, _defineProperty({}, param, _objectSpread({}, state[param], {}, payload[param])));
    }
  }
};
exports["default"] = _default;