import { IDrop, sendDateKeyToDate, IMAGE_WIDTH, CARD_WIDTH } from "../Constants";
import { Card, Image, Row, Col, Typography } from "antd";

const { Text } = Typography;

export interface IDropCardProps extends IDrop { }
interface IDropsCardState extends IDrop { };

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
    return <div><Text strong>{header}:</Text> {content ? content : '---'}</div>;
}

function getTopRow(imgUrl: string, sendDateKey: number, albumId: string) {
    return (
        <Row>
            <Col flex={IMAGE_WIDTH + 10}>
                <Image width={IMAGE_WIDTH} src={imgUrl}/>
            </Col>
            <Col flex='auto'>
                <div>
                    <Text strong>Sending on:</Text> {sendDateKeyToDate(sendDateKey).toDateString()}
                </div>
                <div>
                    <Text strong>Album Id:</Text> {albumId}
                </div>
            </Col>
        </Row>
    )
}
