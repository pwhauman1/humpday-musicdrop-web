import LoginModule from "../modules/loginModule";
import DropsMonthDisplay from "../components/dropsMonthDisplay";

export default function AdminPage() {
    const loginModule = LoginModule.getInstance();
    const onClick = () => {
        loginModule.logoutSuccess();
    }
    return (
        <div>
            <DropsMonthDisplay />
        </div>
    );
}