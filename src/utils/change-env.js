import { ENVIRONMENTS } from '../constants/environments';

export default function (env) {
    switch (env) {
        case ENVIRONMENTS.LIVE:
            reloadWithUrl('https://chayns2.tobit.com/ChaynsWebLight/');
            break;
        case ENVIRONMENTS.QA:
            reloadWithUrl('https://chayns3.tobit.com/QA/ChaynsWebLight/');
            break;
        case ENVIRONMENTS.DEV:
            reloadWithUrl('https://localhost:7070/');
            break;
        case ENVIRONMENTS.MN:
            reloadWithUrl('https://w-mn.tobit.ag:7070/');
            break;
        default:
            reloadWithUrl('https://chayns2.tobit.com/ChaynsWebLight/');
            break;
    }
}

function reloadWithUrl(url) {
    const urlParameter = location.href.substring(location.href.indexOf('?') + 1);
    location.href = `${url}?${urlParameter}`;
}