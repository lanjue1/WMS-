import request from '@/utils/request';

export async function fetchLanguage({ type }) {
    //international/list
    return request('/server/api/mds-message-source/selectList', {
        type: 'headers',
        addHeaders: {
            'Accept-Language': type/*  */
        },
        body: {},
        method: 'POST'
    });
}
