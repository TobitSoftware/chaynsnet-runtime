import { chaynsInfo } from '../../chayns-info';

let callback = null;

export const existCallback = () => callback !== null;

export function resetCallback() {
    callback = null;
}

export function executeCallback() {
    if (callback) {
        callback();
    }
}

export default function accessTokenStatusChange(req, res) {
    callback = () => res.answer(chaynsInfo.getGlobalData());
}
