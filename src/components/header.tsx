import { Image } from "antd";
import { Link } from "react-router-dom";
import '../App.scss';
import { getBaseUrl } from "../Constants";

export default function Header() {
    const to = '/';
    return (
        <div className="footer horizontalCenter">
            <div className='horizontalCenter header'>
                <Link to={to}>
                    <Image
                        src={'./hmLogo.png'}
                        preview={false}
                    />
                </Link>
            </div>
        </div>
    )
}
