import Cookies from 'js-cookie';

const COOKIE_PREFIX = 'HDMD_';
const LOGIN_COOKIE_EXPIRES = 31;

export function setLoginCookie(name: string, value: string) {
    setCookie(name, value, LOGIN_COOKIE_EXPIRES);
}

export function setCookie(name: string, value: string, expirationInDays?: number) {
    const nameWithPrefix = COOKIE_PREFIX + name;
    const expires  = !!expirationInDays ? expirationInDays : undefined;
    Cookies.set(nameWithPrefix, value, { expires });
}

export function getCookie(name: string): string | undefined {
    const nameWithPrefix = COOKIE_PREFIX + name;
    return Cookies.get(nameWithPrefix);
}

export function removeCookie(name: string) {
    const nameWithPrefix = COOKIE_PREFIX + name;
    Cookies.remove(nameWithPrefix);
}
