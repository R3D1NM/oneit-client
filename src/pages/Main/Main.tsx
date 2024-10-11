import BasketIntroCard from './components/BasketCard';
import Recommend from './components/RecommendCard';
import {useQuery} from '@tanstack/react-query';
import {fetchBasketList} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {Basket} from '@/lib/types';
import {Key} from 'react';
import {useAtomValue} from 'jotai';
import {authAtom, isLoginAtom} from '@/api/auth';
import BasketInfoCard from '../Basket/components/BasketInfoCard';
import {Link} from 'react-router-dom';
import {FCMTokenAtom} from '@/api/notification';

const Main = () => {
    const isLogin = useAtomValue(isLoginAtom);
    const token = useAtomValue(FCMTokenAtom);
    // console.log(token);

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
        <div className="flex flex-col overflow-hidden justify-center gap-2 p-1 w-full items-center mt-4 mb-5">
            {!isLogin && (
                <BasketIntroCard
                    text="카카오 로그인하고 바구니를 만들어보세요"
                    login={false}
                />
            )}
            {isLogin && <CurationList />}
            <Recommend />
        </div>
    );
};

export default Main;
