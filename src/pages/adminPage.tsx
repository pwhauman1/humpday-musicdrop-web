import LoginModule from "../modules/loginModule";
import DropsMonthDisplay from "../components/dropsMonthDisplay";
import NewDrop from "../components/newDrop";
import { Divider } from "antd";

export default function AdminPage() {
    const loginModule = LoginModule.getInstance();
    const onClick = () => {
        loginModule.logoutSuccess();
    }
    return (
        <div>
            <NewDrop />
            <Divider />
            <DropsMonthDisplay />
        </div>
    );
}