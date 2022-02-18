import LoginModule from "../modules/loginModule";

export default function AdminPage() {
    const loginModule = LoginModule.getInstance();
    const onClick = () => {
        loginModule.logoutSuccess();
    }
    return (
        <div>
            <h1>I am the Admin Page</h1>
            <button onClick={onClick}>Logout</button>
        </div>
    );
}