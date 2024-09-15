import BasketIntroCard from './components/BasketCard';
import Recommend from './components/RecommendCard';
import {useQuery} from '@tanstack/react-query';
import {fetchBasketList} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {Basket} from '@/lib/types';
import {Key, useState} from 'react';
import {useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';
import BasketInfoCard from '../Basket/components/BasketInfoCard';
import {Link, useNavigate} from 'react-router-dom';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {Button} from '@/components/ui/button';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import Chusuk1 from '@/assets/chusuk3.png';
import Chusuk2 from '@/assets/chusuk4.png';
import Chusuk3 from '@/assets/chusuk5.png';

const Main = () => {
    const isLogin = useAtomValue(isLoginAtom);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const CurationList = () => {
        const {data, isLoading, isError} = useQuery({
            queryKey: ['basket'],
            queryFn: () => fetchBasketList(),
            enabled: isLogin,
        });
        if (isLoading) return <Spinner />;
        if (isError) {
            return <div>생성한 바구니가 없습니다.</div>;
        }
        if (data.length === 0) {
            return (
                <BasketIntroCard
                    text="새로운 바구니를 만들어보세요"
                    login={true}
                />
            );
        }
        // console.log(data);

        return (
            <Carousel
                className="w-full"
                opts={{loop: true}}
                autoplay={true}
                autoplayInterval={2500}
            >
                <CarouselContent>
                    {data?.map(
                        (basket: Basket, index: Key | null | undefined) => (
                            <CarouselItem key={index}>
                                <Link
                                    to={`/basket/${basket.idx}`}
                                    className="block"
                                >
                                    <BasketInfoCard
                                        basket={basket}
                                        className="rounded-lg overflow-hidden shadow-sm group  w-full my-2 border-[0.5px]"
                                    />
                                </Link>
                            </CarouselItem>
                        ),
                    )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        );
    };

    return (
        <div className="flex flex-col overflow-hidden justify-center gap-2 p-1 w-full items-center mx-auto ">
            <Drawer>
                <DrawerTrigger asChild>
                    <div className="rounded-lg hover:cursor-pointer p-2 animate-bounce bg-gradient-to-br to-oneit-pink from-oneit-blue hover:bg-gradient-to-br ">
                        <p className="text-lg">ONE!T은 지금 이벤트 진행 중!</p>
                    </div>
                </DrawerTrigger>
                <DrawerContent className="w-full flex flex-col justify-center items-center">
                    <DrawerHeader className="w-full flex justify-center">
                        <DrawerTitle className="text-2xl">
                            🌕 추석 맞이 BIG EVENT 🌕
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="max-w-sm w-full">
                        <a
                            href="https://www.instagram.com/p/C_7LxRNpOMS"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Carousel
                                className="w-full"
                                opts={{loop: true}}
                                autoplay={true}
                                autoplayInterval={2500}
                            >
                                <CarouselContent>
                                    <CarouselItem>
                                        <AspectRatio
                                            className="justify-center flex"
                                            ratio={1 / 1}
                                        >
                                            <img
                                                src={Chusuk1}
                                                className=" object-cover"
                                            />
                                        </AspectRatio>
                                    </CarouselItem>
                                    <CarouselItem className="">
                                        <AspectRatio
                                            className="justify-center flex"
                                            ratio={1 / 1}
                                        >
                                            <img src={Chusuk2} />
                                        </AspectRatio>
                                    </CarouselItem>
                                    <CarouselItem className="">
                                        <AspectRatio
                                            className="justify-center flex"
                                            ratio={1 / 1}
                                        >
                                            <img src={Chusuk3} />
                                        </AspectRatio>
                                    </CarouselItem>
                                </CarouselContent>
                            </Carousel>
                        </a>
                        {/* todo: link to instagram */}
                    </div>
                    <DrawerFooter className="w-full">
                        <Button onClick={() => navigate('/recommend')}>
                            선물 추천 바로가기
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Recommend />
            {isLogin ? (
                <BasketIntroCard text="선물 바구니 보러 가기" login={true} />
            ) : (
                <BasketIntroCard
                    text="카카오 로그인하고 바구니를 만들어보세요"
                    login={false}
                />
            )}
        </div>
    );
};

export default Main;
