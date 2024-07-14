import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LottieContainer from '../common/LottieContainer';


const RecommendCard = () => {



    return(
        <>
        <Card className="w-full bg-gradient-to-br from-[#ffa0a0] to-[#ff9595] hover:from-[#FF9595] hover:to-[#FF9090] transition-colors duration-300 rounded-lg h-[60%] flex flex-col justify-between shadow-md border-0 max-w-md">
            <Link to="recommend" className="w-full h-full flex flex-col justify-between">
            <CardHeader className='p-3'>
                <CardTitle>선물 추천</CardTitle>
                <CardDescription className='text-oneit-gray'>질문에 답하고 선물을 추천 받아 보세요!</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <LottieContainer fileName='surpriseGift_animate.json' className='mt-[-80px]'/>
            </CardContent>
            </Link>
        </Card> 
        </>
    )
}

export default RecommendCard