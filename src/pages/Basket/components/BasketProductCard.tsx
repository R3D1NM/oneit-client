import {basketProductVote, deleteBasketProduct} from '@/api/basket';
import {selctedProductCount, selectProduct} from '@/atoms/basket';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';
import {Product} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useMutation} from '@tanstack/react-query';
import {useAtomValue, useSetAtom} from 'jotai';
import {Heart, MinusSquare} from 'lucide-react';
import {useEffect, useState} from 'react';

interface ProductCardProps {
    product: Product;
    basketID: string;
    shared: boolean;
    likeCount: number;
    voteStatus: 'LIKE' | 'DISLIKE' | 'NONE';
    purchaseStatus: 'PURCHASED' | 'NOT_PURCHASED';
}

const BasketProductCard = (props: ProductCardProps) => {
    const {product, basketID, shared, likeCount, voteStatus, purchaseStatus} =
        props;
    const [vote, setVote] = useState<'LIKE' | 'DISLIKE' | 'NONE'>(voteStatus);
    const [count, setCount] = useState(likeCount);
    const [isOpen, setIsOpen] = useState(false);
    const onSelect = useSetAtom(selectProduct);
    const [isSelected, setIsSelected] = useState(false);
    const selectedCount = useAtomValue(selctedProductCount);

    const deleteAPI = useMutation({
        mutationFn: () => deleteBasketProduct(basketID || '', product.idx),
        onSuccess: () => window.location.reload(),
    });

    useEffect(() => {
        if (selectedCount === 0) {
            setIsSelected(false);
        }
    });

    const handleClick = () => {
        setIsSelected(!isSelected);
        onSelect(product);
    };

    const handleDelete = async () => {
        deleteAPI.mutate();
    };

    const handleVote = () => {
        let newVote: 'LIKE' | 'DISLIKE' | 'NONE';
        let newCount: number;

        if (vote === 'LIKE') {
            newVote = 'NONE';
            newCount = count - 1;
        } else {
            newVote = 'LIKE';
            newCount = count + 1;
        }

        setVote(newVote);
        setCount(newCount);

        // console.log(basketID, product.idx, 'uuid', newVote);

        basketProductVote(basketID, product.idx.toString(), 'uuid', newVote)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div
            key={product.idx}
            className={cn(
                'rounded-lg overflow-hidden shadow-sm flex flex-col',
                isSelected && 'border-[1px] border-oneit-blue',
                purchaseStatus === 'PURCHASED' && 'opacity-50',
            )}
        >
            <div className="relative group">
                <a
                    href={`/basket/${basketID}/product/${product.idx}`}
                    className="block"
                >
                    <AspectRatio ratio={1 / 1} className="justify-center flex">
                        <div className="relative w-full h-full flex justify-center">
                            <img
                                src={
                                    product.thumbnailUrl ||
                                    'https://via.placeholder.com/400'
                                }
                                alt={product.name}
                                className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                    </AspectRatio>
                </a>
                <div className="absolute top-0 right-0  transition-colors w-full justify-between flex">
                    {!shared && (
                        <Button
                            variant={null}
                            size="icon"
                            onClick={(e) => setIsOpen(true)}
                        >
                            <MinusSquare
                                stroke="#ffa0a0"
                                className="group-hover:stroke-red-500 bg-white rounded-sm"
                            />
                        </Button>
                    )}
                    <Button
                        variant={null}
                        className="flex flex-col p-1 m-1 bg-white rounded-sm"
                        onClick={handleVote}
                    >
                        {vote == 'LIKE' ? (
                            <Heart className="text-oneit-pink group-hover:text-red-500 fill-oneit-pink group-hover:fill-red-500" />
                        ) : (
                            <Heart className="text-oneit-pink group-hover:text-red-500" />
                        )}
                        <span className="text-xs text-gray-500 text-center">
                            {count}
                        </span>
                    </Button>
                </div>
                <AlertDialog open={isOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                바구니에서 해당 상품을 삭제할까요?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={(e) => setIsOpen(false)}
                            >
                                취소
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                                삭제하기
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className={cn('p-4 border-t-[0.5px]')} onClick={handleClick}>
                <h3 className="max-w-full  text-sm font-semibold mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                    {product.name}
                </h3>
                <div className="flex items-center justify-end">
                    <span className="font-bold text-lg">
                        {product.originalPrice.toLocaleString()}원
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BasketProductCard;
