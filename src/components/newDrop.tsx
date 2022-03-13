import { Col, Row, Skeleton, Image, DatePicker, Typography, Input, Button, Form, Select } from "antd";
import React from "react";
import { FLOW_STATES, IMAGE_WIDTH } from "../Constants";
import FlowWrapper from "./flowWrapper";
import { Moment } from "moment";
import { getRelaventSpotifyInformation, ISpotifyInfo, ISong, SpotifyModule } from "../modules/spotifyModule";
import TextArea from "antd/lib/input/TextArea";

const { Text } = Typography;

interface ISubjectives {
    desc?: string,
    favoriteSong?: string,
    favoriteLyric?: string,
}

// This is what will cause the NewDrop info area to rerender
interface INewDropState {
    albumId?: string,
    spotifyFlow: FLOW_STATES,
    spotifyInfo?: ISpotifyInfo,
}

// This state will be used to put a drop in our DDB
// and be used to toggle the submit button's disabled attribute
interface ISubmitState {
    subjectives: ISubjectives,
    sendDateKey?: number,
    spotifyInfo?: ISpotifyInfo
}

let setSubmitState: Function;

export default function NewDrop() {
    const [state, setState] = React.useState<INewDropState>({
        spotifyFlow: FLOW_STATES.NONE,
    });
    const TopRow = () => getTopRow(state, setState);
    const Body = () => getBody(state);
    return (
        <div>
            <TopRow />
            <Body />
            <SubmitButton />
        </div>
    )
}

function SubmitButton() {
    const [state, setState] = React.useState<ISubmitState>({
        subjectives: {}
    });
    setSubmitState = setState;
    // on submit, do something with the state
    const canSubmit = !!state.spotifyInfo && !!state.sendDateKey;
    const onClick = () => {
        console.info('SUBMITTED!', state);
    }
    return (
        <div>
            <Button
                disabled={!canSubmit}
                onClick={onClick}
            >
                Submit!
            </Button>
        </div>
    )
}

// to reduce duplicate code for getting the artist and album
// fields
function getDisabledKeyVal(key: string, value: string | undefined) {
    return (
        <div>
            <Row>
                <Col>
                    <Text strong>{key}: </Text>
                </Col>
                <Col>
                    <Input placeholder={value} disabled />
                </Col>
            </Row>
        </div>
    )
}

function getDesc() {
    const onChange = (val: any) => {
        const desc = val.target.value;
        setSubmitState((prev: ISubmitState) => {
            const curr = { ...prev };
            curr.subjectives.desc = desc;
            return curr;
        });
    }
    return (
        <div>
            <Row>
                <Col>
                    <Text strong>Description: </Text>
                </Col>
                <Col>
                    <TextArea
                        placeholder='Album Description'
                        autoSize={{ maxRows: 4 }}
                        onChange={onChange}
                    />
                </Col>
            </Row>
        </div>
    )
}

function getFavLyric() {
    const onChange = (val: any) => {
        const favoriteLyric = val.target.value;
        setSubmitState((prev: ISubmitState) => {
            const curr = { ...prev };
            curr.subjectives.favoriteLyric = favoriteLyric;
            return curr;
        });
    }
    return (
        <div>
            <Row>
                <Col>
                    <Text strong>Lyric: </Text>
                </Col>
                <Col>
                    <TextArea
                        placeholder='Favorite Lyric'
                        autoSize={{ maxRows: 4 }}
                        onChange={onChange}
                    />
                </Col>
            </Row>
        </div>
    )
}

function getSongs(songs: ISong[]) {
    const onChange = (val: string) => {
        setSubmitState((prev: ISubmitState) => {
            const curr = { ...prev };
            curr.subjectives.favoriteSong = val;
            return curr;
        });
    }
    const { Option } = Select;
    const options: JSX.Element[] = [];
    songs.forEach(val => {
        options.push(<Option key={val.songId} value={val.name}>{val.name}</Option>)
    });
    return (
        <div>
            <Row>
                <Col>
                    <Text strong>Song: </Text>
                </Col>
                <Col>
                    <Select
                        placeholder='Select a song'
                        onChange={onChange}
                        allowClear
                    >
                        {options}
                    </Select>
                </Col>
            </Row>

        </div>
    )
}

function getBody(state: INewDropState) {
    const placeholderString = state.albumId ? 'Set an album id above :D' : `Invalid Album ID: ${state.albumId}`;
    const placeholder: JSX.Element = <p>{placeholderString}</p>;
    const spotifyInfo = state.spotifyInfo;
    let dropsKeyValPairs: JSX.Element;
    if (spotifyInfo) {
        dropsKeyValPairs = <div>
            {getDisabledKeyVal('Album', spotifyInfo.albumName)}
            {getDisabledKeyVal('Artist', spotifyInfo.artist)}
            {getDesc()}
            {getSongs(spotifyInfo.songs)}
            {getFavLyric()}
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
    const SendOn = () => getSendOnInput();
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
    // OnFill will initiate the spotify fetch
    const onFill = (values: any) => {
        const albumIdFromForm = values.albumId;
        if (!albumIdFromForm) return; // TODO: something here maybe an error?
        // before we call the async spotify function, we first set our state to loading
        setState((previousState: INewDropState) => {
            const newState: INewDropState = {
                ...previousState,
                spotifyFlow: FLOW_STATES.LOADING,
            }
            return newState;
        });
        const spotifyMod = SpotifyModule.getInstance(window.location.href);
        const albumId = spotifyMod.parseForSpotifyId(albumIdFromForm);
        getRelaventSpotifyInformation(albumId)
            .then((spotifyInfo: ISpotifyInfo | undefined) => {
                // Update the submit state with our spotify info
                setSubmitState((prev: ISubmitState) => {
                    const curr = { ...prev }
                    curr.spotifyInfo = spotifyInfo;
                    return curr;
                });
                // update the state of our body
                setState((previousState: INewDropState) => {
                    const newState: INewDropState = {
                        ...previousState,
                        albumId,
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
                // rid spotifyInfo from submitState
                setSubmitState((prev: ISubmitState) => {
                    const curr = { ...prev };
                    delete curr.spotifyInfo;
                    return curr;
                });
                // update our spotify flow to ERROR
                setState((previousState: INewDropState) => {
                    const newState: INewDropState = {
                        ...previousState,
                        spotifyFlow: FLOW_STATES.ERROR,
                    }
                    return newState;
                });
            });
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

function getSendOnInput(): JSX.Element {
    // On Change, we update our state
    const onChange = (_: Moment | null, dateString: string) => {
        const sendDateKey = parseInt(dateString.replaceAll('-', ''));
        setSubmitState((prev: ISubmitState) => {
            const curr = { ...prev };
            curr.sendDateKey = sendDateKey;
            return curr;
        });
    }

    return (
        <DatePicker onChange={onChange} />
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