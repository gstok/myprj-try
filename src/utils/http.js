import axios from 'axios';
import iView from "iview";

let qs = require("qs");

axios.defaults.timeout = 50000;
axios.defaults.baseURL = '';


function http(config) {
    return new Promise((resolve, reject) => {
        axios(config).then(response => {
            if (response.data.code === 401) {
                window.location.href = "/login.html";
            } else if (response.data.code === 403) {
                iView.Message.error('权限不足，禁止访问！');
            } else if (response.data.code === 500) {
                if (response.data.msg) {
                    iView.Message.error(response.data.msg);
                } else {
                    iView.Message.error('网络访问失败，请稍后再试！');
                }
            } else if (response.data.code !== 200) {
                iView.Message.error(response.data.msg);
            }
            resolve(response.data);
        }).catch(err => {
            iView.Message.error('网络请求发生错误！');
            reject(err);
        });
    });
}


/**
 * 封装get方法
 * @param url 要请求的url地址
 * @param params 请求的参数
 * @returns {Promise}
 */
export function fetch(url, params = {}) {
    return http({
        method: 'GET',
        url: url,
        params: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}


/**
 * 封装post请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return http({
        method: 'POST',
        url: url,
        data: qs.stringify(data),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

/**
 * 封装patch请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */

export function patch(url, data = {}) {
    return http({
        method: 'PATCH',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

/**
 * 封装put请求
 * @param url 要请求的url地址
 * @param data 请求的参数
 * @returns {Promise}
 */

export function put(url, data = {}) {
    return http({
        method: 'PUT',
        url: url,
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}