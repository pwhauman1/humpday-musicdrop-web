import axios, { AxiosResponse } from "axios";
import { urlJoin } from 'url-join-ts';
import { IDrop } from "../Constants";

const HDMD_API_ENDPOINT = 'https://icsaabaj5f.execute-api.us-west-2.amazonaws.com/prod';
const DROPS = 'drops';
const RECIPIENTS = 'recipients';
const DROPS_ENDPONINT = urlJoin(HDMD_API_ENDPOINT, DROPS);
const RECIPIENTS_ENDPONINT = urlJoin(HDMD_API_ENDPOINT, RECIPIENTS);

const SPOTIFY_ENDPOINT = 'https://accounts.spotify.com:443';
const AUTHORIZE = 'authorize';
const SPOTIFY_AUTH_ENDPOINT = urlJoin(SPOTIFY_ENDPOINT, AUTHORIZE);

export interface ILambdaResponse {
    infoMessage: string,
    [param: string]: any,
}

export async function getDrops(month: number, year: number): Promise<IDrop[]> {
    const response = await axios.get(DROPS_ENDPONINT, {
        headers: {},
        params: {
            month,
            year,
        }
    });
    const data = getResponseFromLambdaDataAsJson(response);
    if (!data) throw Error('Could not parse getDrops response!');
    return data.drops ? data.drops : [];
}

export async function getAuthorizeSpotify(
    clientId: string,
    responseType: string,
    redirectUri: string,
    // state?: string,
    // scope?: string[],
    // showDialog?: boolean,
): Promise<any> {
    const response = await axios.get(SPOTIFY_AUTH_ENDPOINT, {
        params: {
            'client_id': clientId,
            'response_type': responseType,
            'redirect_uri': redirectUri,
            // state,
            // scope,
            // 'show_dialog': showDialog,
        }
    });
    console.info('AUTH SPOT', response);
}

function getResponseFromLambdaDataAsJson(response: AxiosResponse): ILambdaResponse | undefined {
    if (!response?.data) {
        console.error('Axios response returned no data?');
        return undefined;
    }
    let data: any = response.data;
    if (!data?.content.infoMessage) {
        console.log('Axios data as no infoMessage');
    } else {
        console.log(`getResponseDataAsJson: ${data.content.infoMessage}`)
    }
    return {
        ...data.content,
    }
}