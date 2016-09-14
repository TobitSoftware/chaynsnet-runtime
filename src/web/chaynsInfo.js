import {getRelativeColor, decodeTobitAccessToken} from '../shared/utils/convert';

if (navigator.userAgent.indexOf('David Client') === -1) {

    if (!document.defaultView.chayns) {
        //Polyfill Chromium Webview
        document.parentWindow = {
            external: {
                Window: {
                    Close: () => document.defaultView.window.close
                },
                Chayns: {
                    RefreshDisplay: document.defaultView.chayns.refreshDisplay,
                    PutKeyValue: document.defaultView.chayns.putKeyValue,
                    GetKeyValue: document.defaultView.chayns.getKeyValue,
                    SetAccessToken: document.defaultView.chayns.setAccessToken,
                    GetAccessToken: document.defaultView.chayns.getAccessToken
                }
            }
        };
    } else {
        //Polyfill Debugging Chrome
        document.parentWindow = {
            external: {
                Window: {
                    Close: () => console.log('window closed.')
                },
                Chayns: {
                    RefreshDisplay: () => console.debug('refresh chaynsId icons'),
                    PutKeyValue: (name, value) => {
                        localStorage.setItem(name, value);
                    },
                    GetKeyValue: (name) => {
                        return localStorage.getItem(name);
                    },
                    SetAccessToken: (accessToken) => {
                        localStorage.setItem('-accessToken-', accessToken);
                    },
                    GetAccessToken: () => {
                        return localStorage.getItem('-accessToken-');
                    }
                }
            }
        };
    }
}


let accessToken = document.parentWindow.external.Chayns.GetAccessToken();
let payload = decodeTobitAccessToken(accessToken);

const ChaynsInfo = {
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
    LocationID: 77783,
    SiteID: '67758-09144',
    SiteIDInUrlRequired: true,
    PageID: '336898073182458',
    LocationName: 'David by Tobit.Software',
    IsMobile: false,
    ShowAppView: false,
    LoginEnabled: true,
    IsFacebook: (document.referrer.indexOf('staticxx.facebook') > -1 || location.href.indexOf('fb=1') > -1),
    ColorScheme: {
        Name: 'Stone',
        ID: 0,
        BaseColor: '#6E6E6E',
        IsSoft: false
    },
    Tapps: [],
    AdminMode: false,
    LocationPersonID: '141-24297',
    ExclusiveMode: false,
    IsProLicense: false,
    HideTitelImage: false,
    ImprintInfoShown: false,
    Domain: window.location.host,
    ColorMode: 0,
    Color: '#6E6E6E',
    Webshadow: {
        MenuPosition: 0
    },
    getGlobalData
};

function getGlobalData() {
    return {
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
            FacebookAppID: '1507743286201238',
            FacebookPageID: '336898073182458',
            Title: 'ChaynsID',
            CurrentUrl: window.location.href,
            SiteID: '67758-09144',
            LocationID: 77783,
            IsColorSchemeDark: false,
            ColorScheme: 1,
            colorMode: 0,
            color: '#6E6E6E',
            SchemeColors: {
                C10: getRelativeColor(10),
                C20: getRelativeColor(20),
                C30: getRelativeColor(30),
                C80: getRelativeColor(80),
                C100: '#6E6E6E',
                Menu: getRelativeColor(10)
            },
            ChaynsProLicense: false,
            IsFacebookFrame: false
        }
    };
}

export default ChaynsInfo;