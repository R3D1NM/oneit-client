import {Product} from '@/lib/types';
import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ProductCard from '../Product/components/ProductCard';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';
import {ChevronLeft, Heart} from 'lucide-react';
import KakaoShare from '@/components/common/KakaoShare';
import {Separator} from '@/components/ui/separator';
import {useQuery} from '@tanstack/react-query';
import {fetchCollectionDetail} from '@/api/collection';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';

const mockCollection = {
    idx: 1,
    name: 'Collection Name',
    description: 'Collection Description',
    thumbnailUrl: 'https://via.placeholder.com/400',
};

const mockProducts: Product[] = [
    {
        idx: 1,
        name: 'Product Name',
        description: 'Product Description',
        thumbnailUrl: 'https://via.placeholder.com/400',
        originalPrice: 10000,
        currentPrice: 8000,
    },
    {
        idx: 2,
        name: 'Product Name',
        description: 'Product Description',
        thumbnailUrl: 'https://via.placeholder.com/400',
        originalPrice: 10000,
        currentPrice: 8000,
    },
];

const Collection = () => {
    const {collectionID} = useParams();
    const navigate = useNavigate();
    const {data, isLoading, isError} = useQuery({
        queryKey: ['collection', collectionID],
        queryFn: () => fetchCollectionDetail(collectionID || ''),
    });

    if (isLoading) return <Spinner />;
    if (isError) return <NotFound />;

    const handleGoBack = () => {
        navigate(-1);
    };
    return (
        <div className="flex flex-col w-full">
            <div className="flex py-3 flex-wrap items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={handleGoBack}
                >
                    <ChevronLeft className="" />
                </Button>
                <div className="flex flex-wrap items-center justify-end">
                    <Button variant={null}>
                        <Heart className="h-6 w-6 mr-2" />
                    </Button>
                    <KakaoShare
                        title={'ONE!T 선물 컬렉션 - ' + data?.collectionName}
                        description={data?.collectionDescription || 'ONE!T'}
                        image={
                            'https://' + data.collectionThumbnailUrl ||
                            'https://www.oneit.gift/oneit.png'
                        }
                        url={`https://oneit.gift/collection/${collectionID}`}
                    />
                </div>
            </div>
            <div className="overflow-hidden w-full">
                <div className="w-full items-center">
                    <AspectRatio ratio={1 / 1} className="justify-center flex">
                        <img
                            src={
                                'https://' + data.collectionThumbnailUrl ||
                                'https://via.placeholder.com/400'
                            }
                            alt={data.collectionName}
                            className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                        />
                    </AspectRatio>
                </div>

                <div className="p-4 ">
                    <div className="flex items-center justify-start">
                        <span>{data?.collectionDescription}</span>
                    </div>
                    <h3 className="max-w-full  text-xl font-semibold mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                        {data?.collectionName}
                    </h3>
                </div>
            </div>
            <div className="p-1 w-full text-center justify-center bg-oneit-blue flex items-center rounded-md mb-3">
                <h3 className="text-lg font-bold align-middle">상품 목록</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5">
                {data?.productList?.map((product: Product) => (
                    <ProductCard key={product.idx} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Collection;
