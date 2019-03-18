const DAVID_VERSION_REGEX = /\((\d+),?\s([a-z]+)/gi;

export default function getDavidVersion() {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (!userAgent.includes('david')) {
        return null;
    }

    const match = DAVID_VERSION_REGEX.exec(userAgent);

    if (!match) {
        return null;
    }

    const [, version, platform] = match;

    const isMac = platform === 'macos';
    const isWindows = platform === 'windows';

    return {
        version: parseInt(version, 10),
        isMac,
        isWindows
    };
}
