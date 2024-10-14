import {useAtom} from 'jotai';
import {useNavigate, useParams} from 'react-router-dom';
import {Spinner} from '@/components/ui/spinner';
import {fetchRecommendedProducts} from '@/api/product';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import Header from '@/components/common/Header';
// import {isLoginAtom} from '@/api/auth';
import {useQuery} from '@tanstack/react-query';
import {Product} from '@/lib/types';
import React, {useEffect, useState} from 'react';
import giftIcon from '@/assets/tabler_gift.svg';
import {Button} from '@/components/common/Button';
const NotFound = React.lazy(() => import('../NotFound'));
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {rateResult} from '@/api/chat';
import {Gift} from 'lucide-react';
const {Kakao} = window;

const rateStyles = `
  .rate:not(:checked) > input {
    position: absolute;
    top: -9999px;
  }
  .rate:not(:checked) > label {
    float: right;
    width: 1em;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
    font-size: 1.25rem;
    color: #ccc;
  }
  .rate:not(:checked) > label:before {
    content: "★ ";
  }
  .rate > input:checked ~ label {
    color: #ff4bc1;
  }
  .rate:not(:checked) > label:hover,
  .rate:not(:checked) > label:hover ~ label {
    color: #ff4bc1;
  }
  .rate > input:checked + label:hover,
  .rate > input:checked + label:hover ~ label,
  .rate > input:checked ~ label:hover,
  .rate > input:checked ~ label:hover ~ label,
  .rate > label:hover ~ input:checked ~ label {
    color: #ff4bc1;
  }
`;

