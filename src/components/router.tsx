import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import HomePage from "./homePage";
import UnsubPage from "./unsubPage";
import LoginPage from "./loginPage";
import AdminPage from "./adminPage";

export interface IRouter {
    // todo
}

export default function Router(props: IRouter) {
    return (
        <div>
            <BrowserRouter>
                <MyRoutes />
            </BrowserRouter>
        </div>
    )
}

export function MyRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='unsubscribe' element={<UnsubPage />} />
            <Route path='login' element={<LoginPage />} />
            <Route path='admin' element={<AdminPage />} />
        </Routes>
    )
}

