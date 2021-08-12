export const codes = {
  page: 'ORGPAGE',
};
export const allDispatchType = {
  list: 'tmsOrg/selectList',
  detail: 'tmsOrg/selectDetails',
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
