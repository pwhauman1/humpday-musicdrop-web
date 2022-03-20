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

export function sendDateKeyToDate(sendDateKey: number): Date {
    const asString = '' + sendDateKey;
    const year = parseInt(asString.slice(0,4));
    const month = parseInt(asString.slice(4,6));
    const day = parseInt(asString.slice(6));
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month);
    date.setDate(day);
    return date;
}

export const IMAGE_WIDTH = 100;
export const CARD_WIDTH = 450;

export const SPOTIFY_DOMAIN = 'https://accounts.spotify.com/';
export const SPOTIFY_AUTH_PATH = 'authorize';
export const SPOTIFY_ACCESS_TOKEN_EXCHANGE_PATH = '/api/token';