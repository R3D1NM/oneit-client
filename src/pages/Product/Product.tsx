import {Link, useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import Gift from '@/assets/giftbox.png';
import {Button} from '@/components/ui/button';
import KakaoShare from '@/components/common/KakaoShare';
import {
    CalendarCheck,
    ChevronLeft,
    Heart,
    MoveRight,
    PlusSquare,
    Star,
    StarIcon,
} from 'lucide-react';
import Share from '@/components/common/Share';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {Separator} from '@/components/ui/separator';
import {fetchProduct} from '@/api/product';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {addToBasket, fetchBasketList} from '@/api/basket';
import {Basket} from '@/lib/types';
import {useSetAtom} from 'jotai';
import {emptySelected, selectProduct} from '@/atoms/basket';
import {toast} from 'sonner';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/lib/utils';

const Product = () => {
    const {productID} = useParams();
    const putIntoBasket = useSetAtom(addToBasket);
    const emptyAll = useSetAtom(emptySelected);
    const onSelect = useSetAtom(selectProduct);

    // console.log(productID);

    const basketAPI = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
    });

    const navigate = useNavigate();

    const productAPI = useQuery({
        queryKey: ['product', productID],
        queryFn: () => fetchProduct(productID || ''),
    });

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleAddToBasket = (basketID: string) => {
        if (productAPI.data) {
            emptyAll();
            onSelect(productAPI.data);
            putIntoBasket(basketID || '');
            toast.success('상품이 추가되었습니다.');
        }
    };

    if (productAPI.isLoading) return <Spinner />;
    if (productAPI.isError) return <NotFound />;

    return (
        <div className="w-full pb-12">
            <div className="flex py-3 flex-wrap items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={handleGoBack}
                >
                    <ChevronLeft className="" />
                </Button>
                {/* <p>{data?.brandName}</p> */}
                <div className="flex">
                    <Button variant="ghost" size="icon">
                        <Heart />
                    </Button>
                    <Share
                        title="ONE!T"
                        text={productAPI.data?.name || 'ONE!T'}
                        url={`https://oneit.gift/product/${productAPI.data?.idx}`}
                    />
                </div>
            </div>

            <div className="flex justify-center w-full">
                <img
                    src={productAPI.data?.thumbnailUrl || Gift}
                    alt="recommended product"
                    // width={200}
                    // height={200}
                    className="object-cover group-hover:opacity-50 transition-opacity"
                />
            </div>
            <div className="py-2 bg-white dark:bg-gray-950">
                <p className="text-oneit-gray text-sm mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                    {productAPI.data?.categoryDisplayName}
                </p>
                <a
                    href={productAPI.data?.productUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <h3 className="text-xl font-bold md:text-xl">
                        {productAPI.data?.name}
                    </h3>
                </a>
                <div className="flex items-center justify-between mt-2">
                    <p>{productAPI.data?.brandName}</p>
                    <h4 className="text-base font-semibold md:text-lg text-onei">
                        {productAPI.data?.originalPrice.toLocaleString()}원
                    </h4>
                </div>
            </div>
            <Separator className="mb-2" />
            <div className="flex flex-col">
                <div className="flex w-full p-1 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                    {productAPI.data?.keywords.map((keyword) => {
                        return (
                            <p className="text-oneit-pink text-sm inline-block mr-1">{`#${keyword}`}</p>
                        );
                    })}
                    {/* <p className="text-oneit-pink">#실용적인 #태그 #태그</p> */}
                </div>
                <div className="flex">
                    <p>요즘 스트레스를 많이 받는 친구에게 추천</p>
                </div>
                <div className="flex items-center gap-2"></div>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col items-center">
                <div className="flex items-center justify-center">
                    <div className="flex items-center gap-1 mr-2">
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-primary" />
                        <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                        <StarIcon className="w-5 h-5 fill-muted stroke-muted-foreground" />
                    </div>
                    <span className="text-lg font-medium">3.2</span>
                </div>
                <p>"선물 관점의 후기 한줄평으로"</p>
            </div>
            {/* <div className="border-[0.3px] my-1"></div>
            <div>
                <p>상품 설명</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porta ante vehicula, gravida nunc at, ullamcorper ligula. Nullam fermentum nec lectus eget consectetur.</p>
                <p>Mauris vestibulum lacus vel orci consectetur semper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                <p>Mauris vestibulum lacus vel orci consectetur semper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
            </div> */}

            <div className="fixed  mx-auto bottom-16 inset-x-0 flex justify-center gap-3 max-w-sm  h-15 w-full bg-white rounded-t-md mb-[-5px]">
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button className="w-full bg-oneit-blue hover:bg-oneit-blue/90 my-2">
                            추가하기
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <div className="p-4 pb-0">
                                {/* My basket List */}
                                {basketAPI.isLoading ? (
                                    <Spinner />
                                ) : basketAPI.data.lenght !== 0 ? (
                                    <ScrollArea
                                        className={cn(
                                            'flex items-center justify-between w-full',
                                            basketAPI.data?.length > 3
                                                ? 'h-28'
                                                : 'max-h-fit',
                                        )}
                                    >
                                        {basketAPI.data?.map(
                                            (basket: Basket) => {
                                                return (
                                                    <DrawerClose asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="flex w-full items-center justify-between rounded-lg border-oneit-blue border-2 p-1 mt-1"
                                                            onClick={() =>
                                                                handleAddToBasket(
                                                                    basket.idx.toString(),
                                                                )
                                                            }
                                                        >
                                                            <p className="ml-2">
                                                                {basket.name}
                                                            </p>
                                                            <div className="flex text-muted-foreground text-sm items-center">
                                                                <CalendarCheck className="mr-2" />
                                                                {
                                                                    basket.deadline
                                                                        .toString()
                                                                        .split(
                                                                            'T',
                                                                        )[0]
                                                                }
                                                            </div>
                                                        </Button>
                                                    </DrawerClose>
                                                );
                                            },
                                        )}
                                    </ScrollArea>
                                ) : (
                                    <a href="/basket/add" className="w-full">
                                        <Button
                                            variant="ghost"
                                            className="w-full"
                                        >
                                            새로운 선물 바구니 만들기
                                        </Button>
                                    </a>
                                )}
                            </div>
                            <DrawerFooter className="flex">
                                <DrawerClose asChild>
                                    <Button variant="outline">취소</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>
                <a
                    href={productAPI.data?.productUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-[40%]"
                >
                    <Button size="lg" className="my-2 w-full">
                        {productAPI.data?.mallName}
                        <MoveRight className="pl-2" />
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default Product;
