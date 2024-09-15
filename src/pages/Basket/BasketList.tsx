import {fetchBasketList} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import React, {Key} from 'react';
import BasketInfoCard from './components/BasketInfoCard';
import BasketIntroCard from '../Main/components/BasketCard';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {Basket} from '@/lib/types';
import {Link, useNavigate} from 'react-router-dom';

const CurationList = () => {
    const navigate = useNavigate();
    const {data, isLoading} = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
    });
    if (isLoading) return <Spinner />;

    // if (data.length === 0) {
    //     navigate('/basket/create');
    // }
    // console.log(data);

    return (
        <Carousel
            className="w-full"
            opts={{loop: true}}
            autoplay={true}
            autoplayInterval={2500}
        >
            <CarouselContent>
                {data?.map((basket: Basket, index: Key | null | undefined) => (
                    <CarouselItem key={index}>
                        <Link to={`/basket/${basket.idx}`} className="block">
                            <BasketInfoCard
                                basket={basket}
                                className="rounded-lg overflow-hidden shadow-sm group  w-full my-2 border-[0.5px]"
                            />
                        </Link>
                    </CarouselItem>
                ))}
                <CarouselItem key={999}>
                    <Link to={`/basket/create`} className="block">
                        <BasketInfoCard
                            basket={exampleBasket}
                            className="rounded-lg overflow-hidden shadow-sm group  w-full my-2 border-[0.5px]"
                        />
                    </Link>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

const exampleBasket: Basket = {
    idx: 9999,
    name: '[예시] 바구니를 만들어 보세요',
    description: '친구를 초대하여 함께 고를 수 있어요',
    deadline: new Date('2024-12-31T00:00:00'),
    accessStatus: 'PUBLIC',
};

const BasketList = () => {
    return (
        <div className="flex flex-col overflow-hidden justify-center gap-2 p-1 w-full items-center mt-4 mb-5">
            <h2 className="text-2xl font-bold">바구니 목록</h2>
            <CurationList />
        </div>
    );
};

export default BasketList;
