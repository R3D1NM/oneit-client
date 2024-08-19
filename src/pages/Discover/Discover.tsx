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
const mockCollections = [
    {
        idx: 1,
        name: 'Collection Name',
        description: 'Collection Description',
        thumbnailUrl: 'https://via.placeholder.com/400',
    },
    {
        idx: 2,
        name: 'Collection Name',
        description: 'Collection Description',
        thumbnailUrl: 'https://via.placeholder.com/400',
    },
    {
        idx: 3,
        name: 'Collection Name',
        description: 'Collection Description',
        thumbnailUrl: 'https://via.placeholder.com/400',
    },
    {
        idx: 4,
        name: 'Collection Name',
        description: 'Collection Description',
        thumbnailUrl: 'https://via.placeholder.com/400',
    },
    {
        idx: 5,
        name: 'Collection Name',
        description: 'Collection Description',
        thumbnailUrl: 'https://via.placeholder.com/400',
    },
];

const Discover = () => {
    return (
        <div className="w-full pb-5 pt-4 flex flex-col justify-center">
            <Carousel
                className="w-full"
                opts={{loop: true}}
                autoplay={true}
                autoplayInterval={2500}
            >
                <CarouselContent>
                    {mockCollections?.map(
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
