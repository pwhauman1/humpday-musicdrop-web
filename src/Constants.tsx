import { ISpotifyInfo } from "./modules/spotifyModule";

export enum FLOW_STATES {
    READY,
    LOADING,
    ERROR,
    NONE,
}

export interface IDrop {
    sendDateKey: number,
    albumId: string,
    artist: string,
    imageUrl: string,
    albumName: string,
    spotifyUrl: string,
    favoriteSong?: string,
    favoriteLyric?: string,
    desc?: string,
}

// This state will be used to put a drop in our DDB
// and be used to toggle the submit button's disabled attribute
export interface ISubmitState {
    subjectives: ISubjectives,
    sendDateKey?: number,
    spotifyInfo?: ISpotifyInfo
}

interface ISubjectives {
    desc?: string,
    favoriteSong?: string,
    favoriteLyric?: string,
}

export function sendDateKeyToDate(sendDateKey: number): Date {
    const asString = '' + sendDateKey;
    const year = parseInt(asString.slice(0,4));
    // minus 1 to account for 0th indexing
    const month = parseInt(asString.slice(4,6)) - 1;
    const day = parseInt(asString.slice(6));
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);
    return date;
}

export function getBaseUrl(): string {
    if(window.location.href.includes('localhost')) return 'http://localhost:3000';
    else return 'https://humpdaymusicdrop.com'
}

export const EMAIL_REG_EXP = /^[^\s]*@[^\s]*\.[a-z]*$/;

export const IMAGE_WIDTH = 100;
export const CARD_WIDTH = 450;

export const SPOTIFY_DOMAIN = 'https://accounts.spotify.com/';
export const SPOTIFY_AUTH_PATH = 'authorize';
export const SPOTIFY_ACCESS_TOKEN_EXCHANGE_PATH = '/api/token';

export const MY_SPOTIFY_IMAGE = 'https://scontent-ort2-1.xx.fbcdn.net/v/t1.6435-1/101387759_2958093457610169_1345637687905746944_n.jpg?stp=dst-jpg_p320x320&_nc_cat=102&ccb=1-5&_nc_sid=0c64ff&_nc_ohc=EIazg7SmP14AX_EdZ0S&_nc_ht=scontent-ort2-1.xx&edm=AP4hL3IEAAAA&oh=00_AT8XT1obK4KE5LjXCEJ3vdn6k5jQ0TMu7WjigcuUC2nNxw&oe=6290F406'
export const TOP_PLAYLIST_LINK = 'https://open.spotify.com/playlist/0IL1wNfJEjE66GuUzpzESN?si=b07273eae17e48e6';
export const SPOTIFY_PROFILE_LINK = 'https://open.spotify.com/user/1274398011?si=49daa3df015849a8';