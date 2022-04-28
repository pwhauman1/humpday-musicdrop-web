import { Avatar, Button, Divider, Space } from "antd";
import { MY_SPOTIFY_IMAGE, SPOTIFY_PROFILE_LINK } from "../Constants";
import '../App.scss';
import { getBaseUrl } from "../Constants";
import { urlJoin } from "url-join-ts";
import { Link } from "react-router-dom";

export default function ContentsFooter() {

    return (
        <div className="footer horizontalCenter">
            <Divider />
            <Space wrap size='small'>
                <GoToHomePage />
                <GoToUnsubscribePage />
                <FollowMeSpotifyButton />
            </Space>
        </div>
    )
}

function FollowMeSpotifyButton() {
    return (
        <div>
            <Button
                shape='round'
                type='link'
                icon={<Avatar size='small' src={MY_SPOTIFY_IMAGE} />}
                href={SPOTIFY_PROFILE_LINK}
                target='_blank'
            >
                Follow Me On Spotify
            </Button>
        </div>
    );
}

function GoToUnsubscribePage() {
    const to = '/unsubscribe';
    return (
        <div>
            <Link to={to}>
                <Button
                    shape='round'
                    type='link'
                >
                    Unsubscribe
                </Button>
            </Link>
        </div>
    )
}

function GoToHomePage() {
    const to = '/';
    return (
        <div>
            <Link to={to}>
                <Button
                    shape='round'
                    type='link'
                >
                    Home
                </Button>
            </Link>
        </div>
    )
}