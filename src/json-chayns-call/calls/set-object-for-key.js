/* eslint-disable no-unused-vars */
import { chaynsInfo } from '../../chayns-info';
import { removeKeyForTapp, setKeyForTapp } from '../../utils/chayns-storage';

export default function setObjectForKey(req, res) {
    const { value } = req;
    const tappId = chaynsInfo.getGlobalData().AppInfo.TappSelected.Id;

    if (value.object == null) {
        removeKeyForTapp(tappId, value.key, value.accessMode);
    } else {
        setKeyForTapp(tappId, value.key, value.object, value.accessMode, value.tappIDs);
    }
}