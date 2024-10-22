import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Product} from '@/lib/types';
import {Link, useNavigate} from 'react-router-dom';
import logo from '@/assets/images/oneit.png';

interface ProductCardProps {
    product: Product;
}

const ProductCard = (props: ProductCardProps) => {
    const {product} = props;
    const navigate = useNavigate();
    return (
        <div
            className="box"
            onClick={() => navigate(`/product/${product.idx}`)}
        >
            <div className="image">
                <div className="photo">
                    <img src={product.thumbnailUrl || logo} alt="제품 이미지" />
                </div>
            </div>
            <a>
                <p className="title text-overflow h-10 ">
                    {product.name || '상품정보없음'}
                </p>
                <p className="price">
                    ₩ {product.originalPrice?.toLocaleString() || 0}
                </p>
                <div className="tags">
                    {product.keywords
                        ?.splice(0, 3)
                        .map((tag, idx) => <span key={idx}>#{tag}</span>)}
                </div>
            </a>
        </div>
    );
};

export default ProductCard;
