import React, {Key} from 'react';
import DiscoverCard from './components/DiscoverCard';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {Collection} from '@/lib/types';
import {fetchCollectionList} from '@/api/collection';
import {useQuery} from '@tanstack/react-query';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';

const Discover = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['collections'],
        queryFn: () => fetchCollectionList(),
    });
    if (isLoading) return <Spinner />;
    if (isError) return <NotFound />;

    return (
        <div className="w-full pb-5 pt-4 flex flex-col justify-center">
            <Carousel
                className="w-full"
                opts={{loop: true}}
                autoplay={true}
                autoplayInterval={2500}
            >
                <CarouselContent>
                    {data?.map(
                        (
                            collection: Collection,
                            index: Key | null | undefined,
                        ) => (
                            <CarouselItem key={index}>
                                <DiscoverCard collection={collection} />
                            </CarouselItem>
                        ),
                    )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default Discover;
