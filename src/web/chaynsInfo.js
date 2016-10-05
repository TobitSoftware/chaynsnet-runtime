import {decodeTobitAccessToken} from '../shared/utils/convert';
import {getAccessToken} from '../shared/utils/native-functions';
import Request from '../shared/utils/request';
import {loginTapp} from '../config';

let chaynsInfo,
    globalData;

export function loadLocation(locationId = 77783) {
    return new Promise((resolve) => {
        locationId = parseInt(locationId, 10);
        Request.get(`https://chaynssvc.tobit.com/v0.4/${locationId}/LocationSettings`)
            .then((res) => res.json())
            .then((data) => {
                data = data.data;

                data.design.color = `#${data.design.color}`;

                let accessToken = getAccessToken(),
                    payload = decodeTobitAccessToken(accessToken);

                chaynsInfo = {
                    Version: '4014',
                    BaseUrl: '/',
                    User: {
                        ID: payload && payload.TobitUserID ? payload.TobitUserID : 0,
                        FirstName: payload && payload.FirstName ? payload.FirstName : '',
                        LastName: payload && payload.LastName ? payload.LastName : '',
                        PersonID: payload && payload.PersonID ? payload.PersonID : '',
                        TobitAccessToken: accessToken,
                        UACGroups: []
                    },
                    LocationID: locationId,
                    SiteID: data.siteId,
                    LocationName: data.locatioName,
                    IsMobile: false,
                    IsFacebook: (document.referrer.indexOf('staticxx.facebook') > -1 || location.href.indexOf('fb=1') > -1),
                    Tapps: [],
                    LocationPersonID: data.locationPersonId,
                    Domain: window.location.host,
                    ColorMode: data.design.colorMode,
                    Color: data.design.color,
                    Webshadow: {
                        MenuPosition: 0
                    },
                    getGlobalData: () => globalData
                };


                globalData = {
                    AppUser: {
                        UACGroups: [],
                        FacebookAccessToken: '',
                        FacebookUserName: payload && payload.FirstName && payload.LastName ? `${payload.FirstName} ${payload.LastName}` : '',
                        FacebookID: payload && payload.FacebookUserID ? payload.FacebookUserID : '',
                        PersonID: payload && payload.PersonID ? payload.PersonID : '',
                        TobitUserID: payload && payload.TobitUserID ? payload.TobitUserID : 0,
                        TobitAccessToken: accessToken,
                        AdminMode: false
                    },
                    Device: {},
                    AppInfo: {
                        Version: 4014,
                        domain: location.host,
                        Tapps: [],
                        TappSelected: {},
                        FacebookAppID: data.facebookAppId,
                        FacebookPageID: data.facebookId,
                        Title: chaynsInfo.LocationName,
                        CurrentUrl: window.location.href,
                        SiteID: chaynsInfo.SiteID,
                        LocationID: chaynsInfo.LocationID,
                        IsColorSchemeDark: false,
                        colorMode: chaynsInfo.ColorMode,
                        color: chaynsInfo.Color,
                    }
                };
                window.ChaynsInfo = chaynsInfo;

                return Request.get(`https://chaynssvc.tobit.com/v0.4/${locationId}/Tapp?forWeb=true`)
                    .then(res => res.json())
                    .then((tapps) => {
                        chaynsInfo.Tapps = [];

                        for (let entry of tapps.data) {
                            if (entry.tapps && typeof entry.tapps === 'object') {
                                chaynsInfo.Tapps = chaynsInfo.Tapps.concat(entry.tapps);
                                continue;
                            }
                            chaynsInfo.Tapps.push(entry);
                        }

                        chaynsInfo.Tapps.push(loginTapp);
                        globalData.AppInfo.Tapps = chaynsInfo.Tapps;
                        resolve();
                    });
            })
            .catch((e) => console.error(e)); // loadLocation().then(resolve))
    })
}

export function setSelectedTapp(tapp) {
    if (tapp && typeof tapp === 'object') {
        globalData.AppInfo.TappSelected = {
            "Id": tapp.id,
            "InternalName": tapp.internalName,
            "ShowName": tapp.showName,
            "SortID": tapp.sortId,
            "ExclusiveMode": tapp.exclusiveMode,
            "LoadAsAjax": tapp.loadAsAjax,
            "Url": tapp.url,
            "Link": tapp.link,
            "SendAuthenticationHeader": tapp.sendAuthenticationHeader,
            "PostTobitAccessToken": tapp.postTobitAccessToken,
            "UserGroupIds": tapp.uacGroupIds || [],
            "HideFromMenu": tapp.hideFromMenu,
            "Mobile": tapp.mobile,
            "Desktop": tapp.desktop,
            "ShowOnlyInAdminMode": tapp.showOnlyInAdminMode,
            "Icon": tapp.icon,
            "FallbackTapp": tapp.fallbackTapp,
            "isExclusiveView": tapp.isExclusiveView
        };
    }
}