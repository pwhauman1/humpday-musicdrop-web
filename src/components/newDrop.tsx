import { Col, Row, Skeleton, Image, DatePicker, Typography, Input } from "antd";
import React from "react";
import { FLOW_STATES, IDrop, IMAGE_WIDTH } from "../Constants";
import FlowWrapper from "./flowWrapper";
import { Moment } from "moment";

const { Text } = Typography;

interface INewDropState {
    sendMoment: Moment | null,
    albumId?: string,
    drop?: IDrop,
    spotifyFlow: FLOW_STATES,
    canSubmit: boolean,
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
    const DropImage = () => getDropImage(state.spotifyFlow, state.drop?.imageUrl);
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
    const onChange = () => {
        console.log('Changing Album Id');
    }
    return (
        <Input placeholder={"Spotify URI"} onChange={onChange} />
    )
}

function getSendOnInput(setState: Function, moment: Moment | null): JSX.Element {

    // On Change, we update our state
    const onChange = (date: Moment | null, dateString: string) => {
        const sendDateKey = parseInt(dateString.replaceAll('-', ''));
        setState((previousState: INewDropState) => {
            const newState = { ...previousState };
            newState.sendMoment = date;
            if (newState.drop) {
                newState.drop.sendDateKey = sendDateKey;
                newState.canSubmit = true;
            }
            if(!date) newState.canSubmit = false;
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