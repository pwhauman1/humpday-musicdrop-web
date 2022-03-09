import { Col, Row, Skeleton, Image, DatePicker, Typography, Input, Button, Form } from "antd";
import React from "react";
import { FLOW_STATES, IDrop, IMAGE_WIDTH } from "../Constants";
import FlowWrapper from "./flowWrapper";
import { Moment } from "moment";
import { parseForSpotifyId, getRelaventSpotifyInformation, ISpotifyInfo } from "../modules/spotifyModule";

const { Text } = Typography;

interface INewDropState {
    sendMoment: Moment | null,
    sendDateKey?: number,
    albumId?: string,
    drop?: IDrop,
    spotifyFlow: FLOW_STATES,
    canSubmit: boolean,
    spotifyInfo?: ISpotifyInfo,
}

export default function NewDrop() {
    const [state, setState] = React.useState<INewDropState>({
        spotifyFlow: FLOW_STATES.NONE,
        canSubmit: false,
        sendMoment: null,
    });
    console.log('STATE:', state);
    const TopRow = () => getTopRow(state, setState);
    return <TopRow />;
}

function getTopRow(state: INewDropState, setState: Function) {
    const DropImage = () => getDropImage(state.spotifyFlow, state.spotifyInfo?.imageUrl);
    const SendOn = () => getSendOnInput(setState, state.sendMoment);
    const AlbumId = () => getAlbumIdInput(setState);
    return (
        <Row>
            <Col flex={IMAGE_WIDTH + 10 + "px"}>
                <DropImage />
            </Col>
            <Col flex='auto'>
                <p><Text strong>Send on:</Text> <SendOn /></p>
                <p><Text strong>Album Id:</Text> <AlbumId /></p>
            </Col>
        </Row>
    )
}

function getAlbumIdInput(setState: Function): JSX.Element {
    const onFill = (values: any) => {
        const albumIdFromForm = values.albumId;
        if (!albumIdFromForm) return; // TODO: something here maybe an error?
        const albumId = parseForSpotifyId(albumIdFromForm);
        // before we call the async spotify function, we first set our state to loading
        setState((previousState: INewDropState) => {
            console.log('Waiting for spotify to finish');
            const newState: INewDropState = {
                ...previousState,
                spotifyFlow: FLOW_STATES.LOADING,
            }
            return newState;
        });
        getRelaventSpotifyInformation(albumId)
            .then((spotifyInfo: ISpotifyInfo | undefined) => {
                console.log('Got Album Info From Spotify');
                setState((previousState: INewDropState) => {
                    const canSubmit = !!previousState.sendMoment && !!spotifyInfo
                    const newState: INewDropState = {
                        ...previousState,
                        albumId,
                        canSubmit,
                        spotifyFlow: FLOW_STATES.READY,
                    }
                    // if spotifyInfo isn't undefined, update our state
                    // if spotifyInfo is undefined and we have some in our previous state,
                    // delete it from our state
                    if (!!spotifyInfo) {
                        newState.spotifyInfo = spotifyInfo;
                    } else if (newState.spotifyInfo) {
                        delete newState.spotifyInfo;
                        newState.canSubmit = false;
                    }
                    return newState;
                });
            }).catch(err => {
                console.error(`Error when getting spotify info for ${albumId}\n${err.message}`);
                setState((previousState: INewDropState) => {
                    const newState: INewDropState = {
                        ...previousState,
                        spotifyFlow: FLOW_STATES.ERROR,
                    }
                    return newState;
                });
            })

        console.log('Changing Album Id', albumId);
    }
    return (
        <Form onFinish={onFill} layout="inline">
            <Form.Item label="album id" name="albumId">
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Fill
                </Button>
            </Form.Item>
        </Form>
    )
}

function getSendOnInput(setState: Function, moment: Moment | null): JSX.Element {

    // On Change, we update our state
    const onChange = (date: Moment | null, dateString: string) => {
        const sendDateKey = parseInt(dateString.replaceAll('-', ''));
        setState((previousState: INewDropState) => {
            const newState = { ...previousState };
            newState.sendMoment = date;
            newState.sendDateKey = sendDateKey;
            newState.canSubmit = !!newState.spotifyInfo && !!date;
            return newState;
        });
    }

    return (
        <DatePicker onChange={onChange} value={moment} />
    )
}

function getDropImage(flow: FLOW_STATES, url?: string): JSX.Element {
    const placeholder = <Skeleton.Image />
    const actual = url ? <Image width={IMAGE_WIDTH} src={url} /> : placeholder;
    return (
        <FlowWrapper
            flow={flow}
            readyChildren={actual}
            errorChildren={placeholder}
            noneChildren={placeholder}
        />
    )
}