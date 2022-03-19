import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import HomePage from "./homePage";
import UnsubPage from "./unsubPage";
import LoginPage from "./loginPage";
import AdminPage from "./adminPage";
import SpotifyCallbackPage from "./spotifyCallback";

export interface IRouterProps {
    isLoggedIn: boolean;
}

export default function Router(props: IRouterProps) {
    const { isLoggedIn } = props;
    return (
        <div>
            <BrowserRouter>
                {MyRoutes(isLoggedIn)}
            </BrowserRouter>
        </div>
    )
}

export function MyRoutes(isLoggedIn: boolean) {
    const adminWithNavigate = getAdminRoute(isLoggedIn);
    const loginWithNavigate = getLoginRoute(isLoggedIn);
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='unsubscribe' element={<UnsubPage />} />
            <Route path='login' element={loginWithNavigate} />
            <Route path='admin' element={adminWithNavigate} />
            <Route path='spotifyCallback' element={<SpotifyCallbackPage />} />
        </Routes>
    )
}

function getLoginRoute(isLoggedIn: boolean): JSX.Element {
    if(isLoggedIn) {
        return <Navigate to='/admin' />
    } else {
        return <LoginPage />;
    }
}

function getAdminRoute(isLoggedIn: boolean): JSX.Element {
    if (!isLoggedIn){
        return <Navigate to='/login' />;
    }
    return <AdminPage />
}
