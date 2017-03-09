import logger from 'chayns-logger';
import { decodeTobitAccessToken } from './utils/convert';
import { getAccessToken } from './utils/native-functions';
import Request from './utils/request';
import { LOGIN_TAPP } from './constants/login-tapp';
import { DEFAULT_LOCATIONID } from './constants/config';
import { VERSION } from './constants/version';

export let chaynsInfo;
let globalData;

export async function loadLocation(locationId = DEFAULT_LOCATIONID) {
    try {
        locationId = parseInt(locationId, 10);
        const locationSettingsRequest = await Request.get(`https://chaynssvc.tobit.com/v0.4/${locationId}/LocationSettings`);

        if (locationSettingsRequest.status === 204) {
            console.warning('no location found');
            logger.warn({
                message: 'No location found.',
                fileName: 'chaynsInfo.js',
                section: 'loadLocation',
                locationId: locationId
            });
        }

        const locationSettingsRequestResponse = await locationSettingsRequest.json();
        const locationSettings = await locationSettingsRequestResponse.data;


        locationSettings.design.color = `#${locationSettings.design.color}`;

        let accessToken = getAccessToken();
        let payload = decodeTobitAccessToken(accessToken);

        chaynsInfo = {
            Version: VERSION,
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
            SiteID: locationSettings.siteId,
            LocationName: locationSettings.locationName,
            IsMobile: false,
            ExclusiveMode: false,
            IsFacebook: (document.referrer.indexOf('staticxx.facebook') > -1 || location.href.indexOf('fb=1') > -1),
            Tapps: [],
            LocationPersonID: locationSettings.locationPersonId,
            Domain: window.location.host,
            ColorMode: locationSettings.design.colorMode,
            Color: locationSettings.design.color,
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
                FacebookAppID: locationSettings.facebookAppId,
                FacebookPageID: locationSettings.facebookId,
                Title: chaynsInfo.LocationName,
                CurrentUrl: window.location.href,
                SiteID: chaynsInfo.SiteID,
                LocationID: chaynsInfo.LocationID,
                IsColorSchemeDark: false,
                colorMode: chaynsInfo.ColorMode,
                color: chaynsInfo.Color,
            }
        };

        chaynsInfo.Tapps = await loadTapps(locationId);

        globalData.AppInfo.Tapps = chaynsInfo.Tapps;

        window.chaynsInfo = chaynsInfo;

        return true;
    } catch (e) {
        logger.error({
            message: 'Load location failed.',
            fileName: 'chaynsInfo.js',
            section: 'loadLocation',
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
        console.error('Load location failed.', e);
        return false;
    }
}

async function loadTapps(locationId) {
    try {
        const request = await Request.get(`https://chaynssvc.tobit.com/v0.4/${locationId}/Tapp?forWeb=true`);

        if (request.status === 204) {
            console.warn('Location has no tapps');
            logger.warning({
                message: 'Location has no tapps. (CustomNumber:Status)',
                fileName: 'chaynsInfo.js',
                customNumber: request.status,
                section: 'loadTapps',
                locationId: locationId
            });
        } else if (request.status !== 200) {
            console.warn('Get locationTapps failed.', request.status);
            logger.error({
                message: 'Get locationTapps failed. (CustomNumber:Status)',
                fileName: 'chaynsInfo.js',
                customNumber: request.status,
                section: 'loadTapps',
                locationId: locationId
            });
        }

        const jsonResponse = await request.json();
        const data = jsonResponse.data || [];

        const tapps = [];
        for (let entry of data) {
            if (entry.tapps && typeof entry.tapps === 'object') {
                tapps.push(...entry.tapps);
            } else {
                tapps.push(entry);
            }
        }

        tapps.push(LOGIN_TAPP);

        return tapps;
    }
    catch
        (e) {
        logger.error({
            message: 'Load Tapps failed.',
            locationId: locationId,
            fileName: 'chaynsInfo.js',
            section: 'loadTapps',
            ex: {
                message: e.message,
                stackTrace: e.stack
            }
        });
        console.error('Load Tapps failed.', e);
        return [LOGIN_TAPP];
    }
}

export function setSelectedTapp(tapp) {
    if (tapp && typeof tapp === 'object') {
        chaynsInfo.ExclusiveMode = tapp.exclusiveView || false;
        globalData.AppInfo.TappSelected = {
            'Id': tapp.id,
            'InternalName': tapp.internalName,
            'ShowName': tapp.showName,
            'SortID': tapp.sortId,
            'ExclusiveMode': tapp.exclusiveView,
            'LoadAsAjax': tapp.loadAsAjax,
            'Url': tapp.url,
            'Link': tapp.link,
            'SendAuthenticationHeader': tapp.sendAuthenticationHeader,
            'PostTobitAccessToken': tapp.postTobitAccessToken,
            'UserGroupIds': tapp.uacGroupIds || [],
            'HideFromMenu': tapp.hideFromMenu,
            'Mobile': tapp.mobile,
            'Desktop': tapp.desktop,
            'ShowOnlyInAdminMode': tapp.showOnlyInAdminMode,
            'Icon': tapp.icon,
            'FallbackTapp': tapp.fallbackTapp,
            'isExclusiveView': tapp.isExclusiveView
        };
    }
}