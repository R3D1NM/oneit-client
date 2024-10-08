import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Product} from '@/lib/types';
import {Link} from 'react-router-dom';

interface ProductCardProps {
    product: Product;
}

const ProductCard = (props: ProductCardProps) => {
    const {product} = props;
    return (
        <div className="rounded-lg overflow-hidden shadow-sm ">
            <Link to={`/product/${product.idx}`} className="block">
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
                <div className="p-4">
                    <h3 className="max-w-full  text-sm font-semibold mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-end">
                        <span className="font-bold text-lg">
                            {product.originalPrice.toLocaleString()}원
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
