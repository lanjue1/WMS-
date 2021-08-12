import AdSearch from '@/components/AdSearch';
import AdSelect from '@/components/AdSelect';
export const codes = {
  page: 'USERPAGE',
};
export const status = [{ code: 'true', value: '启用' }, { code: 'false', value: '禁用' }];
export const SelectColumns=[
  {
    title:'Name',
    dataIndex:'name',
    width:160,
  },
]
export const allDispatchType = {
  list: 'tmsAuth/selectList',
  detail: 'tmsAuth/selectDetails',
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
export function renderTableAdSelect({ key, data, value, props }) {
  let params = { onlyRead: true, value };
  if (key) {
    const { dictObject } = props;
    params = { data: dictObject[key], payload: { code: [key] }, ...params };
  } else {
    params = { data, ...params };
  }
  return <AdSelect {...params} />;
}
