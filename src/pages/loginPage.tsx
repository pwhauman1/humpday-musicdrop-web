import LoginModule, { ILoginSuccess } from "../modules/loginModule";
import { GoogleLogin } from 'react-google-login';

export default function LoginPage() {
    const loginModule = LoginModule.getInstance();
    return (
        <div>
            <h1>I am the Login Page</h1>
            <GoogleLogin
                clientId={loginModule.getGoogleClientId()}
                buttonText='Login with Google'
                onSuccess={loginModule.googleSuccess}
                onFailure={loginModule.googleFail}
                isSignedIn={true}
            />
        </div>
    );
}