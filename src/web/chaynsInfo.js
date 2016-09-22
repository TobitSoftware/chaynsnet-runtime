import {getRelativeColor, decodeTobitAccessToken} from '../shared/utils/convert';
import {getAccessToken} from '../shared/utils/native-functions';
import Request from '../shared/utils/request';

let chaynsInfo,
    globalData;

export function loadLocation(locationId = 1214) {
    return new Promise((resolve) => {
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
                        CurrentUrl: window.location.href,
                        SiteID: chaynsInfo.SiteID,
                        LocationID: chaynsInfo.LocationID,
                        IsColorSchemeDark: false,
                        colorMode: chaynsInfo.ColorMode,
                        color: chaynsInfo.Color,
                    }
                };

                window.ChaynsInfo = chaynsInfo;
                resolve();
            })
            .catch(()=>loadLocation().then(resolve))
    })
}