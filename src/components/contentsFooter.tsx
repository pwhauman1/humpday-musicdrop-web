import { Avatar, Button, Divider, Space } from "antd";
import { MY_SPOTIFY_IMAGE, SPOTIFY_PROFILE_LINK } from "../Constants";
import '../App.scss';
import { getBaseUrl } from "../Constants";
import { urlJoin } from "url-join-ts";

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
    const to = urlJoin(getBaseUrl(), 'unsubscribe');
    return (
        <div>
            <Button 
                shape='round' 
                type='link'
                href={to}
            >
                Unsubscribe
            </Button>
        </div>
    )
}

function GoToHomePage() {
    const to = urlJoin(getBaseUrl());
    return (
        <div>
            <Button 
                shape='round' 
                type='link'
                href={to}
            >
                Home
            </Button>
        </div>
    )
}