let qaBase = 'https://sub34.tobit.com/logintappqa';
let base = 'https://sub34.tobit.com/logintapp';
let url = '?AppVersion=' + window.ChaynsInfo.Version + '&ColorScheme=' + window.ChaynsInfo.ColorScheme.ID + '&SiteID=' + window.ChaynsInfo.SiteID + '&OS=webshadow&LocationID=' + window.ChaynsInfo.LocationID + '&facebookid=' + window.ChaynsInfo.getGlobalData().AppInfo.FacebookAppID;

export const loginTapp = `${qaBase}${url}`;

export const config = {
    '-1': loginTapp,
    '-2': 'http://w-mn.tobit.ag:8080?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&tappid=-2',
    '-7': 'https://tapp01.tobit.com/Tapps/PayByApp/Home/Index?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&tappid=-7',
    '251441': 'https://sub54.tobit.com/frontend/overview?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&tappid=251441',
    '250357': 'https://tapp01.tobit.com/Tapps/ChaynsId/Tickets.html?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&tappid=250357',
    '250358': 'https://tapp01.tobit.com/Tapps/ChaynsId/Documents.html?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&TappID=250358',
    '250359': 'https://tapp01.tobit.com/Tapps/ChaynsId/Money.html?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&TappID=250359'

/*    '-7': 'https://tappqa.tobit.com/ChaynsPBA/Home/Index?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&tappid=-7',
    '251441': 'https://sub54.tobit.com/frontend/overview?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&tappid=251441',
    '250357': 'https://tappqa.tobit.com/Tapps/ChaynsId/Tickets.html?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&tappid=250357',
    '250358': 'https://tappqa.tobit.com/Tapps/ChaynsId/Documents.html?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&TappID=250358',
    '250359': 'https://tappqa.tobit.com/Tapps/ChaynsId/Money.html?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&TappID=250359'*/


};

export function getUrlParameters() {
    let urlParam = window.location.href.split('?').length > 1 ? window.location.href.split('?')[1].split('&') : false;
    let params = {};

    if (urlParam) {
        urlParam.forEach(paramString => params[paramString.split('=')[0].toLowerCase()] = paramString.split('=')[1]);
    }
    return params;
}