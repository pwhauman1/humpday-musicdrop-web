import SubscribeButton from '../components/subscribeButton';
import '../App.scss';
import ContentsFooter from '../components/contentsFooter';
import { TOP_PLAYLIST_LINK } from '../Constants';
import Header from '../components/header';

export default function HomePage() {
    return (
        <div className='page horizontalCenter'>
            <Header />
            <div className='contents'>
                <h1><em> Hi There! </em></h1>
                <p>
                    What's up, I'm Peter. I'm a software engineer who really likes music 😁 and loves
                    sharing it. Every hump day, get a new album to listen to (picked by me!). Some
                    are personal favorites, some are new things I'm listening to, some are just
                    albums that deserve a little more attention. Interested? Sign up!
                </p>
                <br />
                <p>
                    My qualifications:
                </p>
                <ul>
                    <li>Top 1% of Spotify users 2021</li>
                    <li>Has a record player (no, not the cheap bluetooth one)</li>
                    <li>Doesn't simp for Anthony Fantano</li>
                    <li>Has a <PlaylistLink text='playlists with 9 likes'/></li>
                    <li>Followed by a random person on Spotify</li>
                    <li>Never had a tamagotchi</li>
                </ul>
                <SubscribeButton />
                <ContentsFooter />
            </div>
        </div>
    );
}

function PlaylistLink(props: {text: string}) {
    const { text } = props;
    return(
        <a href={TOP_PLAYLIST_LINK} target='_blank'>
            {text}
        </a>
    )
}
