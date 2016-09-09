export default class facebook {
    constructor() {
        FB.init({
            appId: window.ChaynsInfo.FacebookAppID,
            xfbml: true,
            version: 'v2.5'
        });
    }

    login() {
        return new Promise((resolve)=> {

            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    resolve(response.authResponse.accessToken);
                }
                else {
                    FB.login(function (response) {
                        if (response.authResponse) {
                            resolve(response.authResponse.accessToken);
                        } else {
                            console.log('User cancelled login or did not fully authorize.');
                            resolve(null);
                        }
                    });
                }
            });
        });

    }

    logout() {
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                FB.logout(function (response) {
                    //FB.Auth.setAuthResponse(null, 'unknown');
                });
            }
        });
    }
}