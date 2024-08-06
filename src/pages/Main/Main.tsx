import BasketCard from '@/pages/Basket/components/BasketCard';
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

const Main = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
    });

    if (isError) {
        return <NotFound />;
    }

    return (
        <div className="flex flex-col overflow-hidden justify-center gap-5 p-1 w-full items-center">
            {isLoading ? (
                <Spinner />
            ) : (
                <Carousel
                    className="w-full"
                    opts={{loop: true}}
                    autoplay={true}
                    autoplayInterval={2500}
                >
                    <CarouselContent>
                        {data.map(
                            (basket: Basket, index: Key | null | undefined) => (
                                <CarouselItem key={index}>
                                    <BasketCard basket={basket} />
                                </CarouselItem>
                            ),
                        )}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            )}
            {/* <BasketCard /> */}
            <Recommend />
        </div>
    );
};

export default Main;
