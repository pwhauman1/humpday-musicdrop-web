import { Image, Typography } from 'antd';
import { getBaseUrl } from "../Constants";
import UnsubButton from "../components/unsubButton";

const { Title, Text } = Typography;

export default function UnsubPage() {
    return (
        <div>
            <HomePageImage />
            <Title level={2}> Thanks for being interested in my music!</Title>
            <Text> You're welcome back anytime, don't forget to have a great day 😁 </Text>
            <UnsubButton />
        </div>
    );
}

function HomePageImage() {
    return (
        <a href={getBaseUrl()}>
            <Image
                src={'./hmLogo.png'}
                preview={false} />
        </a>
    )
}