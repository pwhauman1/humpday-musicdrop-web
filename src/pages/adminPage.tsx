import LoginModule from "../modules/loginModule";
import DropsMonthDisplay from "../components/dropsMonthDisplay";
import NewDrop from "../components/newDrop";
import { Divider } from "antd";
import { GoogleLogout } from 'react-google-login';

export default function AdminPage() {
    const loginModule = LoginModule.getInstance();
    return (
        <div>
            <GoogleLogout 
                clientId={loginModule.getGoogleClientId()}
                buttonText='Logout'
                onLogoutSuccess={loginModule.googleLogout}
            />
            <NewDrop />
            <Divider />
            <DropsMonthDisplay />
        </div>
    );
}