import { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { setLoginCookie, getCookie, removeCookie } from './cookieMonster';

export interface ILoginSuccess {
    id_token?: string;
}

export const GOOGLE_ID_TOKEN: string = 'GOOGLE_ID_TOKEN';
export const GOOGLE_CLIENT_ID = '133190089084-dbtescu4flhep75a4hgrn1elcvu2l1nl.apps.googleusercontent.com'

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

/*
   ______                  __                       __  __              __    
  / ____/___  ____  ____ _/ /__     ____ ___  ___  / /_/ /_  ____  ____/ /____
 / / __/ __ \/ __ \/ __ `/ / _ \   / __ `__ \/ _ \/ __/ __ \/ __ \/ __  / ___/
/ /_/ / /_/ / /_/ / /_/ / /  __/  / / / / / /  __/ /_/ / / / /_/ / /_/ (__  ) 
\____/\____/\____/\__, /_/\___/  /_/ /_/ /_/\___/\__/_/ /_/\____/\__,_/____/  
                 /____/                                                       
 */
    public getGoogleClientId = (): string => {
        return GOOGLE_CLIENT_ID;
    }

    public googleSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log('RESPNOSE: ', response);
        const responseNotOffline = response as GoogleLoginResponse;
        const token = responseNotOffline.tokenObj.id_token;
        const loginProps: ILoginSuccess = {
            id_token: token
        };
        this.loginSuccess(loginProps);
    };

    public googleFail = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.error(response);
        this.loginFail();
    };
    
    public googleLogout = (response?: any) => {
        console.log(response);
        this.logoutSuccess();
    };

    private setGoogleCookiesOrFail = (creds: ILoginSuccess) => {
        if(!creds.id_token) throw new Error('Google Credentials doesn\'t Contain an id_token!');
        setLoginCookie(GOOGLE_ID_TOKEN, creds.id_token)
    }

    private logoutGoogle() {
        removeCookie(GOOGLE_ID_TOKEN);
    }

/*
   ______                     _         __                                  __  __              __    
  / ____/__  ____  ___  _____(_)____   / /   ____  ____ _   ____ ___  ___  / /_/ /_  ____  ____/ /____
 / / __/ _ \/ __ \/ _ \/ ___/ / ___/  / /   / __ \/ __ `/  / __ `__ \/ _ \/ __/ __ \/ __ \/ __  / ___/
/ /_/ /  __/ / / /  __/ /  / / /__   / /___/ /_/ / /_/ /  / / / / / /  __/ /_/ / / / /_/ / /_/ (__  ) 
\____/\___/_/ /_/\___/_/  /_/\___/  /_____/\____/\__, /  /_/ /_/ /_/\___/\__/_/ /_/\____/\__,_/____/  
                                                /____/    
*/
    public isLoggedIn = (): boolean => {
        const loginMethod = getCookie(GOOGLE_ID_TOKEN);
        return !!loginMethod;
    }

    public loginSuccess = (creds: ILoginSuccess) => {
        this.login(creds);
    }

    public loginFail = () => {
        console.error('Failed to log in!');
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

}
