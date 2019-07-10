import { chaynsInfo } from '../../chayns-info';

export default function getGlobalData(req, res) {
    if (chaynsInfo && res && res.answer) {
        const data = chaynsInfo.getGlobalData();
        res.answer(data);
    }
}
