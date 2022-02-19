import LoginModule, { ILoginSuccess } from "../modules/loginModule";

export default function LoginPage() {
    const loginModule = LoginModule.getInstance();
    const creds: ILoginSuccess = {
        id_token: 'sometoken',
    }
    const onClick = () => {
        loginModule.loginSuccess(creds);
    }
    return (
        <div>
            <h1>I am the Login Page</h1>
            <button onClick={onClick}>Login</button>
        </div>
    );
}