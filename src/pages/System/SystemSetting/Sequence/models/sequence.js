import {
  selectSequenceList,
  selectSequenceDetails,
  saveSequence,
  deleteSequence,
  ableOperate,
  curStep
} from '@/services/system/sequence';
import prompt from '@/components/Prompt';

export default {
  namespace: 'sequence',

  state: {
    sequenceList: {}, // 帐单列表
    sequenceDetail: {},
  },

  effects: {
    /**
     * 查询列表
     */
    *selectSequenceList({ payload, callback }, { call, put }) {
      const response = yield call(selectSequenceList, payload);
      const { code, data } = response;
      if (code !== 0) return;
      const { list, pageSize, total, pageNum } = data;
      yield put({
        type: 'saveAllValus',
        payload: {
          sequenceList: {
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
    /**
     * 查询详情---
     */
    *selectSequenceDetails({ payload, callback }, { call, put }) {
      const response = yield call(selectSequenceDetails, payload);
      const { code, data } = response;
      if (code !== 0) return;
      yield put({
        type: 'saveDetail',
        payload: { sequenceDetail: { [payload.id]: data } },
      });
      callback && callback(data);
    },
    *saveSequence({ payload, callback }, { call }) {
      const response = yield call(saveSequence, payload);
      const { code, data, message } = response;
      const content = `${payload.id ? '编辑' : '新增'}${message}`;
      if (code !== 0) return;
      prompt({ content });
      callback && callback(data);
    },
    *deleteSequence({ payload, callback }, { call }) {
      const response = yield call(deleteSequence, payload);
      const { code, data, message } = response;
      if (code !== 0) return;
      prompt({ content: `删除${message}` });
      callback && callback(data);
    },
     //启用禁用
     *ableOperate({ payload, callback }, { call }) {
      const response = yield call(ableOperate, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },
    //调整步长
    *curStep({ payload, callback }, { call }) {
      const response = yield call(curStep, payload);
      if (response.code === 0) {
        prompt({ content: response.message });
        callback(response);
      }
    },

    /**
     * 设置表单参数
     */
    *allValus({ payload }, { _, put }) {
      yield put({
        type: 'saveAllValus',
        payload,
      });
    },
  },

  reducers: {
    //设置表单参数
    saveAllValus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        sequenceDetail: { ...state.sequenceDetail, ...payload.sequenceDetail },
      };
    },
  },
};
