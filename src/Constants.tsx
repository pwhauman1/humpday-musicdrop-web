export enum FLOW_STATES {
    READY,
    LODADING,
    ERROR,
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