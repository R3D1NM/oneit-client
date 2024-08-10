import {Link} from 'react-router-dom';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const RecommendCard = () => {
    return (
        <>
            <Card className="w-full bg-gradient-to-br from-[#ffa0a0] to-[#ff9595] hover:from-[#FF9595] hover:to-[#FF9090] transition-colors duration-300 rounded-lg h-[15%] flex flex-col justify-between shadow-md border-0 max-w-md">
                <Link
                    to="recommend"
                    className="w-full h-full flex flex-col justify-between"
                >
                    <CardHeader className="p-3">
                        <CardTitle>선물 뭐 주지?</CardTitle>
                        <CardDescription className="text-oneit-gray">
                            어떤 선물을 줘야 좋아할까? 선물 취향 테스트
                        </CardDescription>
                    </CardHeader>
                </Link>
            </Card>
        </>
    );
};

export default RecommendCard;
