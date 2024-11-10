import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Product} from '@/lib/types';
import {Link, useNavigate} from 'react-router-dom';
import logo from '@/assets/images/oneit.png';
import {cn} from '@/lib/utils';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {productLike} from '@/api/product';
import mageHeart from '@/assets/images/mage_heart_pink.svg';
import mageHeartFill from '@/assets/images/mage_heart_fill_pink.svg';
import {useState} from 'react';

interface ProductCardProps {
    product: Product;
}

const ProductCard = (props: ProductCardProps) => {
    const {product} = props;
    const [like, setLike] = useState<'NONE' | 'LIKE' | 'DISLIKE'>(
        product.likeStatus || 'NONE',
    );
    const [likeCount, setLikeCount] = useState(product.likeCount || 0);
    const navigate = useNavigate();
    const queryClikent = useQueryClient();

    const productLikeAPI = useMutation({
        mutationKey: ['productLike', product.idx],
        mutationFn: () => productLike(product.idx.toString() || ''),
        onSuccess: (data) => {
            setLike(data.likeStatus);
            setLikeCount(data.likeCount);
            // queryClikent.refetchQueries({ queryKey: ['likedProduct'] });
        },
    });

    const handleLike = (event: React.MouseEvent) => {
        event.stopPropagation();
        productLikeAPI.mutate();
    };

    return (
        <div
            className={cn('box', product.productStatus === 'INVALID' && 'sold')}
            onClick={() => navigate(`/product/${product.idx}`)}
        >
            <div className="image">
                <div
                    className={cn(
                        'photo ',
                        product.productStatus === 'INVALID' && 'sold',
                    )}
                >
                    <img
                        src={product?.thumbnailUrl || logo}
                        alt="제품 이미지"
                    />
                    <div className="heart" onClick={handleLike}>
                        <img
                            src={like === 'LIKE' ? mageHeartFill : mageHeart}
                            alt="Heart"
                            className="w-full h-full object-contain"
                        />
                        <span className="text-[#FF4BC1]">{likeCount || 0}</span>
                    </div>
                </div>
            </div>
            <a className="pr-4">
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
