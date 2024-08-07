import {selctedProductCount, selectProduct} from '@/atoms/basket';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Separator} from '@/components/ui/separator';
import {Product} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useAtomValue, useSetAtom} from 'jotai';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

const AddProductCard = ({product}: {product: Product}) => {
    const onSelect = useSetAtom(selectProduct);
    const [isSelected, setIsSelected] = useState(false);
    const selectedCount = useAtomValue(selctedProductCount);

    useEffect(() => {
        if (selectedCount === 0) {
            setIsSelected(false);
        }
    });

    const handleClick = () => {
        setIsSelected(!isSelected);
        onSelect(product);
    };

    return (
        <div
            className={cn(
                'rounded-lg overflow-hidden shadow-sm ',
                isSelected && 'border-[1px] border-oneit-blue',
            )}
            onClick={handleClick}
        >
            <div className="w-full items-center">
                <AspectRatio ratio={1 / 1} className="justify-center flex">
                    <img
                        src={
                            product.thumbnailUrl ||
                            'https://via.placeholder.com/400'
                        }
                        alt={product.name}
                        className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                    />
                </AspectRatio>
            </div>

            <div className={cn('p-4 border-t-[0.5px]')}>
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

export default AddProductCard;
