export const ENVIRONMENTS = {
    MN: 'mn',
    DEV: 'development',
    STAGING: 'staging',
    LIVE: 'production',
    LIVE_V1: 'production:v1'
};

export const isLIVE = process.env.NODE_ENV === ENVIRONMENTS.LIVE;
export const isSTAGING = process.env.NODE_ENV === ENVIRONMENTS.STAGING;
export const isDEV = process.env.DEV === ENVIRONMENTS.DEV;
