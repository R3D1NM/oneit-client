import { Product } from "@/lib/types"
import { useEffect } from "react"
import Logo from '@/assets/oneit.png'
// import KakaoLogo from '@/assets/kakao.png'
import { Button } from "@/components/ui/button";
import { Share2Icon } from "lucide-react";

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

const KakaoShare = (props:KakaoShareProps) => {
    const {url, title, description, image} = props
    // const prodUrl = `https://www.oneit.gift/result/${chatID}`
    useEffect(() => {
        // console.log(Kakao);  
        // console.log(product);
        
        if(!Kakao.isInitialized()){
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }

    }, [])
    
    const handleShare = () =>{
        console.log(props);
        
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: title||"ONE!T 선물 추천",
                description: description||"선물 추천 결과",
                imageUrl: image||Logo,
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
            buttons: [
                {
                    title: '결과 확인하기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
            ],
        });
    }

    return (
    <Button variant="ghost" size="icon" onClick={handleShare} disabled={title===undefined}>
        <Share2Icon/>
    </Button>
  )
}

export default KakaoShare