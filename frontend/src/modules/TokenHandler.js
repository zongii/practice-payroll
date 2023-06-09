import Cookies from 'universal-cookie';
export function saveTokenData(user, token) {
    const cookies = new Cookies();

    cookies.set('user', user, { path: '/' });
    cookies.set('token', token, { path: '/' });
}

export function tempSaveTokenData(user, token) {
    const cookies = new Cookies();

    cookies.set('user', user, { path: '/' , maxAge: 3600000});
    cookies.set('token', token, { path: '/', maxAge: 3600000});
}

export function clearTokenData() {
    const cookies = new Cookies();

    cookies.remove('user')
    cookies.remove('token')
}

export function getTokenData() {
    const cookies = new Cookies();

    const user = cookies.get('user') ?? "";
    const token = cookies.get('token') ?? "";

    return {user, token}
}

export function verifyCredentials() {
    const data = getTokenData();

    return fetch(`http://localhost:2137/auth/verifytoken`, 
    {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user: data.user, token: data.token})
    }).then(response => response.json())
}