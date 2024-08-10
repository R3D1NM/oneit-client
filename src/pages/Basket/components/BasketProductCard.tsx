import {deleteBasketProduct} from '@/api/basket';
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
import {Heart, MinusSquare} from 'lucide-react';
import {useState} from 'react';

interface ProductCardProps {
    product: Product;
    basketID: string;
    shared: boolean;
}

const BasketProductCard = (props: ProductCardProps) => {
    const {product, basketID, shared} = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        await deleteBasketProduct(basketID || '', product.idx);
        //refresh page
        window.location.reload();
    };
    return (
        <div
            key={product.idx}
            className="rounded-lg overflow-hidden shadow-sm flex flex-col"
        >
            <div className="relative group">
                <a href={`/product/${product.idx}`} className="block">
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
                    >
                        <Heart className="text-oneit-pink group-hover:text-red-500" />
                        <span className="text-xs text-gray-500 text-center">
                            25
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
            <a href={`/product/${product.idx}`} className="block">
                <div className="p-4">
                    <h3 className="max-w-full text-sm font-semibold mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg">
                            {product.originalPrice.toLocaleString()}원
                        </span>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default BasketProductCard;