
import request from '@/utils/request';
import { getPageSize } from '@/utils/common';

// 
export async function getPageConfig(params) {
    return request(`/server/api/pageConfig/getListConfig`, {
        method: 'POST',
        body: params,
    });
}


export async function getOperatePageConfig(params) {
    return request(`/server/api/test/getEditConfig`, {
        method: 'POST',
        body: params,
    });
}
// 
export async function fetchList(params) {
    params.pageSize = params.pageSize || getPageSize();
    const { listUrl, id, ...data } = params
    return request(`/server/api/${listUrl}`, {
        method: 'POST',
        body: data,
        type: 'enableEnum'
    });
}

export async function saveFormData(params) {
    const { requestUrl, ...data } = params
    // params.pageSize = params.pageSize || getPageSize();
    return request(`/server/api/${requestUrl}`, {
        method: 'POST',
        body: data,
    });
}


/**
 * @author xmgdty
 * @description 修改用户菜单配置表记录  
 * @param params
 * @time  2021/4/28
 */
export async function updatePageUserConfig(params) {
    return request(`/server/api/page-user-config/updatePageUserConfig`, {
        method: 'POST',
        body: params,
    });
}

/**
 * @author xmgdty
 * @description  下载文件 
 * @param params
 * @time  2021/6/18
 */
export async function downLoadFn(params) {
    const { requestUrl, ...data } = params
    let {key,value} = data
    return request(`/server/api/${requestUrl}`, {
        method: 'GET',
        body: {[key]:value},
        type: 'File'
    });
}


