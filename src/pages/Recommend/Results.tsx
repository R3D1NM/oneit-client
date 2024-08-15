import {useAtomValue, useSetAtom} from 'jotai';
import {
    answers,
    comment,
    gift,
    isValidGift,
    name,
    recipient,
    title,
} from '@/atoms/recommend';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import React, {Suspense, useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import Kakao from '@/assets/kakao.png';
import Naver from '@/assets/naver_blog.png';
import Instagram from '@/assets/instagram.png';
import {Spinner} from '@/components/ui/spinner';
import {getGift} from '@/api/product';
import {Card, CardTitle} from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Share from '@/components/common/Share';
import KakaoShare from '@/components/common/KakaoShare';
import {isLoginAtom} from '@/api/auth';

const GiftCard = React.lazy(() => import('./components/GiftCard'));
const NotFound = React.lazy(() => import('../NotFound'));

const Results = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const {chatID} = useParams();
    const isLogin = useAtomValue(isLoginAtom);

    const getResult = useSetAtom(getGift);
    const product = useAtomValue(gift);
    const isValid = useAtomValue(isValidGift);
    const removeAnswers = useSetAtom(answers);

    const userName = useAtomValue(name);
    const userRecipient = useAtomValue(recipient);

    const userType = useAtomValue(title);
    const userComment = useAtomValue(comment);

    const handleRetry = () => {
        removeAnswers({} as {[key: string]: string});
        navigate('/recommend');
    };

    useEffect(() => {
        if (!chatID || chatID === '') {
            navigate('/recommend');
        }
        getResult(chatID);
    }, []);

    return (
        <>
            <div className="flex flex-col content-center w-full gap-2 justify-center">
                <Card className="flex rounded-lg shadow-md max-w-md w-full flex-col justify-center h-fit py-5">
                    <CardTitle className=" mb-4 flex justify-between px-4">
                        {/* <strong className='font-Bayon text-3xl'>One!t</strong>  */}
                        <div className="flex flex-col">
                            <h3 className="text-lg">{userType}</h3>
                            <span className="text-oneit-gray text-sm">
                                {userComment}
                            </span>
                        </div>
                        {isValid && (
                            <KakaoShare
                                title={`ONE!T - ${userName === '' ? '' : userName + '을 위한 '}선물 추천`}
                                description="WANNA GIFT IT, ONE!T"
                                url={`https://www.oneit.gift/result/${chatID}`}
                                image={product[0].thumbnailUrl}
                            />
                        )}

                        {/* <Share  url={`https://oneit.gift/result/${chatID}`} title={`ONE!T - ${userName===""?"":userName+"위한 "}선물 추천`} text={product.map(item => item.name).join('\n')}/> */}
                        {/* <Share2Icon/> */}
                    </CardTitle>
                    <div className="w-full">
                        <Suspense fallback={<Spinner />}>
                            {isValid ? (
                                <Carousel
                                    className="w-full"
                                    opts={{loop: true}}
                                    autoplay={true}
                                    autoplayInterval={2500}
                                >
                                    <CarouselContent>
                                        {product.map((item, index) => (
                                            <CarouselItem key={index}>
                                                <GiftCard product={item} />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            ) : (
                                <NotFound />
                            )}
                        </Suspense>
                    </div>
                    {isValid && (
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
                                            onClick={() =>
                                                navigate('/discover')
                                            }
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
                    )}
                </Card>
            </div>
        </>
    );
};

export default Results;
