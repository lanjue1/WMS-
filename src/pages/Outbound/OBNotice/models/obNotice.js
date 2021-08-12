import {
  obNoticeDetails,
  obNoticeDetailList,
  ableOperate,
} from '@/services/outbound/obNotice';
import Prompt from '@/components/Prompt';
import { selectFileList } from '@/services/common';
export default {
  namespace: 'obNotice',
  state: {
    obNoticeDetails: {},
    obNoticeDetailList: {},
    packageList: {},
  },

  effects: {
    // 详情
    *obNoticeDetails({ payload, callback }, { call, put }) {
      const response = yield call(obNoticeDetails, payload);
      const filePayLoad = { bizId: payload.id, fileBizType: 'ASNBaseInfo' };
      const filePayLoadSign = { bizId: payload.id, fileBizType: 'ASNSignForm' };
      const fileResponse1 = yield call(selectFileList, filePayLoad);
      const fileResponse2 = yield call(selectFileList, filePayLoadSign);
      if (fileResponse1.code == 0) {
        response.data.fileToken = fileResponse1.data;
        response.data.signForm = fileResponse2.data;
      }
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: { obNoticeDetails: { [payload.id]: response.data }, },
        });
        callback && callback(response.data);
      }
    },
    // 明细列表
    *obNoticeDetailList({ payload, callback }, { call, put }) {
      const { type, ...params } = payload
      let typeList = 'obNoticeDetailList'
      switch (type) {
        case 'obNoticeDetailList':
          typeList = 'obNoticeDetailList'
          break;
      }
      const response = yield call(obNoticeDetailList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list = [], pageSize, total, pageNum } = data;
      yield put({
        type: 'show',
        payload: {
          [typeList]: {
            [payload.outboundNoticeId]: {
              pagination: {
                current: pageNum,
                pageSize,
                total,
              },
              list,
            }
          },
        },
      });
      callback && callback(list);
    },
    // 状态扭转 
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code !== 0) return
      Prompt({ content: response.message });
      callback && callback(response);
    },


  },
  reducers: {
    // PO列表数据
    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    // 详情数据
    detail(state, { payload }) {
      return {
        ...state,
        obNoticeDetails: { ...state.obNoticeDetails, ...payload.obNoticeDetails },
      };
    },
    detailDefault(state, { payload }) {
      let param = '';
      for (let k in payload) {
        param = k;
      }
      return {
        ...state,
        [param]: { ...state[param], ...payload[param] },
      };
    },
  },
};

