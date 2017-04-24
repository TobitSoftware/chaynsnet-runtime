import { removeKeyForTapp, setKeyForTapp } from '../../utils/chayns-storage';

export function setObjectForKey(req, res) {
    const value = req.value;
    const tappId = chaynsInfo.getGlobalData().AppInfo.TappSelected.Id;

    if (value.object == null) {
        removeKeyForTapp(tappId, value.key, value.accessMode);
    } else {
        setKeyForTapp(tappId, value.key, value.object, value.accessMode, value.tappIDs);
    }
}