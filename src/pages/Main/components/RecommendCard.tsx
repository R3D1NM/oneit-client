import {Link} from 'react-router-dom';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import LottieContainer from '@/components/common/LottieContainer';

const RecommendCard = () => {
    return (
        <>
            <div className="p-1 w-full bg-gradient-to-br from-[#ffa0a0] to-[#ff9595] hover:from-[#FF9595] hover:to-[#FF9090] transition-colors duration-300 rounded-lg h-[50%] flex flex-col justify-between shadow-md border-0 max-w-md">
                <Link
                    to="recommend"
                    className="w-full h-full flex flex-col justify-between"
                >
                    <div className="px-3 pt-3">
                        <h3 className="text-2xl font-bold">선물 뭐 주지?</h3>
                        <p className="text-oneit-gray text-sm">
                            어떤 선물을 줘야 좋아할까? 선물 취향 테스트
                        </p>
                    </div>
                    <LottieContainer
                        fileName="surpriseGift_animate.json"
                        className="relative w-full h-[80%]"
                    />
                </Link>
            </div>
        </>
    );
};

export default RecommendCard;
