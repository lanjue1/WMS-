export const codes = {
  // select: 'ETCCHANGESELECT',
  // showDetail: 'ETCCHANGESELECT_VIEW',
  // add: 'ETCCHANGESELECT_ADD',
  // edit: 'ETCCHANGESELECT_UPD',
  // upload: 'ETCCHANGESELECT_IMPORT',
  page: 'EVENTSPAGE',
};

export const columns = [
  {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index) => (<span>{index + 1}</span>),
    width: 50
  },
  {
    title: 'CoReport.field.orderCreationTime',
    dataIndex: 'orderCreationTime',
  },
  {
    title: 'CoReport.field.soid',
    dataIndex: 'soid',
  },
  {
    title: 'CoReport.field.so',
    dataIndex: 'so',
  },
  {
    title: 'CoReport.field.itemNO',
    dataIndex: 'itemNO',
  },
  {
    title: 'CoReport.field.orderDate',
    dataIndex: 'orderDate',
  },
  {
    title: 'CoReport.field.region',
    dataIndex: 'region',
  },
  {
    title: 'CoReport.field.country',
    dataIndex: 'country',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'CoReport.field.originalPN',
    dataIndex: 'originalPN',
  },
  {
    title: 'CoReport.field.originalTopmost',
    dataIndex: 'originalTopmost',
  },
  {
    title: 'CoReport.field.shipPN',
    dataIndex: 'shipPN',
  },
  {
    title: 'CoReport.field.shipTopmost',
    dataIndex: 'shipTopmost',
  },
  {
    title: 'CoReport.field.shipPNValue',
    dataIndex: 'shipPNValue',
  },
  {
    title: 'CoReport.field.shipSN',
    dataIndex: 'shipSN',
  },
  {
    title: 'CoReport.field.shipcommodityCode',
    dataIndex: 'shipcommodityCode',
  },
  
  {
    title: 'CoReport.field.shipPNDesc',
    dataIndex: 'shipPNDesc',
  },
  {
    title: 'CoReport.field.shipToCountry',
    dataIndex: 'shipToCountry',
  },
  {
    title: 'CoReport.field.shipToCity',
    dataIndex: 'shipToCity',
  },
  {
    title: 'CoReport.field.contact',
    dataIndex: 'contact',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'CoReport.field.companyName',
    dataIndex: 'companyName',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'CoReport.field.sla',
    dataIndex: 'sla',
  },
  {
    title: 'CoReport.field.milkrunFlag',
    dataIndex: 'milkrunFlag',
  },


  {
    title: 'CoReport.field.zipcode',
    dataIndex: 'zipcode',
  },
  {
    title: 'CoReport.field.dcplant',
    dataIndex: 'dcplant',
  },
  {
    title: 'CoReport.field.servicedeliverytype',
    dataIndex: 'servicedeliverytype',
  },
  {
    title: 'CoReport.field.warranty',
    dataIndex: 'warranty',
  },
  {
    title: 'CoReport.field.premierflag',
    dataIndex: 'premierflag',
  },
  {
    title: 'CoReport.field.priorityflag',
    dataIndex: 'priorityflag',
  },
  {
    title: 'CoReport.field.swapflag',
    dataIndex: 'swapflag',
  },
  {
    title: 'CoReport.field.adpflag',
    dataIndex: 'adpflag',
  },
  {
    // 标题
    title: 'CoReport.field.adpcategory',
    // 数据字段
    dataIndex: 'adpcategory',
  },
  {
    title: 'CoReport.field.hddretention',
    dataIndex: 'hddretention',
  },
  {
    title: 'CoReport.field.serviceProviderName',
    dataIndex: 'serviceProviderName',
  },
  {
    title: 'CoReport.field.serviceProviderID',
    dataIndex: 'serviceProviderID',
  },
  {
    title: 'CoReport.field.returnFlag',
    dataIndex: 'returnFlag'
  },
  {
    title: 'CoReport.field.mtm',
    dataIndex: 'mtm',
  },
  {
    title: 'CoReport.field.machineType',
    dataIndex: 'machineType',
  },
  {
    title: 'CoReport.field.machineSN',
    dataIndex: 'machineSN',
  },
  {
    title: 'CoReport.field.brandGroup',
    dataIndex: 'brandGroup',
    render: text => <span title={text}>{text}</span>,
  },
  {
    title: 'CoReport.field.lenovoCarton_No',
    dataIndex: 'lenovoCarton_No',
  },
  {
    title: 'CoReport.field.itemAllocatedTime',
    dataIndex: 'itemAllocatedTime',
  },
  {
    title: 'CoReport.field.expectPickTime',
    dataIndex: 'expectPickTime',
  },
  
  {
    title: 'CoReport.field.whhandleTime',
    dataIndex: 'whhandleTime',
  },
  {
    title: 'CoReport.field.whpackTime',
    dataIndex: 'whpackTime',
  },
  {
    title: 'CoReport.field.whshipTime',
    dataIndex: 'whshipTime',
  },
  {
    title: 'CoReport.field.shipawb',
    dataIndex: 'shipawb',
  },
  {
    title: 'CoReport.field.shippickuptime',
    dataIndex: 'shippickuptime',
  },
  {
    title: 'CoReport.field.domesticHAWB',
    dataIndex: 'domesticHAWB',
  },
  {
    title: 'CoReport.field.flightETD',
    dataIndex: 'flightETD',
  },
  {
    title: 'CoReport.field.flightETA',
    dataIndex: 'flightETA',
  },
  {
    title: 'CoReport.field.flightATD',
    dataIndex: 'flightATD',
  },
  {
    title: 'CoReport.field.flightATA',
    dataIndex: 'flightATA',
  },
  {
    title: 'CoReport.field.soideta',
    dataIndex: 'soideta',
  },
  {
    title: 'CoReport.field.shipPOUDateTime',
    dataIndex: 'shipPOUDateTime',
  },
  {
    title: 'CoReport.field.palhit',
    dataIndex: 'palhit',
  },
  {
    title: 'CoReport.field.warehouseHIT',
    dataIndex: 'warehouseHIT',
  },
  {
    title: 'CoReport.field.transportationHIT',
    dataIndex: 'transportationHIT',
  },
  {
    title: 'CoReport.field.o2DHit',
    dataIndex: 'o2DHit',
  },
  {
    title: 'CoReport.field.orderStatus',
    dataIndex: 'orderStatus',
  },
  {
    title: 'CoReport.field.poureturnPickuptime',
    dataIndex: 'poureturnPickuptime',
  },
  {
    title: 'CoReport.field.poureturnPODTime',
    dataIndex: 'poureturnPODTime',
  },
  {
    title: 'CoReport.field.whrecvtime',
    dataIndex: 'whrecvtime',
  },
  {
    title: 'CoReport.field.poureturnAWB',
    dataIndex: 'poureturnAWB',
  },
  {
    title: 'CoReport.field.returnPN',
    dataIndex: 'returnPN',
  },
  {
    title: 'CoReport.field.returnSN',
    dataIndex: 'returnSN',
  },
  {
    title: 'CoReport.field.dispositionCode',
    dataIndex: 'dispositionCode',
  },
  {
    title: 'CoReport.field.redemptionCode',
    dataIndex: 'redemptionCode',
  },
  {
    title: 'CoReport.field.returnScreening',
    dataIndex: 'returnScreening',
  },
  {
    title: 'CoReport.field.returnStatus',
    dataIndex: 'returnStatus',
  },
  {
    title: 'CoReport.field.rcstatus',
    dataIndex: 'rcstatus',
  },
  {
    title: 'CoReport.field.podlastChangeTime',
    dataIndex: 'podlastChangeTime',
  },
  {
    title: 'CoReport.field.logisticFailureReason',
    dataIndex: 'logisticFailureReason',
  },
  {
    title: 'CoReport.field.remark',
    dataIndex: 'remark',
  },
  {
    title: 'CoReport.field.etereportLastChangeTime',
    dataIndex: 'etereportLastChangeTime',
  },
  
]