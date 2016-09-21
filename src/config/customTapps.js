let devBase = 'http://localhost:8080/',
    qaBase = 'https://tappqa.tobit.com/tapps/LoginTapp/',
    liveBase = 'https://tapp03.tobit.com/ChaynsWebLightLogin/',
    urlParameter = '?AppVersion=##version##&OS=##os##&colormode=##colormode##&color=##color##&apname=##apname##&tappid=-1';

export const loginTappId = '-1';

export const config = {
    '-1': liveBase + urlParameter,
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