import { Product } from "@/config/types"
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

const KakaoShare = (props:{chatID:string|undefined, product: Product|undefined}) => {
    const {chatID, product} = props
    const prodUrl = `https://www.oneit.gift/result/${chatID}`
    useEffect(() => {
        // console.log(Kakao);  
        // console.log(product);
        
        if(!Kakao.isInitialized()){
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }

    }, [])
    
    const handleShare = () =>{
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: 'One!t 선물 추천 결과',
                description: product?.title||"선물 추천 결과",
                imageUrl: product?.image||Logo,
                link: {
                    mobileWebUrl: prodUrl,
                    webUrl: prodUrl,
                },
            },
            buttons: [
                {
                    title: '결과 확인하기',
                    link: {
                        mobileWebUrl: prodUrl,
                        webUrl: prodUrl,
                    },
                },
            ],
        });
    }

    return (
    <Button variant="outline" onClick={handleShare} className="border-0" disabled={product?.title===undefined}>
        <Share2Icon/>
    </Button>
  )
}

export default KakaoShare