import { Image } from "antd";
import '../App.scss';
import { getBaseUrl } from "../Constants";

export default function Header() {

    return (
        <div className="footer horizontalCenter">
            <div className='horizontalCenter header'>
                <a href={getBaseUrl()}>
                    <Image
                        src={'./hmLogo.png'}
                        preview={false}
                    />
                </a>
            </div>
        </div>
    )
}
