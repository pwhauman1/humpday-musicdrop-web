import { IDrop, sendDateKeyToDate } from "../Constants";
import { Card, Image, Row, Col, Typography } from "antd";

const { Text } = Typography;

export interface IDropCardProps extends IDrop { }
interface IDropsCardState extends IDrop { };
const IMAGE_WIDTH = 100;
const CARD_WIDTH = 450;

export default function DropCard(props: IDropCardProps) {
    const TopRow = () => getTopRow(props.imageUrl, props.sendDateKey, props.albumId);
    const Content = () => getContent(props);
    return (
        <div>
            <Card style={{ width: CARD_WIDTH }}>
                <TopRow />
                <Content />
            </Card>
        </div>
    );
}

function getContent(props: IDropCardProps) {
    return (
        <div>
            {getParagraphLine('Artist', props.artist)}
            {getParagraphLine('Album', props.albumName)}
            {getParagraphLine('Desc', props.desc)}
            {getParagraphLine('Fav Song', props.favoriteSong)}
            {getParagraphLine('Fav Lyric', props.favoriteLyric)}
        </div>
    );
}

function getParagraphLine(header: string, content: string | undefined): JSX.Element {
    return <p><Text strong>{header}:</Text> {content ? content : '---'}</p>;
}

function getTopRow(imgUrl: string, sendDateKey: number, albumId: string) {
    return (
        <Row>
            <Col flex={IMAGE_WIDTH + 10}>
                <Image width={IMAGE_WIDTH} src={imgUrl}/>
            </Col>
            <Col flex='auto'>
                <p><Text strong>Sending on:</Text> {sendDateKeyToDate(sendDateKey).toDateString()}</p>
                <p><Text strong>Album Id:</Text> {albumId}</p>
            </Col>
        </Row>
    )
}
