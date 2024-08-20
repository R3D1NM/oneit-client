import {Basket, Product} from '@/lib/types';
import Gift from '@/assets/giftbox.png';
import {Button} from '@/components/ui/button';
import {authAtom, isLoginAtom} from '@/api/auth';
import {useAtomValue, useSetAtom} from 'jotai';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {addToBasket, fetchBasketList} from '@/api/basket';
import {useQuery} from '@tanstack/react-query';
import {Spinner} from '@/components/ui/spinner';
import {emptySelected, selectProduct} from '@/atoms/basket';
import {toast} from 'sonner';
import {useNavigate} from 'react-router-dom';
import {cn} from '@/lib/utils';
import {CalendarCheck} from 'lucide-react';
import {ScrollArea} from '@/components/ui/scroll-area';

interface GiftCardProps {
    product: Product;
}

const GiftCard = (props: GiftCardProps) => {
    const isLogin = useAtomValue(isLoginAtom);
    const putIntoBasket = useSetAtom(addToBasket);
    const emptyAll = useSetAtom(emptySelected);
    const onSelect = useSetAtom(selectProduct);
    const navigate = useNavigate();
    const {product} = props;

    const basketAPI = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
        enabled: isLogin,
    });
    // console.log(product);

    const handleAddToBasket = (basketID: string) => {
        if (product) {
            emptyAll();
            onSelect(product);
            putIntoBasket(basketID || '');
            toast.success('상품이 추가되었습니다.', {
                action: {
                    label: '확인하기',
                    onClick: () => {
                        navigate('/basket/' + basketID);
                    },
                },
            });
        }
    };

    return (
        <div className="w-full px-8">
            <a href={`/product/${product.idx}`}>
                <div className="flex justify-center">
                    <img
                        src={product.thumbnailUrl || Gift}
                        // src="https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20240129103642_a5ca62d182ec419285ba708b51cb72c2.jpg"
                        alt="recommended product"
                        width={200}
                        height={200}
                        className="object-cover group-hover:opacity-50 transition-opacity"
                    />
                </div>
            </a>
            <div className="pt-2 bg-white">
                <a href={`/product/${product.idx}`}>
                    <h3 className="text-lg font-semibold md:text-xl">
                        {product.name}
                    </h3>
                </a>

                <div className="flex items-center justify-between  mt-2">
                    <h4 className="text-base font-semibold md:text-lg">
                        {product.originalPrice.toLocaleString()}원
                    </h4>
                    {isLogin && (
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button className="w-fit bg-oneit-blue hover:bg-oneit-blue/90 mt-2">
                                    바구니에 추가하기
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <div className="mx-auto w-full max-w-sm">
                                    <div className="p-2 pb-0">
                                        {/* My basket List */}
                                        {basketAPI.isLoading ? (
                                            <Spinner />
                                        ) : basketAPI.data.length !== 0 ? (
                                            <ScrollArea
                                                className={cn(
                                                    'flex items-center justify-between w-full',
                                                    basketAPI.data?.length > 3
                                                        ? 'h-28'
                                                        : 'max-h-fit',
                                                )}
                                            >
                                                {basketAPI.data?.map(
                                                    (
                                                        basket: Basket,
                                                        idx: number,
                                                    ) => {
                                                        return (
                                                            <DrawerClose
                                                                asChild
                                                                key={idx}
                                                            >
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
                                                                        {
                                                                            basket.name
                                                                        }
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
                                            <a
                                                href="/basket/add"
                                                className="w-full"
                                            >
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
                                            <Button variant="outline">
                                                취소
                                            </Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiftCard;
