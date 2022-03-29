import SpotifyWebApi from 'spotify-web-api-node';
import buildUrl from 'build-url';
import Url from 'url-parse';
import { setLoginCookie, getCookie, removeCookie } from './cookieMonster';
import { SPOTIFY_AUTH_PATH, SPOTIFY_DOMAIN } from '../Constants';
import { postSpotifyAccessToken } from './axiosModule';
import { urlJoin } from 'url-join-ts';

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

interface IGetAlbumResponse {
    body: {
        artists?: {
            name?: string,
        }[],
        images: {
            url: string,
            height: number,
        }[],
        id: string,
        name: string,
        tracks?: {
            items?: {
                name?: string,
                id?: string
            }[],
        }
    }
}

const CLIENT_ID = '550a7c4f41d4465a859f4fa6f302d05d';
const LOCAL_REDIRECT_URL = 'http://localhost:3000/spotifyCallback';
const PROD_REDIRECT_URL = 'https://humpdaymusicdrop.com/spotifyCallback';
const SPOTIFY_OPEN_ALBUM_BASE_URL = 'https://open.spotify.com/album';

export const SPOTIFY_AUTH_TOKEN: string = 'SPOTIFY_AUTH_CODE';
export const SPOTIFY_REFRESH_TOKEN: string = 'SPOTIFY_REFRESH_TOKEN';

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
            this.spotifyApi.setAccessToken(authToken);
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

    public async getRelaventSpotifyInformation(albumId: string): Promise<ISpotifyInfo | undefined> {
        try {
            const resp: IGetAlbumResponse = await this.spotifyApi.getAlbum(albumId) as IGetAlbumResponse;
            return this.getAlbumResponseToSpotifyInfo(resp)
        } catch (error) {
            console.error(error);
        }
        return undefined;
    }

    private getAlbumResponseToSpotifyInfo(resp: IGetAlbumResponse): ISpotifyInfo | undefined {
        // type declaring to any so we can incrementally add things to the 
        // real response value
        if (!resp.body) return undefined;

        const albumName = resp.body.name;

        let albumId = resp.body.id;

        // if multiple artists, 
        let artist: string | undefined;
        const spotArtists = resp.body.artists;
        // this ensures that names is an array of strings, not undefiend
        const names = spotArtists?.map(e => e.name).filter(e => !!e);
        if (names?.length) {
            artist = names[0];
            names.forEach((name, i) => {
                if (i === 0) return;
                artist += ` and ${name}`;
            });
        } else {
            return undefined;
        }
        if(!artist) return undefined;

        const spotifyUrl = urlJoin(SPOTIFY_OPEN_ALBUM_BASE_URL, resp.body.id);

        // largest image first according to API doc
        const imageUrl = resp.body.images[0].url;

        let songs: ISong[];
        let tracks = resp.body.tracks?.items?.filter(e => !!e.name && !!e.id);
        if (tracks?.length) {
            songs = tracks.map(e => {
                return { songId: e.id, name: e.name }
            }) as ISong[]; // need to cast because TS doesn't pick up the typecheck filter
        } else {
            return undefined
        }

        return {
            albumId,
            albumName,
            artist,
            imageUrl,
            spotifyUrl,
            songs,
        }
    }

}
