import { chaynsInfo } from '../../chayns-info';
import { getKeyForTapp } from '../../utils/chayns-storage';

export default async function getObjectForKey(req, res) {
    const tappId = chaynsInfo.getGlobalData().AppInfo.TappSelected.Id;

    const item = await getKeyForTapp(tappId, req.value.key, req.value.accessMode);
    res.answer({ object: item });
}
