export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/pageList/:menu/:pagecode',
        name: 'list',
        hideInMenu: true,
        component: './AutoPage/AutoList',
      },
      {
        path: '/pageEdit/:menu/:pagecode/:id',
        name: 'list',
        hideInMenu: true,
        component: './AutoPage/AutoOperate',
      },
      {
        path: '/pageAdd/:menu/:pagecode',
        name: 'list',
        hideInMenu: true,
        component: './AutoPage/AutoOperate',
      },
      // {
      //   path: '/system/roleList',
      //   id: 'roleList',
      //   name: 'roleList',
      //   code: 'ROLE_PAGE',
      //   component: './SystemManage/Role/RoleList',
      // },







      //Inbound-ASN 编辑
      {
        path: '/inboundManagement/ASNDetail/edit/:id',
        name: 'ASNDetail',
        id: 'ASNDetail',
        component: './Inbound/ASN/ASNOperator',
      },
      {
        path: '/inboundManagement/ASNDetail/add',
        name: 'ASNAdd',
        id: 'ASNDetail',
        component: './Inbound/ASN/ASNOperator',
      },
      // PO
      {
        path: '/inboundManagement/PoDetail/edit/:id',
        name: 'PoDetail',
        id: 'PoDetail',
        component: './Order/Po/PoOperator',
      },
      {
        path: '/inboundManagement/PoDetail/add',
        name: 'PoAdd',
        id: 'PoDetail',
        component: './Order/Po/PoOperator',
      },

      // So
      {
        path: '/outboundManagement/WmsSoDetailEditPage/edit/:id',
        name: 'SoDetail',
        id: 'WmsSoDetailEditPage',
        component: './Outbound/So/SoOperator',
      },
      {
        path: '/outboundManagement/WmsSoDetailEditPage/add',
        name: 'SoAdd',
        id: 'WmsSoDetailEditPage',
        component: './Outbound/So/SoOperator',
      },

      // OBNotice 
      {
        path: '/outboundManagement/WmsOutboundNoticeDetailPage/edit/:id',
        name: 'OBNoticeDetail',
        id: 'WmsOutboundNoticeDetailPage',
        component: './Outbound/OBNotice/obNoticeOperator',
      },
      {
        path: '/outboundManagement/WmsOutboundNoticeDetailPage/add',
        name: 'OBNoticeAdd',
        id: 'WmsOutboundNoticeDetailPage',
        component: './Outbound/OBNotice/obNoticeOperator',
      },

      //仓库管理
      {
        path: '/BaseData/listWareHouse',
        name: 'BasicData.Warehouse',
        id: 'Warehouse',
        code: 'Warehouse_Management',
        component: './BasicData/WarehouseManage/WarehouseList',
      },
      {
        path: '/BaseData/listWareHouse/addWareHouse',
        name: 'BasicData.WarehouseAdd',
        code: 'Warehouse_Management',
        component: './BasicData/WarehouseManage/WarehouseOperate',
        hideInMenu: true,
      },
      {
        path: '/BaseData/listWareHouse/editWareHouse/:id',
        name: 'BasicData.WarehouseEdit',
        code: 'Warehouse_Management',
        component: './BasicData/WarehouseManage/WarehouseOperate',
        hideInMenu: true,
      },
      //仓库库区
      {
        path: '/BaseData/listWareHouseArea',
        name: 'Area',
        id: 'Area',
        code: 'Area_Management',
        component: './BasicData/WarehouseArea/WarehouseAreaList',
      },
      {
        path: '/BaseData/listWareHouseArea/addWareHouseArea',
        name: 'BasicData.AreaAdd',
        code: 'Area_Management',
        component: './BasicData/WarehouseArea/WarehouseAreaOperate',
        hideInMenu: true,
      },
      {
        path: '/BaseData/listWareHouseArea/editWareHouseArea/:id',
        name: 'BasicData.AreaEdit',
        code: 'Area_Management',
        component: './BasicData/WarehouseArea/WarehouseAreaOperate',
        hideInMenu: true,
      },
      //仓库库位
      {
        path: '/BaseData/warehouseBin/warehouseBinList',
        name: 'Bin',
        id: 'Bin',
        code: 'Bin_Management',
        component: './BasicData/WarehouseBin/WarehouseBinList',
      },
      {
        path: '/BaseData/warehouseBin/warehouseBinAdd',
        name: 'BasicData.BinAdd',
        code: 'Bin_Management',
        component: './BasicData/WarehouseBin/WarehouseBinOperate',
        hideInMenu: true,
      },
      {
        path: '/BaseData/warehouseBin/warehouseBinEdit/:id',
        name: 'BasicData.BinEdit',
        code: 'Bin_Management',
        component: './BasicData/WarehouseBin/WarehouseBinOperate',
        hideInMenu: true,
      },

      //货品管理
      {
        path: '/BaseData/listGoods',
        name: 'BasicData.PartData',
        id: 'PartData',
        code: 'PartData_Management',
        component: './BasicData/PartData/GoodsList',
      },
      {
        path: '/BaseData/listGoods/addGoods',
        name: 'BasicData.PartDataAdd',
        code: 'PartData_Management',
        component: './BasicData/PartData/GoodsOperate',
        hideInMenu: true,
      },
      {
        path: '/BaseData/listGoods/editGoods/:id',
        name: 'BasicData.PartDataEdit',
        code: 'PartData_Management',
        component: './BasicData/PartData/GoodsOperate',
        hideInMenu: true,
      },

      //国家管理
      {
        path: '/BaseData/listCountry',
        name: 'BasicData.Country',
        id: 'Country',
        code: 'Country_Management',
        component: './BasicData/Country/CountryList',
      },
      {
        path: '/BaseData/listCountry/addCountry',
        name: 'BasicData.CountryAdd',
        code: 'Country_Management',
        component: './BasicData/Country/CountryOperate',
        hideInMenu: true,
      },
      {
        path: '/BaseData/listCountry/editCountry/:id',
        name: 'BasicData.CountryEdit',
        code: 'Country_Management',
        component: './BasicData/Country/CountryOperate',
        hideInMenu: true,
      },

      //单据流水号
      {
        path: '/BaseData/listBillType',
        name: 'BasicData.BillType',
        id: 'BillType',
        code: 'BillType_Management',
        component: './BasicData/BillType/BillTypeList',
      },
      {
        path: '/BaseData/listBillType/addBillType',
        name: 'BasicData.BillTypeAdd',
        code: 'BillType_Management',
        component: './BasicData/BillType/BillTypeOperate',
        hideInMenu: true,
      },
      {
        path: '/BaseData/listBillType/editBillType/:id',
        name: 'BasicData.BillTypeEdit',
        code: 'BillType_Management',
        component: './BasicData/BillType/BillTypeOperate',
        hideInMenu: true,
      },
      //收发货人 contactUnit
      {
        path: '/BaseData/listContactUnit',
        name: 'BasicData.ContactUnit',
        id: 'ContactUnit',
        code: 'ContactUnit_Management',
        component: './BasicData/ContactUnit/ContactUnitList',

      },
      {
        path: '/BaseData/listContactUnit/addContactUnit',
        name: 'BasicData.ContactUnitAdd',
        code: 'ContactUnit_Management',
        component: './BasicData/ContactUnit/ContactUnitOperate',
        hideInMenu: true,
      },
      {
        path: '/BaseData/listContactUnit/editContactUnit/:id',
        name: 'BasicData.ContactUnitEdit',
        code: 'ContactUnit_Management',
        component: './BasicData/ContactUnit/ContactUnitOperate',
        hideInMenu: true,
      },



      //license
      {

        path: '/system/License',
        name: 'License',
        id: 'License',
        code: 'License',
        component: './System/License/License',
      },
      {
        path: '/windowLayout/:pagecode/:id',
        name: 'inventoryWindowAge',
        hideInMenu: true,
        component: './WindowLayout/WindowLayout'
      },
      // {
      //   path: '/system/roleList',
      //   id: 'roleList',
      //   name: 'roleList',
      //   code: 'ROLE_PAGE',
      //   component: './SystemManage/Role/RoleList',
      // },
      //language
      {
        path: '/system/LanguageList',
        id: 'LanguageList',
        name: 'LanguageList',
        code: 'CLIENTPAGE',
        component: './System/Language/LanguageList',
      },
      //业务组织管理
      {
        path: '/system/OrgList',
        name: 'OrgList',
        id: 'OrgList',
        code: 'ORGPAGE',
        component: './System/TmsOrg/OrgList',
      },
      {
        path: '/system/OrgList/edit-form/:id',
        name: 'OrgEdit',
        component: './System/TmsOrg/UpdateForm',
        hideInMenu: true,
      },
      {
        path: '/system/OrgList/add-form',
        name: 'OrgAdd',
        component: './System/TmsOrg/UpdateForm',
        hideInMenu: true,
      },
      //用户管理
      {
        path: '/system/AuthList',
        name: 'AuthList',
        id: 'AuthList',
        code: 'USERPAGE',
        component: './System/TmsAuth/AuthList',
      },
      {
        path: '/system/AuthList/edit-form/:id',
        name: 'AuthEdit',
        component: './System/TmsAuth/UpdateForm',
        hideInMenu: true,
      },
      {
        path: '/system/AuthList/add-form',
        name: 'AuthAdd',
        component: './System/TmsAuth/UpdateForm',
        hideInMenu: true,
      },
      //修改密码
      {
        path: '/system/AuthList/passwd',
        name: 'Passwd',
        component: './User/UpdatePasswd',
        hideInMenu: true,
      },
      //角色管理
      {
        path: '/system/RoleList',
        name: 'RoleList',
        id: 'RoleList',
        code: 'ROLEPAGE',
        component: './System/TmsRole/RoleList',
      },
      {
        path: '/system/RoleList/edit-form/:id',
        name: 'RoleEdit',
        component: './System/TmsRole/UpdateForm',
        hideInMenu: true,
      },
      {
        path: '/system/RoleList/add-form',
        name: 'RoleAdd',
        component: './System/TmsRole/UpdateForm',
        hideInMenu: true,
      },

      //计划任务日志
      {
        path: '/system/listScheduledTaskLog',
        name: 'ScheduledTaskLogList',
        id: 'ScheduledTaskLogList',
        code: 'SYSCONFIGPAGE',
        component: './System/ScheduledTaskLog/ScheduledTaskLogList',
      },



      //CrontabList定时任务
      {
        path: '/SystemSetting/listCrontab',
        name: 'CrontabList',
        id: 'CrontabList',
        code: 'SYSCONFIGPAGE',
        component: './SystemSetting/Crontab/CrontabList',
      },
      {
        path: '/SystemSetting/Crontab/CrontabEdit/:id',
        name: 'SysConfigEdit',
        component: './SystemSetting/Crontab/CrontabOperate',
        hideInMenu: true,
      },
      {
        path: '/SystemSetting/Crontab/CrontabAdd',
        name: 'SysConfigAdd',

        component: './SystemSetting/Crontab/CrontabOperate',
        hideInMenu: true,
      },

      //字典管理
      {
        path: '/SystemSetting/dictList',
        name: 'DictList',
        id: 'DictList',
        code: 'DICTPAGE',
        component: './SystemSetting/Dict/DictList',
      },
      {
        path: '/SystemSetting/dictList/dictEdit/:id',
        name: 'DictEdit',
        component: './SystemSetting/Dict/DictOperate',
        hideInMenu: true,
      },
      {
        path: '/SystemSetting/dictList/dictAdd',
        name: 'DictAdd',
        component: './SystemSetting/Dict/DictOperate',
        hideInMenu: true,
      },
      //数据字典管理
      {
        path: '/SystemSetting/dictDataList',
        name: 'DictDataList',
        id: 'DictDataList',
        code: 'DICTDATAPAGE',
        component: './SystemSetting/DictData/DictDataList',
      },
      //菜单管理
      {
        path: '/SystemSetting/MenuList',
        name: 'MenuList',
        id: 'MenuList',
        code: 'MENUPAGE',
        component: './SystemSetting/TmsMenu/MenuList',
      },
      {
        path: '/SystemSetting/MenuList/edit-form/:id',
        name: 'MenuEdit',
        component: './SystemSetting/TmsMenu/UpdateForm',
        hideInMenu: true,
      },
      {
        path: '/SystemSetting/MenuList/add-form',
        name: 'MenuAdd',
        component: './SystemSetting/TmsMenu/UpdateForm',
        hideInMenu: true,
      },
      //Task
      {
        path: '/SystemSetting/Task',
        name: 'InterFace.Task',
        id: 'Task',
        code: 'Content_Management',
        component: './SystemSetting/Task/InterfaceContentList',
      },
      {
        path: '/SystemSetting/Task/ContentEdit/:id',
        name: 'InterFace.ContentEdit',
        hideInMenu: true,
        code: 'Content_Management',
        component: './SystemSetting/Task/ContentOperate',
      },
      //Type
      {
        path: '/SystemSetting/Type',
        name: 'InterFace.Type',
        id: 'Type',
        code: 'Type_Management',
        component: './SystemSetting/Type/InterfaceTypeList',
      },
      {
        path: '/SystemSetting/Type/typeAdd',
        name: 'InterFace.TypeAdd',
        hideInMenu: true,
        code: 'Type_Management',
        component: './SystemSetting/Type/TypeOperate',
      },
      {
        path: '/SystemSetting/Type/typeEdit/:id',
        name: 'InterFace.TypeEdit',
        hideInMenu: true,
        code: 'Type_Management',
        component: './SystemSetting/Type/TypeOperate',
      },
      //blockQueue
      {
        path: '/SystemSetting/blockqueue/listBlockqueue',
        name: 'InterFace.BlockQueue',
        id: 'BlockQueue',
        code: 'Blockqueue_Management',
        component: './SystemSetting/BlockingQueue/BlockingQueueList',
      },

       //规则管理：
       //动态数据源
       {
        path: '/rules/ruleMannage/dynamicDataList',
        name: 'DB Design',
        id:'DBDesign',
        code: 'DBDefine_Management',
        component: './RuleMannage/DynamicData/DynamicDataList',
      },
      {
        path: '/rules/ruleMannage/dynamicDataList/dynamicDataEdit/:id',
        name: 'Rules.DynamicDataEdit',
        component: './RuleMannage/DynamicData/DynamicDataOperate',
        hideInMenu: true,
      },
      {
        path: '/rules/ruleMannage/dynamicDataList/dynamicDataAdd',
        name: 'Rules.DynamicDataAdd',
        component: './RuleMannage/DynamicData/DynamicDataOperate',
        hideInMenu: true,
      },
      //  动态表管理
      {
        path: '/rules/ruleMannage/dynamicTableList',
        name: 'TableDesign',
        id:'TableDesign',
        code: 'TableDesign_Management',
        component: './RuleMannage/DynamicTable/DynamicTableList',
      },
      {
        path: '/rules/ruleMannage/dynamicTableList/dynamicTableEdit/:id',
        name: 'Rules.DynamicTableEdit',
        component: './RuleMannage/DynamicTable/DynamicTableOperate',
        hideInMenu: true,
      },
      {
        path: '/rules/ruleMannage/dynamicTableList/dynamicTableAdd',
        name: 'Rules.DynamicTableAdd',
        component: './RuleMannage/DynamicTable/DynamicTableOperate',
        hideInMenu: true,
      },

      {
        // path: '/rules/ruleMannage/dynamicTableList/dynamicTableData/:name',
        path: '/rules/ruleMannage/dynamicTableList/dynamicTableData',
        name: 'Rules.DynamicTableDetails',
        component: './RuleMannage/DynamicTable/DynamicTableData',
        hideInMenu: true,
      },
      //业务规则维护
      {
        path: '/rules/ruleMannage/RulesList',
        name: 'RuleDesign',
        id:'RuleDesign',
        code: 'RuleDesign_Management',
        component: './RuleMannage/BusinessRules/RulesList',
      },
      //  动态表版本管理
      {
        path: '/rules/ruleMannage/dynamicTableListVersions',
        name: 'DynamicTableVersions',
        id:'DynamicTableVersions',
        code: 'DynamicTableVersions_Management',
        component: './RuleMannage/DynamicTableVersions/DynamicTableVersionsList',
      },
      {
        path: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsEdit/:id',
        name: 'Rules.DynamicTableVersionsEdit',
        component: './RuleMannage/DynamicTableVersions/DynamicTableVersionsOperate',
        hideInMenu: true,
      },
      {
        path: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsAdd',
        name: 'Rules.DynamicTableVersionsAdd',
        component: './RuleMannage/DynamicTableVersions/DynamicTableVersionsOperate',
        hideInMenu: true,
      },
      {
        // path: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsData/:name',
        path: '/rules/ruleMannage/dynamicTableVersionsList/dynamicTableVersionsData',
        name: 'Rules.DynamicTableVersionsDetails',
        component: './RuleMannage/DynamicTableVersions/DynamicTableVersionsData',
        hideInMenu: true,
      },
    ],

  },

];

