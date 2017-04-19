import { getWindowMetrics } from '../../utils/helper';

export default function getWindowMetricsCall(req, res) {
    const windowMetrics = getWindowMetrics();
    res.answer(windowMetrics);
}
