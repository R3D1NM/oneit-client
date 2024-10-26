import {Product} from '@/lib/types';
import {useEffect} from 'react';
import Logo from '@/assets/images/oneit.png';
// import KakaoLogo from '@/assets/kakao.png'
import {Button} from '@/components/ui/button';
import {Share2Icon} from 'lucide-react';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Kakao: any;
    }
}
const {Kakao} = window;

interface KakaoShareProps {
    url: string;
    title: string;
    description: string;
    image: string;
}

const KakaoShare = (props: KakaoShareProps) => {
    const {url, title, description, image} = props;
    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
    }, []);

    const handleShare = () => {
        console.log(props);

        const payload = {
            objectType: 'feed',
            content: {
                title: title || 'ONE!T - 선물 추천 플랫폼',
                description: description || '',
                imageUrl: image || 'https://www.oneit.gift/oneit.png',
                link: {
                    mobileWebUrl: import.meta.env.VITE_CURRENT_DOMAIN + url,
                    webUrl: import.meta.env.VITE_CURRENT_DOMAIN + url,
                },
            },
            buttons: [
                {
                    title: 'ONE!T에서 확인하기',
                    link: {
                        mobileWebUrl: import.meta.env.VITE_CURRENT_DOMAIN + url,
                        webUrl: import.meta.env.VITE_CURRENT_DOMAIN + url,
                    },
                },
            ],
        };
        console.log(payload);

        Kakao.Share.sendDefault(payload);
    };

    return (
        <Button onClick={handleShare} disabled={title === undefined}>
            <Share2Icon />
        </Button>
    );
};

export default KakaoShare;
