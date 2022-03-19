import LoginModule from "../modules/loginModule";
import DropsMonthDisplay from "../components/dropsMonthDisplay";
import NewDrop from "../components/newDrop";
import { Divider } from "antd";
import { GoogleLogout } from 'react-google-login';
import { useEffect } from "react";
import { SpotifyModule } from "../modules/spotifyModule";

export default function AdminPage() {
    const loginModule = LoginModule.getInstance();
    useEffect(() => {
        const spotifyMod = SpotifyModule.getInstance();
        if (!spotifyMod.isLoggedIn()) spotifyMod.navigateToSpotifyLogin();
    }, []);
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