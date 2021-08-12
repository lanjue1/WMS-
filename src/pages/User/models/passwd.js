import { updatePasswd, forgetPasswd } from '@/services/user';
import Prompt from '@/components/Prompt';

export default {
  namespace: 'passwd',

  state: {},

  effects: {
    // 修改密码
    *updatePasswd({ payload }, { call, put }) {
      const response = yield call(updatePasswd, payload);
      if (response.code === 0) {
        Prompt({ content: response.messages });
      }
    },
    *forgetPasswd({ payload, callback }, { call, put }) {
      const response = yield call(forgetPasswd, payload);
      if (response.code === 0) {
        Prompt({ content: response.messages });
        callback();
      }
    },
  },

  reducers: {},
};
