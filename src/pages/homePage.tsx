import { Image, Typography } from 'antd';
import SubscribeButton from '../components/subscribeButton';
import '../App.scss';

const { Title, Text } = Typography;

export default function HomePage() {
    return (
        <div className='homePage horizontalCenter'>
            <div className='horizontalCenter header'>
                <Image
                    src={'./hmLogo.png'}
                    preview={false}
                />
            </div>
            <div className='contents'>
                <Title level={2}> Hi There!</Title>
                <Text>
                    What's up, I'm Peter. I'm a software engineer who really likes music 😁 and loves
                    sharing it. Every hump day, get a new album to listen to (picked by me!). Some
                    are personal favorites, some are new things I'm listening to, some are just
                    albums that deserve a little more attention. Interested? Sign up!
                </Text>
                <br />
                <Text>
                    My qualifications:
                </Text>
                <ul>
                    <li>Top 1% of Spotify users 2021</li>
                    <li>Has a record player (no, not the cheap bluetooth one)</li>
                    <li>Doesn't simp for Anthony Fantano</li>
                    <li>Has a playlists with 9 likes</li>
                    <li>Followed by a random person on Spotify</li>
                    <li>Never had a tamagotchi</li>
                </ul>
                <SubscribeButton />
            </div>
        </div>
    );
}
