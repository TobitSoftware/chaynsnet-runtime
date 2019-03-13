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

    // ToDo: logging
    return null;
}

export async function isTokenValid(userToken) {
    const request = await fetch('https://auth.tobit.com/v2/token/validate', {
        method: 'GET',
        headers: {
            authorization: `bearer ${userToken}`
        }
    });

    return request.status === 200;
}
