import SpotifyWebApi from 'spotify-web-api-node';
import buildUrl from 'build-url';
import Url from 'url-parse';
import { setLoginCookie, getCookie, removeCookie } from './cookieMonster';
import { SPOTIFY_AUTH_PATH, SPOTIFY_DOMAIN } from '../Constants';
import { postSpotifyAccessToken } from './axiosModule';

const queryString = require('query-string');

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
const LOCAL_REDIRECT_URL = 'http://localhost:3000/spotifyCallback';
const PROD_REDIRECT_URL = 'https://humpdaymusicdrop.com/spotifyCallback';

const SPOTIFY_AUTH_TOKEN: string = 'SPOTIFY_AUTH_CODE';
const SPOTIFY_REFRESH_TOKEN: string = 'SPOTIFY_REFRESH_TOKEN';

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
    }

    public logout() {
        if (this.isLoggedIn()) {
            removeCookie(SPOTIFY_AUTH_TOKEN);
            removeCookie(SPOTIFY_REFRESH_TOKEN);
        }
    }

    public async initSpotify(): Promise<boolean> {
        const isLoggedInToSpotify = this.isLoggedIn();
        if (isLoggedInToSpotify) return true;
        const code = this.getCodeFromUrl();
        if (!code) {
            console.error('Spotify auth code not found in URL! Redirecting to home page.');
            return false;
        }
        const [authToken, refreshToken] = await this.exchangeCodeForAuthToken(code);
        if (refreshToken) {
            setLoginCookie(SPOTIFY_REFRESH_TOKEN, refreshToken);
        } else {
            console.error('Spotify Authorization Token Exchange didn\'t return a refresh token!')
        }
        if (authToken) {
            setLoginCookie(SPOTIFY_AUTH_TOKEN, authToken);
            return true;
        } else {
            console.error('Could not excahnge auth code for an Access Token! Redirecting to home page.');
            return false;
        }
    }

    public async exchangeCodeForAuthToken(code: string): Promise<(string | undefined)[]> {
        try {
            return await postSpotifyAccessToken(code, this.redirectUri);
        } catch (error) {
            console.error(error);
            return [undefined, undefined];
        }
    }

    public getCodeFromUrl(): string | undefined {
        const url = new Url(window.location.href);
        const queryParams = queryString.parse(url.query);
        return queryParams.code;
    }

    // Also need to check if the authCode is up to date
    public isLoggedIn() {
        const authToken = getCookie(SPOTIFY_AUTH_TOKEN);
        return !!authToken;
    }

    public navigateToSpotifyLogin() {
        const endpoint = this.getSpotifyAuthEndpoint(
            CLIENT_ID,
            'code',
            this.redirectUri
        );
        window.location.href = endpoint;
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

    public static getInstance(location?: string) {
        if (!location) location = window.location.href;
        if (!this.instance) this.instance = new SpotifyModule(location);
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