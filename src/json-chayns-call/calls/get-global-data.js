import { chaynsInfo } from '../../chayns-info';

export default function getGlobalData(req, res) {
    const data = chaynsInfo.getGlobalData();
    res.answer(data);
}
