import logger from 'chayns-logger';

export async function getUserTokenByRenewToken(renewToken) {
    const request = await fetch('https://auth.tobit.com/v2/token', {
        method: 'POST',
        headers: {
            authorization: `bearer ${renewToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (request.status === 200) {
        const body = await request.json();

        return body.token;
    }

    if (request.status !== 401) {
        logger.warning({
            data: {
                'X-Request-Id': request.headers.get('X-Request-Id')
            },
            ex: {
                message: `getUserTokenByRenewToken failed with status code ${request.status}`
            },
            fileName: 'tobitAuth.js',
            section: 'tobitAuth.getUserTokenByRenewToken',
        });
    }

    return null;
}

export async function extendRenewToken(renewToken) {
    const request = await fetch('https://auth.tobit.com/v2/token/renew', {
        method: 'GET',
        headers: {
            authorization: `bearer ${renewToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (request.status === 200) {
        const body = await request.json();

        return body.token;
    }
    if (request.status === 204) {
        logger.warning({
            data: {
                'X-Request-Id': request.headers.get('X-Request-Id')
            },
            ex: {
                message: 'extendRenewToken returned status code 204'
            },
            fileName: 'tobitAuth.js',
            section: 'tobitAuth.extendRenewToken',
        });

        return renewToken;
    }

    logger.warning({
        data: {
            'X-Request-Id': request.headers.get('X-Request-Id')
        },
        ex: {
            message: `extendRenewToken failed with status code ${request.status}`
        },
        fileName: 'tobitAuth.js',
        section: 'tobitAuth.extendRenewToken',
    });
    return null;
}

export async function isTokenValid(userToken) {
    const request = await fetch('https://auth.tobit.com/v2/token/validate', {
        method: 'HEAD',
        headers: {
            authorization: `bearer ${userToken}`
        }
    });

    if (request.status !== 200 && request.status !== 401) {
        logger.warning({
            data: {
                'X-Request-Id': request.headers.get('X-Request-Id')
            },
            ex: {
                message: `getUserTokenByRenewToken failed with status code ${request.status}`
            },
            fileName: 'tobitAuth.js',
            section: 'tobitAuth.getUserTokenByRenewToken',
        });
    }

    return request.status === 200;
}
