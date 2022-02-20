import { Col, Row, Skeleton, Image, DatePicker, Typography, Input } from "antd";
import React from "react";
import { FLOW_STATES, IDrop, IMAGE_WIDTH } from "../Constants";
import FlowWrapper from "./flowWrapper";

const { Text } = Typography;

interface INewDropState {
    sendDateKey?: number,
    albumId?: string,
    drop?: IDrop,
    spotifyFlow: FLOW_STATES,
    canSubmit: boolean,
}

export default function NewDrop() {
    const [state, setState] = React.useState<INewDropState>({
        spotifyFlow: FLOW_STATES.NONE,
        canSubmit: false,
    });
    const TopRow = () => getTopRow(state, setState);
    return <TopRow />;
}

function getTopRow(state: INewDropState, setState: Function) {
    const DropImage = () => getDropImage(state.spotifyFlow, state.drop?.imageUrl);
    const SendOn = () => getSendOn(setState);
    const AlbumId = () => getAlbumId(setState);
    return (
        <Row>
            <Col flex={IMAGE_WIDTH + 10 + "px"}>
                <DropImage />
            </Col>
            <Col flex='auto'>
                <p><Text strong>Sending on:</Text> <SendOn /></p>
                <p><Text strong>Album Id:</Text> <AlbumId /></p>
            </Col>
        </Row>
    )
}

function getAlbumId(setState: Function) {
    const onChange = () => {
        console.log('Changing Album Id');
    }
    return (
        <Input placeholder={"Spotify URI"} onChange={onChange} />
    )
}

function getSendOn(setState: Function) {
    const onChange = (date: any, dateString: string) => {
        console.log('Setting Send On');
        console.log(date, dateString);
    }
    return (
        <DatePicker onChange={onChange} />
    )
}

function getDropImage(flow: FLOW_STATES, url?: string) {
    const placeholder = <Skeleton.Image />
    const actual = url ? <Image width={IMAGE_WIDTH} src={url}/> : placeholder;
    return(
        <FlowWrapper 
            flow={flow}
            readyChildren={actual}
            errorChildren={placeholder}
            noneChildren={placeholder}
        />
    )
}