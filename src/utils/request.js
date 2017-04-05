import { chaynsInfo } from '../chayns-info';

export default class Request {
    static get(url, customHeader) {
        return request('get', url, customHeader);
    }

    static post(url, body, customHeader) {
        return request('post', url, body, customHeader);
    }

    static patch(url, body, customHeader) {
        return request('patch', url, body, customHeader);
    }

    static delete(url, body, customHeader) {
        return request('delete', url, body, customHeader);
    }
}

function request(method, url, body, customHeader) {
    const config = {};

    if (method === 'get') {
        if (url.indexOf('?') > -1) {
            url += `&ts=${Date.now()}`;
        } else {
            url += `?ts=${Date.now()}`;
        }
    }

    config.method = method;
    config.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    if (chaynsInfo && chaynsInfo.User.TobitAccessToken) {
        config.headers.authorization = `Bearer ${chaynsInfo.User.TobitAccessToken}`;
    }

    for (const type of Object.keys(customHeader || {})) {
        config.headers[type] = customHeader[type];
    }


    if (body) {
        config.body = JSON.stringify(body);
    }

    return fetch(url, config);
}
