import { Col, Row, Skeleton, Image, DatePicker, Typography, Input, Button, Form, Select } from "antd";
import React from "react";
import { FLOW_STATES, IDrop, IMAGE_WIDTH } from "../Constants";
import FlowWrapper from "./flowWrapper";
import { Moment } from "moment";
import { parseForSpotifyId, getRelaventSpotifyInformation, ISpotifyInfo, ISong } from "../modules/spotifyModule";
import TextArea from "antd/lib/input/TextArea";

const { Text } = Typography;

interface ISubjectives {
    desc?: string,
    favoriteSong?: string,
    favoriteLyric?: string,
}

interface INewDropState {
    sendMoment: Moment | null,
    sendDateKey?: number,
    albumId?: string,
    drop?: IDrop,
    spotifyFlow: FLOW_STATES,
    canSubmit: boolean,
    spotifyInfo?: ISpotifyInfo,
    subjectives: ISubjectives
}

export default function NewDrop() {
    const [state, setState] = React.useState<INewDropState>({
        spotifyFlow: FLOW_STATES.NONE,
        canSubmit: false,
        sendMoment: null,
        subjectives: {},
    });
    console.info('STATE:', state);
    const TopRow = () => getTopRow(state, setState);
    const Body = () => getBody(state, setState);
    return (
        <div>
            <TopRow />
            <Body />
        </div>
    )
}

function getDisabledKeyVal(key: string, value: string | undefined) { 
    return (
        <div>
            <Text strong>{key}:</Text>
            <Input placeholder={value} disabled/>
        </div>
    )
}

function getDesc(setState: Function, currValue: string | undefined) {
    const onChange = (val: any) => {
        const desc = val.target.value;
        setState((prev: INewDropState) => {
            const newState = {
                ...prev,
            };
            newState.subjectives.desc = desc;
            return newState;
        });
    }
    return (
        <div>
            <TextArea 
                placeholder='Album Description'
                autoSize={{maxRows:4}} 
                onChange={onChange}
                value={currValue}
            />
        </div>
    )
}

function getFavLyric(setState: Function, currValue: string | undefined) {
    const onChange = (val: any) => {
        const favoriteLyric = val.target.value;
        setState((prev: INewDropState) => {
            const newState = {
                ...prev,
            };
            newState.subjectives.favoriteLyric = favoriteLyric;
            return newState;
        });
    }
    return (
        <div>
            <TextArea 
                placeholder='Favorite Lyric'
                autoSize={{maxRows:4}} 
                onChange={onChange}
                value={currValue}
            />
        </div>
    )
}

function getSongs(songs: ISong[], setState: Function, currSelected: string | undefined) {
    const onChange = (val: string) => {
        setState((prev: INewDropState) => {
            const newState = {
                ...prev,
            };
            newState.subjectives.favoriteSong = val;
            return newState;
        });
    }
    const { Option } = Select;
    const options: JSX.Element[] = [];
    songs.forEach(val => {
        options.push(<Option key={val.songId} value={val.name}>{val.name}</Option>)
    });
    return (
        <div>
            <Select 
                placeholder='Select a song'
                onChange={onChange}
                allowClear
                value={currSelected}
            >
                {options}
            </Select>
        </div>
    )
}

function getBody(state: INewDropState, setState: Function) {
    const placeholderString = state.albumId ? 'Set an album id above :D'
        : `Invalid Album ID: ${state.albumId}`;
    const placeholder: JSX.Element = <p>{placeholderString}</p>;
    const spotifyInfo = state.spotifyInfo;
    let dropsKeyValPairs: JSX.Element;
    if(spotifyInfo) {
        dropsKeyValPairs = <div>
            {getDisabledKeyVal('Album', spotifyInfo.albumName)}
            {getDisabledKeyVal('Artist', spotifyInfo.artist)}
            {getDesc(setState, state.subjectives.desc)}
            {getSongs(spotifyInfo.songs, setState, state.subjectives.favoriteSong)}
            {getFavLyric(setState, state.subjectives.favoriteLyric)}
        </div>
    } else {
        dropsKeyValPairs = placeholder;
    }

    return (
        <div>
            <FlowWrapper
                flow={state.spotifyFlow}
                readyChildren={dropsKeyValPairs}
                errorChildren={placeholder}
                noneChildren={placeholder}
            />
        </div>
    )
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
            console.info('Waiting for spotify to finish');
            const newState: INewDropState = {
                ...previousState,
                spotifyFlow: FLOW_STATES.LOADING,
            }
            return newState;
        });
        getRelaventSpotifyInformation(albumId)
            .then((spotifyInfo: ISpotifyInfo | undefined) => {
                console.info('Got Album Info From Spotify');
                setState((previousState: INewDropState) => {
                    const canSubmit = !!previousState.sendMoment && !!spotifyInfo
                    const newState: INewDropState = {
                        ...previousState,
                        albumId,
                        canSubmit,
                    }
                    // if spotifyInfo isn't undefined, update our state
                    // if spotifyInfo is undefined, delete it from our state 
                    // and set spotify flow to none
                    if (!!spotifyInfo) {
                        newState.spotifyInfo = spotifyInfo;
                        newState.spotifyFlow = FLOW_STATES.READY;
                    } else {
                        delete newState.spotifyInfo;
                        newState.spotifyFlow = FLOW_STATES.NONE;
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

        console.info('Changing Album Id', albumId);
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