import AdSelect from '@/components/AdSelect';

export const dateFormat = 'YYYY-MM-DD';
export const codes = {
  select: 'VEHICLESELECT',
  enable: 'VEHICLESELECT_ENABLE',
  disable: 'VEHICLESELECT_DISABLED',
  showDetail: 'VEHICLESELECT_VIEW',
  add: 'VEHICLESELECT_ADD',
  edit: 'VEHICLESELECT_UPD',
  editPaper: 'VEHICLESELECT_PAPERS_UPD',
  addPaper: 'VEHICLESELECT_PAPERS_ADD',
  editTemp: 'VEHICLESELECT_TMPT_UPD',
  addTemp: 'VEHICLESELECT_TMPT_ADD',
  deleteTemp: 'VEHICLESELECT_TMPT_DEL',
  page: 'VEHICLEPAGE',
};

export const allDispatchType = {
  list: 'demo/carList',
  detail: 'demo/selectDetails',
  operate: 'demo/vehicleOperate',
  ableVehicle: 'demo/ableVehicle',
  paperOperate: 'demo/paperOperate',
  papersDetails: 'demo/selectPapersDetails',
  vehicleDriverList: 'demo/vehicleDriverList',
  vehicleDriverDetails: 'demo/vehicleDriverDetails',
  vehicleDriverOperate: 'demo/vehicleDriverOperate',
  deleteVehicleDriver: 'demo/deleteVehicleDriver',
  allValus: 'demo/allValus',
};

export const routeUrl = {
  add: '/carBasic/demoList/addDemo',
  edit: '/carBasic/demoList/editDemo',
};

export const driverType = [
  { code: 'main-driver', value: '临时司机1' },
  { code: 'deputy-driver', value: '临时司机2' },
];

export const plateList = [
  { key: '港澳牌', val: '港澳牌' },
  { key: '浙', val: '浙' },
  { key: '粤', val: '粤' },
  { key: '京', val: '京' },
  { key: '津', val: '津' },
  { key: '冀', val: '冀' },
  { key: '晋', val: '晋' },
  { key: '辽', val: '辽' },
  { key: '沪', val: '沪' },
  { key: '吉', val: '吉' },
  { key: '苏', val: '苏' },
  { key: '皖', val: '皖' },
  { key: '赣', val: '赣' },
  { key: '鲁', val: '鲁' },
  { key: '豫', val: '豫' },
  { key: '鄂', val: '鄂' },
  { key: '湘', val: '湘' },
  { key: '琼', val: '琼' },
  { key: '渝', val: '渝' },
  { key: '川', val: '川' },
  { key: '贵', val: '贵' },
  { key: '云', val: '云' },
  { key: '陕', val: '陕' },
  { key: '甘', val: '甘' },
  { key: '青', val: '青' },
  { key: '蒙', val: '蒙' },
  { key: '黑', val: '黑' },
  { key: '桂', val: '桂' },
  { key: '藏', val: '藏' },
  { key: '宁', val: '宁' },
];

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

export const conditionList = [{
  code: 'eq', value: '等于'
},{
  code: 'ne', value: '不等于'
},{
  code: 'gt', value: '大于'
},{
  code: 'ge', value: '大于等于'
},{
  code: 'lt', value: '小于'
},{
  code: 'le', value: '小于等于'
},{
  code: 'like', value: '全模糊'
},{
  code: 'notLike', value: '不相似'
},{
  code: 'likeLeft', value: '左模糊'
},{
  code: 'likeRight', value: '右模糊'
},{
  code:'isNull',value:'为空'
},{
  code:'isNotNull',value:'不为空'
},{
  code:'in',value:'包含'
},{
  code:'notIn',value:'不包含'
}]
