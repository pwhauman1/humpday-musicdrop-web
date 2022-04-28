import UnsubButton from "../components/unsubButton";
import '../App.scss';
import Header from '../components/header';
import ContentsFooter from '../components/contentsFooter';

export default function UnsubPage() {
    return (
        <div className='horizontalCenter page'>
            <Header />
            <div className='contents'>
                <h1> <em>Thanks for giving this a whirl!</em></h1>
                <p> You're welcome back anytime, don't forget to have a great day 😁 </p>
                <UnsubButton />
                <ContentsFooter />
            </div>
        </div>
    );
}
