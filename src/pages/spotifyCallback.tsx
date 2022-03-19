import {
    Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react"
import { SpotifyModule } from "../modules/spotifyModule";

const enum REDIRECTS {
    HOME,
    ADMIN,
}

export default function SpotifyCallbackPage() {
    const [redirectTo, setRedirectTo] = useState<REDIRECTS | undefined>(undefined);
    useEffect(() => {
        const spotifyMod = SpotifyModule.getInstance();
        const code = spotifyMod.initSpotify();
        if(code) setRedirectTo(REDIRECTS.ADMIN);
        else setRedirectTo(REDIRECTS.HOME);
    }, []);
    let redirect = null;
    if(redirectTo === REDIRECTS.ADMIN) redirect = <Navigate to='/admin' />;
    if(redirectTo === REDIRECTS.HOME) redirect = <Navigate to='/' />;
    return(<div>
        <p>
            Please wait to be redirected.
        </p>
        {redirect}
    </div>)
}