const Results = () => {
    const navigate = useNavigate();
    const {chatID} = useParams();
    const [{mutate, mutateAsync}] = useAtom(rateResult);
    const [rating, setRating] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(true);

    const recommendedAPI = useQuery({
        queryKey: ['fetchRecommendedProducts', chatID],
        queryFn: () => fetchRecommendedProducts(chatID || ''),
        retry: 3,
    });

    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
    }, []);

    useEffect(() => {
        if (!chatID || chatID === '') {
            navigate('/recommend');
        }
    }, [chatID, navigate]);

    const handleShare = ({
        title,
        description,
        image,
        url,
    }: {
        title: string;
        description: string;
        image: string;
        url: string;
    }) => {
        const payload = {
            objectType: 'feed',
            content: {
                title: title || 'ONE!T - 선물 추천 플랫폼',
                description: description || '',
                imageUrl: image || 'https://www.oneit.gift/oneit.png',
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
            buttons: [
                {
                    title: 'ONE!T에서 확인하기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
            ],
        };
        console.log(payload);

        Kakao.Share.sendDefault(payload);
        setIsOpen(true);
    };

    if (recommendedAPI.isLoading) {
        return <Spinner />;
    }

    if (recommendedAPI.isError) {
        return <NotFound />;
    }

    return (
        <>
            <Header variant="logo" />
            <main className="pt-14 px-4" role="main">
                <div className="gift">
                    <div className="title">
                        <p className="stitle text-sm">선물 추천 분석 결과,</p>
                        <p className="ltitle text-2xl font-bold">
                            ONE!T이 추천하는 선물은!
                        </p>
                    </div>
                    <div className="slider flex flex-col flex-1 mt-2.5">
                        <Carousel
                            className="w-full"
                            opts={{loop: true}}
                            autoplay={true}
                            autoplayInterval={2500}
                        >
                            <CarouselContent className="w-full m-0">
                                {recommendedAPI.data?.result.map(
                                    (item: Product, index: number) => (
                                        <CarouselItem
                                            key={index}
                                            className="w-full text-center bg-white flex flex-col  justify-center items-center p-[1.125rem] rounded-3xl border border-[#e7e7e7] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.15)] m-4"
                                        >
                                            <div className="text_top">
                                                <p className="font-bold text-[#3d3d3d]">
                                                    {
                                                        recommendedAPI.data
                                                            ?.resultType.title
                                                    }
                                                </p>
                                                <div className="tag mt-1.5 flex justify-center">
                                                    <ul className="flex flex-wrap gap-1 items-center">
                                                        {recommendedAPI.data?.resultType.comment
                                                            .split(' ')
                                                            .map(
                                                                (
                                                                    tag: string,
                                                                    tagIndex: number,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            tagIndex
                                                                        }
                                                                        className="bg-[#f6f6f6] rounded-full h-4.5 text-xs text-[#888] px-2 flex items-center justify-center"
                                                                    >
                                                                        {tag}
                                                                    </li>
                                                                ),
                                                            )}
                                                    </ul>
                                                </div>
                                                <div className="img mt-[1.125rem] w-[165px] h-[165px] mx-auto overflow-hidden rounded-2xl">
                                                    <img
                                                        src={item.thumbnailUrl}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="price_info mt-[1.125rem]">
                                                    <h3 className="text-lg text-[#3d3d3d] font-bold">
                                                        {item.name}
                                                    </h3>
                                                    <p className="price mt-1.5 text-[#6d6d6d] font-bold before:content-['₩'] before:text-[#b0b0b0] before:font-bold before:inline-block">
                                                        {item.originalPrice.toLocaleString()}
                                                    </p>
                                                    <div className="desc mt-1.5 text-xs text-[#3d3d3d] mb-1.5">
                                                        {item.description}
                                                    </div>
                                                    <a
                                                        href={item.productUrl}
                                                        className="btn_underline text-[#ff4bc1] underline"
                                                    >
                                                        제품 자세히 보기
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="btns flex gap-3 items-center w-full mt-[1.125rem]">
                                                <Button
                                                    className="flex-1 justify-center items-center border-[#b0b0b0] text-[#b0b0b0]"
                                                    variant="border"
                                                    onClick={() =>
                                                        handleShare({
                                                            title:
                                                                recommendedAPI
                                                                    .data
                                                                    ?.resultType
                                                                    .title ||
                                                                'ONE!T - 선물 추천 플랫폼',
                                                            description:
                                                                recommendedAPI
                                                                    .data
                                                                    ?.resultType
                                                                    .comment ||
                                                                '',
                                                            image: item.thumbnailUrl,
                                                            url: `${import.meta.env.VITE_CURRENT_DOMAIN}/recommend/${chatID}/result`,
                                                        })
                                                    }
                                                >
                                                    공유하기
                                                </Button>
                                                <a
                                                    href={item.productUrl}
                                                    target="_blank"
                                                    className="flex-1 flex justify-center items-center"
                                                >
                                                    <Button
                                                        className="w-full"
                                                        variant="border"
                                                    >
                                                        <img
                                                            src={giftIcon}
                                                            alt="Gift icon"
                                                            className="w-6 h-6 mr-1"
                                                        />
                                                        구매하러 가기
                                                    </Button>
                                                </a>
                                            </div>
                                        </CarouselItem>
                                    ),
                                )}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </main>
            <Drawer
                // handleOnly={true}
                open={isOpen}
                onDrag={() => setIsOpen(!isOpen)}
                onClose={() => setIsOpen(false)}
                onRelease={() => setIsOpen(false)}
            >
                <DrawerTrigger asChild>
                    <Button className="w-full bg-oneit-blue hover:bg-oneit-blue/90 my-2 hidden">
                        결과 평가하기
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="bottom_sheet p-4">
                        <div className="contents text-center">
                            <p className="text-lg font-semibold mb-4">
                                결과가 마음에 드셨나요?
                            </p>
                            <div className="flex justify-center">
                                <div className="rate inline-block">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <React.Fragment key={star}>
                                            <input
                                                type="radio"
                                                id={`star${star}`}
                                                name="rate"
                                                value={star}
                                                checked={rating === star}
                                                onChange={() => setRating(star)}
                                            />
                                            <label
                                                htmlFor={`star${star}`}
                                                title={`${star} stars`}
                                            >
                                                {star} stars
                                            </label>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="btn_wrap mt-6">
                            <Button
                                className="w-full bg-[#ff4bc1] hover:bg-[#ff4bc1]/90 text-white"
                                onClick={() => {
                                    console.log('Rating:', rating);
                                    mutateAsync({
                                        chatID: chatID || '',
                                        rating: rating || 0,
                                    });
                                    setIsOpen(false);
                                    // navigate('/recommend');
                                }}
                            >
                                평가 등록
                            </Button>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
            <style>{rateStyles}</style>
            <Button
                className="fixed bottom-1 right-1 px-3 py-6 rounded-full shadow-lg m-1 "
                onClick={() => setIsOpen(true)}
            >
                <Gift />
            </Button>
        </>
    );
};

export default Results;
