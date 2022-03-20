import axios, { AxiosResponse } from "axios";
import { urlJoin } from 'url-join-ts';
import { IDrop, SPOTIFY_ACCESS_TOKEN_EXCHANGE_PATH, SPOTIFY_DOMAIN } from "../Constants";
import { Buffer } from 'buffer';

const queryString = require('query-string');

const HDMD_API_ENDPOINT = 'https://icsaabaj5f.execute-api.us-west-2.amazonaws.com/prod';
const DROPS = 'drops';
const RECIPIENTS = 'recipients';
const DROPS_ENDPONINT = urlJoin(HDMD_API_ENDPOINT, DROPS);
const RECIPIENTS_ENDPONINT = urlJoin(HDMD_API_ENDPOINT, RECIPIENTS);

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

// exchanges the code for the access token. this access token can be used 
// to call the spotify API
export async function postSpotifyAccessToken(authCode: string, redirectUri: string): Promise<(string | undefined)[]> {
    const endpoint = urlJoin(SPOTIFY_DOMAIN, SPOTIFY_ACCESS_TOKEN_EXCHANGE_PATH);
    const body = {
        'grant_type': 'authorization_code',
        'code': authCode,
        'redirect_uri': redirectUri,
    };
    const urlEncodedBody = queryString.stringify(body);
    // this is bad, will move this method to AWS Lambda
    const base64Auth = Buffer.from('550a7c4f41d4465a859f4fa6f302d05d:5e31ce4c04e5421cb38d7eb0785b12b7');
    const headers = {
        'Authorization': `Basic ${base64Auth.toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await axios.post(endpoint, urlEncodedBody, {
        headers
    });
    const accessToken = response?.data?.access_token;
    const refreshToken = response?.data?.refresh_token;
    return [accessToken, refreshToken];
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