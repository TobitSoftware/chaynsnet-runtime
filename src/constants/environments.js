export const ENVIRONMENTS = {
    MN: 'mn',
    DEV: 'development',
    QA: 'qa',
    LIVE: 'production',
    LIVE_V1: 'production:v1'
};

export const isLIVE = process.env.NODE_ENV === ENVIRONMENTS.LIVE;
export const isQA = process.env.NODE_ENV === ENVIRONMENTS.QA;
export const isDEV = process.env.DEV === ENVIRONMENTS.DEV;