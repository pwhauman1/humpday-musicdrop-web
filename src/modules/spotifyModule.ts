export function parseForSpotifyId(str: string): string {
    // expecting something like:
    // 'https://open.spotify.com/album/6WrxgVbi9Q96gV8tZMq3FH?si=wcwPE8UNSeCbRUT6iJIggw'
    const regexp = /^https:\/\/open\.spotify\.com\/[a-z]*\/(\S*)\?si=.*$/;
    const match = str.match(regexp);
    if (match) return match[1];
    return str;
}

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

export async function getRelaventSpotifyInformation(albumId: string): Promise<ISpotifyInfo | undefined> {
    await sleep(1000);
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