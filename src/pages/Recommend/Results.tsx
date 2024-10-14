import {useAtomValue, useSetAtom} from 'jotai';
import {comment, gift, isValidGift, name, title} from '@/atoms/recommend';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import React, {Suspense, useEffect} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Spinner} from '@/components/ui/spinner';
import {fetchRecommendedProducts} from '@/api/product';
import {Card, CardTitle} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import KakaoShare from '@/components/common/KakaoShare';
import {isLoginAtom} from '@/api/auth';
import {useQuery} from '@tanstack/react-query';
import {Product} from '@/lib/types';

const GiftCard = React.lazy(() => import('./components/GiftCard'));
const NotFound = React.lazy(() => import('../NotFound'));

const Results = () => {
    const navigate = useNavigate();
    const {chatID} = useParams();
    const isLogin = useAtomValue(isLoginAtom);

    const recommendedAPI = useQuery({
        queryKey: ['fetchRecommendedProducts', chatID],
        queryFn: () => fetchRecommendedProducts(chatID || ''),
        retry: 3,
    });

    useEffect(() => {
        if (!chatID || chatID === '') {
            navigate('/recommend');
        }
    }, []);

    if (recommendedAPI.isLoading) {
        return <Spinner />;
    }

    if (recommendedAPI.isError) {
        return <NotFound />;
    }

    return (
        <>
            <div className="flex flex-col content-center w-full gap-2 justify-center">
                <Card className="flex rounded-lg shadow-md max-w-md w-full flex-col justify-center h-fit py-5">
                    <CardTitle className=" mb-4 flex justify-between px-4">
                        {/* <strong className='font-Bayon text-3xl'>One!t</strong>  */}
                        <div className="flex flex-col">
                            <h3 className="text-lg">
                                {recommendedAPI.data?.resultType.title}
                            </h3>
                            <span className="text-oneit-gray text-sm">
                                {recommendedAPI.data?.resultType.comment}
                            </span>
                        </div>

                        <KakaoShare
                            title={`ONE!T - ${recommendedAPI.data?.userName === '' ? '' : recommendedAPI.data?.userName + '을 위한 '}선물 추천`}
                            description="WANNA GIFT IT, ONE!T"
                            url={`/recommend/${chatID}/result`}
                            image={recommendedAPI.data?.result[0].thumbnailUrl}
                        />

                        {/* <Share  url={`https://oneit.gift/result/${chatID}`} title={`ONE!T - ${userName===""?"":userName+"위한 "}선물 추천`} text={product.map(item => item.name).join('\n')}/> */}
                        {/* <Share2Icon/> */}
                    </CardTitle>
                    <div className="w-full">
                        <Suspense fallback={<Spinner />}>
                            <Carousel
                                className="w-full"
                                opts={{loop: true}}
                                autoplay={true}
                                autoplayInterval={2500}
                            >
                                <CarouselContent>
                                    {recommendedAPI.data?.result.map(
                                        (item: Product, index: number) => (
                                            <CarouselItem key={index}>
                                                <GiftCard product={item} />
                                            </CarouselItem>
                                        ),
                                    )}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </Suspense>
                    </div>
                    <div className="flex flex-col justify-evenly px-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    // onClick={() => navigate('/curation')}
                                    className="w-full mt-2"
                                >
                                    더 찾아보기
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        더 많은 선물을 보려면?
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-3 gap-2 h-32">
                                    <Button
                                        className="h-full bg-oneit-blue hover:bg-oneit-blue/90"
                                        onClick={() => navigate('/collection')}
                                    >
                                        <span className="break-keep whitespace-normal">
                                            주제별 컬렉션 탐색하기
                                        </span>
                                    </Button>
                                    <Button
                                        className="h-full"
                                        onClick={() => {
                                            navigate('/curation');
                                        }}
                                    >
                                        <span className="break-keep whitespace-normal">
                                            ONE!T 선물 목록 살펴보기
                                        </span>
                                    </Button>
                                    <Button
                                        className="h-full bg-oneit-orange hover:bg-oneit-orange/90"
                                        onClick={() => {
                                            navigate('/recommend');
                                        }}
                                    >
                                        <span className="break-keep whitespace-normal">
                                            ONE!T에게 다시 추천 받기
                                        </span>
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                        {!isLogin && (
                            <div className="flex items-center">
                                <Button
                                    onClick={() => {
                                        const uri = new URL(
                                            window.location.href,
                                        ).pathname;
                                        // console.log(uri);

                                        navigate('/login?redirect=' + uri);
                                    }}
                                    className="bg-kakao-yellow hover:bg-kakao-yellow/90 w-full mt-2"
                                >
                                    <span>
                                        카카오 로그인 후 바구니에 추가하기
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Results;
