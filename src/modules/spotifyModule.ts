import SpotifyWebApi from 'spotify-web-api-node';
import buildUrl from 'build-url';

export interface ISong {
    songId: string,
    name: string
}

export interface ISpotifyInfo {
    albumId: string,
    albumName: string,
    artist: string,
    imageUrl: string,
    spotifyUrl: string,
    songs: ISong[],
}

const CLIENT_ID = '550a7c4f41d4465a859f4fa6f302d05d';
const LOCAL_REDIRECT_URL = 'http://localhost:3000/admin';
const PROD_REDIRECT_URL = 'https://humpdaymusicdrop.com/admin';

const SPOTIFY_DOMAIN = 'https://accounts.spotify.com/';
const SPOTIFY_AUTH_PATH = 'authorize';

export class SpotifyModule {
    private static instance: SpotifyModule;

    private redirectUri: string;
    private spotifyApi: SpotifyWebApi;

    private constructor(location: string) {
        this.redirectUri = location.includes('localhost') ? LOCAL_REDIRECT_URL : PROD_REDIRECT_URL;
        this.spotifyApi = new SpotifyWebApi({
            clientId: CLIENT_ID,
            redirectUri: this.redirectUri
        });
        const spotifyAuthEndpoint = this.getSpotifyAuthEndpoint(
            CLIENT_ID,
            'code',
            this.redirectUri
        );
        console.log(spotifyAuthEndpoint);
    }

    private getSpotifyAuthEndpoint(
        clientId: string,
        responseType: string,
        redirectUri: string,
    ): string {
        return buildUrl(SPOTIFY_DOMAIN, {
            path: SPOTIFY_AUTH_PATH,
            queryParams: {
                'client_id': clientId,
                'response_type': responseType,
                'redirect_uri': redirectUri,
            }
        })
    }

    public static getInstance(location:string) {
        if(!this.instance) this.instance = new SpotifyModule(location);
        return this.instance;
    }

    public parseForSpotifyId(str: string): string {
        // expecting something like:
        // 'https://open.spotify.com/album/6WrxgVbi9Q96gV8tZMq3FH?si=wcwPE8UNSeCbRUT6iJIggw'
        const regexp = /^https:\/\/open\.spotify\.com\/[a-z]*\/(\S*)\?si=.*$/;
        const match = str.match(regexp);
        if (match) return match[1];
        return str;
    }

}

export async function getRelaventSpotifyInformation(albumId: string): Promise<ISpotifyInfo | undefined> {
    // await sleep(1000);
    if (albumId === 'test' || albumId === '7G7lPTcJta35qGZ8LMIJ4y') {
        return {
            albumId: '7G7lPTcJta35qGZ8LMIJ4y',
            albumName: 'Any Shape You Take',
            artist: 'Indigo De Souza',
            imageUrl: 'https://i.scdn.co/image/ab67616d0000b2738be26b6c162ff72ca4666ba6',
            spotifyUrl: 'https://open.spotify.com/album/7G7lPTcJta35qGZ8LMIJ4y?si=_Fydit5YR8GAk_cVZ8TbdQ',
            songs: [
                { songId: '1yrJuYAIcCH9oNS9T0QJPt', name: '17' },
                { songId: '4rKfScq2VOValQKH3YovZy', name: 'Darker Than Death' },
            ]
        }
    }
    return undefined;
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}