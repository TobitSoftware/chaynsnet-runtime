import { ENVIRONMENTS } from '../constants/environments';

export default function (env) {
    switch (env) {
        case ENVIRONMENTS.LIVE:
            reloadWithUrl('https://frontend.tobit.com/chaynsnet-runtime/v2/');
            break;
        case ENVIRONMENTS.LIVE_V1:
            reloadWithUrl('https://frontend.tobit.com/chaynsnet-runtime/v1/');
            break;
        case ENVIRONMENTS.STAGING:
            reloadWithUrl('https://chaynssvcqa.tobit.com/chaynsweblight/');
            break;
        case ENVIRONMENTS.DEV:
            reloadWithUrl('https://localhost:7070/');
            break;
        case ENVIRONMENTS.MN:
            reloadWithUrl('https://w-mn.tobit.ag:7070/');
            break;
        default:
            console.warn(`${env} is no valid environment`);
            break;
    }
}

function reloadWithUrl(url) {
    const urlParameter = location.href.substring(location.href.indexOf('?') + 1);
    location.href = `${url}?${urlParameter}`;
}
