import {getRelativeColor} from './utils/getColor';

const ChaynsInfo = {
    Version: '4014',
    BaseUrl: '/',
    User: {
        ID: 26302,
        FirstName: 'Dennis',
        LastName: 'Stockhofe',
        PersonID: '118-30010',
        TobitAccessToken: 'ew0KICAiYWxnIjogIkhTNTEyIiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAiSXNBZG1pbiI6IHRydWUsDQogICJMb2NhdGlvbklEIjogNzc3ODMsDQogICJUb2JpdFVzZXJJRCI6IDI2MzAyLA0KICAiSXNNYW51ZmFjdHVyZXIiOiB0cnVlLA0KICAiVXNlcklEIjogMjg2NzUxOCwNCiAgIlBlcnNvbklEIjogIjExOC0zMDAxMCIsDQogICJGYWNlYm9va1VzZXJJRCI6ICIxMTgwMTI0NTQxOTk5Mzk2IiwNCiAgIkZpcnN0TmFtZSI6ICJEZW5uaXMiLA0KICAiTGFzdE5hbWUiOiAiU3RvY2tob2ZlIiwNCiAgIkZsYWciOiAwLA0KICAiTG9naW5UeXBlIjogMSwNCiAgInR5cGUiOiAxLA0KICAic3ViIjogIjExOC0zMDAxMCIsDQogICJleHAiOiAiMjAxNi0wOC0yNVQxNDo1MzoxMS41NjM3MzE5WiIsDQogICJpYXQiOiAiMjAxNi0wOC0yMlQxNDo1MzoxMS41NjM3MzE5WiIsDQogICJqdGkiOiAiY2FiNzhkMDktODFkOS00YjYzLTllZTMtNGIwM2NiODM2ZGVhIiwNCiAgImF1ZCI6IG51bGwsDQogICJyb2xlcyI6IG51bGwNCn0.-um7RY1ee1OuvOhtSx8xA3ZNBIPiWQtQhc5jZH4JGbO5cwctjog-viSZXY0c7FEoH-iPUKFqadED0uQBfhlCkA',
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
    IsFacebook: (document.referrer.indexOf('staticxx.facebook') >- 1 || location.href.indexOf('fb=1') > -1),
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
    getGlobalData
};

function getGlobalData() {
    return {
        AppUser: {
            UACGroups: [],
            FacebookAccessToken: '',
            FacebookUserName: '',
            FacebookID: '',
            PersonID: '118-30010',
            TobitUserID: 26302,
            TobitAccessToken: 'ew0KICAiYWxnIjogIkhTNTEyIiwNCiAgInR5cCI6ICJKV1QiDQp9.ew0KICAiSXNBZG1pbiI6IHRydWUsDQogICJMb2NhdGlvbklEIjogMjksDQogICJUb2JpdFVzZXJJRCI6IDI2MzAyLA0KICAiSXNNYW51ZmFjdHVyZXIiOiB0cnVlLA0KICAiVXNlcklEIjogMjg2NzUxOCwNCiAgIlBlcnNvbklEIjogIjExOC0zMDAxMCIsDQogICJGYWNlYm9va1VzZXJJRCI6ICIxMTIwNzExMjU3OTQwNzI1IiwNCiAgIkZpcnN0TmFtZSI6ICJEZW5uaXMiLA0KICAiTGFzdE5hbWUiOiAiU3RvY2tob2ZlIiwNCiAgIkZsYWciOiAwLA0KICAiTG9naW5UeXBlIjogMSwNCiAgInR5cGUiOiAxLA0KICAic3ViIjogIjExOC0zMDAxMCIsDQogICJleHAiOiAiMjAxNi0wOC0yNVQxMjo1MjoxMy44ODYxNTAxWiIsDQogICJpYXQiOiAiMjAxNi0wOC0yMlQxMjo1MjoxMy44ODYxNTAxWiIsDQogICJqdGkiOiAiZjk3YTg1MzAtZWVjYi00Y2NhLWJmMzItNzdkOWEyNTNkM2Y2IiwNCiAgImF1ZCI6IG51bGwsDQogICJyb2xlcyI6IG51bGwNCn0.ijtX-JclsgvmAmSl9ZlX-Q7v84L_gPLzEgzctvvzxsljRWD7UKQVs7FaOkomMDV_4xYUbQBnAzuTBnN9w8Uytg',
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