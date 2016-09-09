import Request from '../utils/request';

export function emailLogin(eMail, password) {
    return Request.post('https://sub34.tobit.com/qa/token/Post', {
            'type': '3',
            'locationId': window.ChaynsInfo.LocationID
        },
        {
            'Authorization': `Basic ${btoa(`${eMail.trim()}:${password.trim()}`)}`
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.Status === 400) {
                return {
                    tobitAccessToken: data.TobitAccessToken,
                    success: true
                }
            } else {
                return {
                    success: false
                }
            }
        })
        .catch((ex) => {
            console.log('E-Mail-Login-Ex', ex);
            return {
                success: false
            };
        })
}

export function facebookLogin(facebookAccessToken) {

    return Request.post('https://sub34.tobit.com/qa/token/Post', {
            'type': '3',
            'locationId': window.ChaynsInfo.LocationID
        },
        {
            'Authorization': `facebook ${facebookAccessToken}`
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.Status === 400) {
                return {
                    tobitAccessToken: data.TobitAccessToken,
                    success: true
                }
            } else {
                return {
                    success: false
                }
            }
        })
        .catch((ex) => {
            console.log('Facebook-Login-Ex', ex);
            return {
                success: false
            };
        })
}