const davidRegexRes = /(David Client) \((\d+),/.exec(navigator.userAgent);

export const IS_DAVID_WINDOWS = !!davidRegexRes;

export const DAVID_VERSION_WINDOWS = IS_DAVID_WINDOWS ? davidRegexRes[2] : null;

