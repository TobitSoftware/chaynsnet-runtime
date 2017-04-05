export default class Request {
    static get(url, customHeader) {
        return request('get', url, customHeader)
    }

    static post(url, body, customHeader) {
        return request('post', url, body, customHeader)
    }

    static patch(url, body, customHeader) {
        return request('patch', url, body, customHeader)
    }

    static delete(url, body, customHeader) {
        return request('delete', url, body, customHeader)
    }
}

function request(method, url, body, customHeader) {
    let config = {};

    if (method === 'get') {
        if (url.indexOf('?') > -1) {
            url += `&ts=${Date.now()}`
        } else {

            url += `?ts=${Date.now()}`
        }
    }

    config.method = method;
    config.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    if (window.ChaynsInfo && window.ChaynsInfo.User.TobitAccessToken) {
        config.headers.authorization = `Bearer ${window.ChaynsInfo.User.TobitAccessToken}`;
    }

    for (let type of Object.keys(customHeader || {})) {
        config.headers[type] = customHeader[type]
    }


    if (body) {
        config.body = JSON.stringify(body);
    }

    return fetch(url, config);
}