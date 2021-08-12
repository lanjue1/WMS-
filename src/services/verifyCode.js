import request from '@/utils/request';

export async function getVerify(params){
    return request(`/server/api/captcha/get`,{
      method: 'POST',
      body: params,
    },true)

}

export async function checkVerify(params){
    return request(`/server/api/captcha/check`,{
      method: 'POST',
      body: params,
    },true)

}