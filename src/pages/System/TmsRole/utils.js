export const codes = {
  page: 'ROLE_PAGE',
};
export const status = [{ code: true, value: '启用' }, { code: false, value: '禁用' }];

export const allDispatchType = {
  list: 'tmsRole/selectList',
  detail: 'tmsRole/selectDetails',
};

export function selectDetailAndInfo({ type, payload, props, callback }) {
  const { dispatch } = props;
  dispatch({
    type,
    payload,
    callback: data => {
      if (!data) return;
      callback && callback(data);
    },
  });
}
