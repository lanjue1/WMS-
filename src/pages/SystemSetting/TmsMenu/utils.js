import AdSearch from '@/components/AdSearch';
import AdSelect from '@/components/AdSelect';

export const codes = {
  page: 'MENUPAGE',
};

export const menuTypeData = [
  { code: 'MENU', value: '菜单' },
  { code: 'PAGE', value: '页面' },
  { code: 'OPERATION', value: '操作' },
  { code: 'ELEMENT', value: '元素' },
];
export const pageType = [
  { code: 'STANDARD', value: '标准页面' },
  { code: 'PDA', value: 'PDA' },
  { code: 'CUSTOM', value: '自定义页面' },
  
];
export const status = [{ code: true, value: '启用' }, { code: false, value: '禁用' }];

export const allDispatchType = {
  list: 'tmsMenu/selectList',
  detail: 'tmsMenu/selectDetails',
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
