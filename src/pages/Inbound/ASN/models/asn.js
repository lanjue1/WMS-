import {
  asnDetails,
  asnDetailList,
  ableOperate,

} from '@/services/inbound/asn';
import Prompt from '@/components/Prompt';
import {selectFileList} from '@/services/common';
export default {
  namespace: 'ASN',
  state: {
    asnDetails: {},
    partsList:{},
    packageList:{},
    billList:{},
  },

  effects: {
    // ASN详情
    *asnDetails({ payload, callback }, { call, put }) {
      const response = yield call(asnDetails, payload);
      const filePayLoad = { bizId: payload.id, fileBizType: 'ASNBaseInfo' };
      const filePayLoadSign={ bizId: payload.id, fileBizType: 'ASNSignForm' };
      const fileResponse1 = yield call(selectFileList, filePayLoad);
      const fileResponse2 = yield call(selectFileList, filePayLoadSign);
      if (fileResponse1.code == 0) {
        response.data.fileToken = fileResponse1.data;
        response.data.signForm = fileResponse2.data;
      }
      if (response.code === 0) {
        yield put({
          type: 'detail',
          payload: {asnDetails: { [payload.id]: response.data },},
        });
        callback && callback(response.data);
      }
    },
    *asnDetailList({ payload, callback }, { call, put }) {
      const { type, ...params } = payload
      let typeList = 'partList'
      switch (type) {
        case 'parts':
          typeList = 'partsList'
          break;
        case 'package':
          typeList = 'packageList'
          break;
        case 'bill':
          typeList = 'billList'
          break;
      }
      const response = yield call(asnDetailList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list=[], pageSize, total, pageNum } = data;
      yield put({
        type: 'show',
        payload: {
          [typeList]: {
            pagination: {
              current: pageNum,
              pageSize,
              total,
            },
            list,
          },
        },
      });
      callback && callback(list);
    },
    // ASN状态扭转 
    *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code !== 0) return
      Prompt({ content: response.message });
      callback && callback(response);
    },


  },
  reducers: {
    // ASN列表数据
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
        asnDetails: { ...state.asnDetails, ...payload.asnDetails },
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

