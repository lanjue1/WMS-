import { stringify } from 'qs';
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

//一、业务类型列表查询
export async function interfaceTypeList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/mds-interface-type/selectMdsInterfaceTypeList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

/**
 * 新增编辑
 */
export async function interfaceTypeOperate(params) {
    const url = params.id ? 'mds-interface-type/updateMdsInterfaceType' : 'mds-interface-type/insertMdsInterfaceType';

    return request(
        `/server/api/${url}`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
//启用禁用
export async function ableOperate(params) {
    const url = params.type ? 'mds-interface-type/enableEvents' : 'mds-interface-type/disabledEvents';
    return request(
        `/server/api/${url}`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

/**详情 */
export async function interfaceTypeDetails(params) {
    return request(
        `/server/api/mds-interface-type/viewMdsInterfaceTypeDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
//二、接口内容：
export async function interfaceContentList(params) {
    params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/mds-interface-task/selectMdsInterfaceTaskList`, {
        method: 'POST',
        body: params,
        type: 'enableEnum'
    });
}

/**
 * 编辑
 */
export async function interfaceContentOperate(params) {
    return request(
        `/server/api/mds-interface-task/updateMdsInterfaceTask`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
/**详情 */
export async function interfaceContentDetails(params) {
    return request(
        `/server/api/mds-interface-task/viewMdsInterfaceTaskDetails`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}
/**
 * 新增编辑
 */
export async function eventReceiverOperate(params) {
    const url = params.id
        ? 'sms/sms-event-receiver/updateSmsEventReceiver'
        : 'sms-event-receiver/insertSmsEventReceiver';

    return request(
        `/server/api/sms/${url}`,
        {
            method: 'POST',
            body: params,
        },
        true
    );
}

export async function eventReceiverDelete(params) {
    return request(`/server/api/sms/sms-event-receiver/deleteSmsEventReceiver`, {
        method: 'POST',
        body: params,
    });
}


// 接口立即执行重试  sms/sms-event-content/retryMessageSend
export async function retryInterfaceContent(params) {
    return request(`/server/api/mds-interface-task/executeTask`, {
        method: 'POST',
        body: params,
    });
}


// 请求类型列表
export async function selectRequestTypeList(params) {
    return request(`/server/api/mds-dict-data/selectDictByCode`, {
        method: 'POST',
        body: params,
    });
}


//非list 接口  
export async function abledOperate(params) {
    const {type,...param}=params
    let url=''
    switch(type){
        case 'addTask' :
            url='mds-interface-task/addMdsInterfaceTask'
            break;
        case 'ignore':
            url='mds-interface-task/ignore'
            break;
    }
    return request(`/server/api/${url}`, {
        method: 'POST',
        body: param,
    });
}