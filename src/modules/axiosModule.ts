import axios, { AxiosResponse } from "axios";
import { urlJoin } from 'url-join-ts';
import { IDrop } from "../Constants";

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
    const data = getResponseDataAsJson(response);
    if (!data) throw Error('Could not parse getDrops response!');
    return data.drops ? data.drops : [];
}

function getResponseDataAsJson(response: AxiosResponse): ILambdaResponse | undefined {
    if (!response?.data) {
        console.error('Axios response returned no data?');
        return undefined;
    }
    let data: any = response.data;
    if (!data?.content.infoMessage) {
        console.log('Axios data as no infoMessage');
    } else {
        console.log(data.content.infoMessage)
    }
    return {
        ...data.content,
    }
}