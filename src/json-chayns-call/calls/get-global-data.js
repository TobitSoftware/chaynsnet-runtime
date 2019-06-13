import { chaynsInfo } from '../../chayns-info';

export default function getGlobalData(req, res) {
    if (chaynsInfo) {
        const data = chaynsInfo.getGlobalData();
        res.answer(data);
    }
}
