import {
  poDetails,
  poDetailList,
  ableOperate,
} from '@/services/inbound/po';
import Prompt from '@/components/Prompt';
import { selectFileList } from '@/services/common';
export default {
  namespace: 'po',
  state: {
    poDetails: {},
    poDetailList: {},
    packageList: {},
    billList: {},
  },

  effects: {
    // ASN详情
    *poDetails({ payload, callback }, { call, put }) {
      const response = yield call(poDetails, payload);
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
          payload: { poDetails: { [payload.id]: response.data }, },
        });
        callback && callback(response.data);
      }
    },
    *poDetailList({ payload, callback }, { call, put }) {
      const { type, ...params } = payload
      let typeList = 'poDetailList'
      switch (type) {
        case 'poDetailList':
          typeList = 'poDetailList'
          break;
      }
      const response = yield call(poDetailList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list = [], pageSize, total, pageNum } = data;
      yield put({
        type: 'show',
        payload: {
          [typeList]: {
            [payload.poId]: {
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
    // po状态扭转 
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
    // ASN详情数据
    detail(state, { payload }) {
      return {
        ...state,
        poDetails: { ...state.poDetails, ...payload.poDetails },
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

