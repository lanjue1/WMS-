import fetch from 'dva/fetch';
import prompt from '@/components/Prompt';
import { notification, message ,Spin} from 'antd';

import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

const checkStatus = response => {

    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    if (response.status !== 401 && response.status !== 403) {
        prompt({
            type: 'error',
            title: `请求错误 ${response.status}: ${response.url}`,
            content: errortext,
        });
    }
    if (response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('changeToken');
        localStorage.removeItem('openToken');
        localStorage.removeItem('timeZone');
        router.push('/user/login');
    }
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
};


/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option, isSpinning = false) {
    // console.log('window.location.hostname??',option,isSpinning)
    const options = {
        expirys: isAntdPro(),
        ...option,
    };
    /**
     * Produce fingerprints based on url and parameters
     * Maybe url has the same parameters
     */
    const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
    const hashcode = hash
        .sha256()
        .update(fingerprint)
        .digest('hex');
    const tokenName = window.location.pathname.split('/')[1] === 'openSystem' ? 'openToken' : 'token';
    const token = localStorage.getItem([tokenName]) ? localStorage.getItem([tokenName]) : '';
    const defaultOptions = {
        credentials: 'include',
        headers: { token: token, },
    };
    if (option.type === 'headers') {
        defaultOptions.headers = {
            ...defaultOptions.headers,
            ...option.addHeaders
        }
    }
    if (option.type === 'enableEnum') {
        defaultOptions.headers = {
            ...defaultOptions.headers,
            'Hibase-EnableEnum': true
        }
    }

    let filename = ''
    const newOptions = { ...defaultOptions, ...options };
    if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'DELETE'
    ) {

        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                'Hibase-TimeZone': localStorage.getItem('timeZone') ? localStorage.getItem('timeZone') : 'UTC+8',
                ...newOptions.headers,
            };
            newOptions.body = JSON.stringify(newOptions.body);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                'Hibase-TimeZone': localStorage.getItem('timeZone') ? localStorage.getItem('timeZone') : 'UTC+8',
                ...newOptions.headers,
            };
        }
    }
    const expirys = options.expirys && 60;
    // options.expirys !== false, return the cache,
    if (options.expirys !== false) {
        const cached = sessionStorage.getItem(hashcode);
        const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
        if (cached !== null && whenCached !== null) {
            const age = (Date.now() - whenCached) / 1000;
            if (age < expirys) {
                const response = new Response(new Blob([cached]));
                return response.json();
            }
            // sessionStorage.removeItem(hashcode);
            sessionStorage.removeItem(`${hashcode}:timestamp`);
        }
    }

    // if (isSpinning) {
    //     window.g_app._store.dispatch({
    //         type: 'common/spin',
    //         payload: isSpinning,
    //     });
    // }
    window.g_app._store.dispatch({
        type: 'common/spin',
        payload: isSpinning,
    });
    const cachedSave = (response, hashcode) => {
        /**
         * Clone a response data and store it in sessionStorage
         * Does not support data other than json, Cache only json
         */
        // console.log('cachedSave-response',res.headers.get('content-dispositiondisposition'))

        const contentType = response.headers.get('Content-Type');

        if (contentType && contentType.match(/application\/json/i)) {
            // All data is saved as text
            response
                .clone()
                .text()
                .then(content => {
                    // sessionStorage.setItem(hashcode, content);
                    sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
                });
        }
        if (newOptions.type === 'File' && response.status !== 400) {
            message.success('下载成功', response.headers)
            // filename = response.headers.get('content-disposition').split(';')[1].split('=')[1]
            // console.log('contentType', response.headers.get('content-disposition').split(';')[1].split('=')[1])
            
            
            var blob = new Blob([response], { type: 'application/vnd.ms-excel' })
            // let AA=response.body.getReader()
            console.log('blob---',AA)
            // response.blob().then(body=>URL.createObjectURL(body))
            return download(blob)
            // return response.blob()
        }
        if (newOptions.method === 'DELETE' || response.status === 204) {
            return response.json();
        }
        return response;
    };

    const download = (blobUrl) => {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = 'filename.xlsx';
        a.href = blobUrl;
        a.click();
        document.body.removeChild(a);
    }

    return fetch(url, newOptions)
        .then(checkStatus)
        .then(response => cachedSave(response, hashcode))
        // .then(response => response.blob())
        .then(response => {
            // DELETE and 204 do not return data by default
            // using .json will report an error.
            if (isSpinning) {
                window.g_app._store.dispatch({
                    type: 'common/spin',
                    payload: false,
                });
            }

            let responseJson = response.json(); //json() 方法接收一个 Response 流，并将其读取完成。它返回一个 Promise，Promise 的解析 resolve 结果是将文本体解析为 JSON。
            if (newOptions.method === 'DELETE' || response.status === 204) {
                return response.text();
            }
            responseJson.then((value) => {
          
                // console.log('responseJson--value', value)
                // if (options.type == 'filename') {
                //     console.log('filenae==',value)
                //     let blobUrl = window.URL.createObjectURL(value.data);
                //     download(blobUrl);
                // }
                if (
                    value.type === 'application/octet-stream' ||
                    value.type === 'application/octet-stream;charset=UTF-8' ||
                    value.type === 'filename' ||
                    value.type === 'application/pdf'
                ) {
                    let blobUrl = window.URL.createObjectURL(value);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.download = filename;
                    a.href = blobUrl;
                    a.click();
                    document.body.removeChild(a);
                    return value;
                }
                if (value.code === 401 || value.code === 403) {
                    // localStorage.clear();
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('changeToken');
                    localStorage.removeItem('openToken');
                    localStorage.removeItem('timeZone');
                    router.push('/user/login');
                    // window.g_app._store.dispatch({
                    //   type: 'login/logout',
                    // });
                } else if (value.code && value.code != 0) {
                    if (url !== '/server/api/login/checkLogin') {
                        //统一处理后台报错
                        prompt({ type: 'error', title: 'Error', content: value.message });
                    }
                }
            }).finally(() => {})
            return responseJson;
        })
        .catch(e => {
            const status = e.name;
            if (isSpinning) {
                window.g_app._store.dispatch({
                    type: 'common/spin',
                    payload: false,
                });
            }

            if (status === 401) {
                router.push('/user/login');
                localStorage.removeItem('token');
                localStorage.removeItem('timeZone');
                // @HACK
                /* eslint-disable no-underscore-dangle */
                // window.g_app._store.dispatch({
                //   type: 'login/logout',
                // });
                return;
            }
            // environment should not be used
            // if (status === 403) {
            //   router.push('/exception/403');
            //   return;
            // }
            // if (status <= 504 && status >= 500) {
            //   router.push('/exception/500');
            //   return;
            // }
            // if (status >= 404 && status < 422) {
            //   router.push('/exception/404');
            // }
        });
}
