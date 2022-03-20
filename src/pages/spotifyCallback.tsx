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

    // upon render of this page, initalize our spotify module.
    // If successful, set the redirect which will rerender the page
    // with the proper Navigate JSX element
    useEffect(() => {
        const spotifyMod = SpotifyModule.getInstance();
        spotifyMod.initSpotify().then((isSpotifyReady: boolean) => {
            if(isSpotifyReady) setRedirectTo(REDIRECTS.ADMIN);
            else setRedirectTo(REDIRECTS.HOME);
        });
    }, []);

    // Depending on if we successfully initalize the spotify module, route to the next page
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