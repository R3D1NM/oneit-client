import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Product} from '@/lib/types';
import {Link, useNavigate} from 'react-router-dom';
import logo from '@/assets/images/oneit.png';
import {cn} from '@/lib/utils';

interface ProductCardProps {
    product: Product;
}

const ProductCard = (props: ProductCardProps) => {
    const {product} = props;
    const navigate = useNavigate();
    return (
        <div
            className={cn('box', product.productStatus === 'INVALID' && 'sold')}
            onClick={() => navigate(`/product/${product.idx}`)}
        >
            <div className="image">
                <div
                    className={cn(
                        'photo',
                        product.productStatus === 'INVALID' && 'sold',
                    )}
                >
                    <img
                        src={product?.thumbnailUrl || logo}
                        alt="제품 이미지"
                    />
                </div>
            </div>
            <a>
                <p className="title text-overflow h-10 ">
                    {product?.name || '상품정보없음'}
                </p>
                <p className="price">
                    ₩ {product?.originalPrice?.toLocaleString() || 0}
                </p>
                <div className="tags">
                    {product?.keywords
                        ?.slice(0, 3)
                        .map((tag, idx) => <span key={idx}>#{tag.name}</span>)}
                </div>
            </a>
        </div>
    );
};

export default ProductCard;
