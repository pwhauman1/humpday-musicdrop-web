import { setLoginCookie, getCookie, removeCookie } from './cookieMonster';

export interface ILoginSuccess {
    id_token?: string;
}

export const GOOGLE_ID_TOKEN: string = 'GOOGLE_ID_TOKEN';

export default class LoginModule {
    static instance: LoginModule;
    updateLoginState: Function;

    private constructor(updateLoginState: Function) {
        this.updateLoginState = updateLoginState;
    }

    // This should only be called by App.tsx
    public static init(updateLoginState: Function) {
        if (!this.instance) this.instance = new LoginModule(updateLoginState);
        // We have to reset updateLoginState when App rerenders
        this.instance.updateLoginState = updateLoginState;
        return this.instance;
    }

    public static getInstance(): LoginModule {
        if(!this.instance) throw new Error('Login Module was never initalized!');
        return this.instance;
    }

    public isLoggedIn = (): boolean => {
        const loginMethod = getCookie(GOOGLE_ID_TOKEN);
        return !!loginMethod;
    }

    public loginSuccess = (creds: ILoginSuccess) => {
        this.login(creds);
    }

    public loginFail = () => {
        this.logout();
    }

    public logoutSuccess = () => {
        this.logout();
    }

    private login = (creds: ILoginSuccess) => {
        this.setGoogleCookiesOrFail(creds);
        this.updateLoginState(true);
    }

    private logout = () => {
        if (this.isLoggedIn()) {
            removeCookie(GOOGLE_ID_TOKEN);
            this.logoutGoogle();
        }
        this.updateLoginState(false);
    }

    private setGoogleCookiesOrFail = (creds: ILoginSuccess) => {
        if(!creds.id_token) throw new Error('Google Credentials doesn\'t Contain an id_token!');
        setLoginCookie(GOOGLE_ID_TOKEN, creds.id_token)
    }

    private logoutGoogle() {
        removeCookie(GOOGLE_ID_TOKEN);
    }
}
