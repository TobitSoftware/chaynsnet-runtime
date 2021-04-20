const DAVID_VERSION_REGEX = /\((\d+),?\s([a-z]+)/i;

export default function getDavidVersion() {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (!userAgent.includes('david')) {
        const params = new URLSearchParams(location.search);
        if (params.has('davidclient')) {
            return {
                version: parseInt(params.get('davidclient'), 10),
                isMac: /mac/i.test(navigator.platform),
                isWindows: /win/i.test(navigator.platform),
            }
        }

        return null;
    }

    const match = userAgent.match(DAVID_VERSION_REGEX);

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
