import {basketProductVote, deleteBasketProduct} from '@/api/basket';
import {selctedProductCount, selectProduct} from '@/atoms/basket';
import EmojiList from '@/data/emoji.json';
import {BaksetProduct} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useMutation} from '@tanstack/react-query';
import {useAtomValue, useSetAtom} from 'jotai';
import {Heart, MinusSquare} from 'lucide-react';
import {useEffect, useState} from 'react';
import likeit from '@/assets/images/icon_likeit.svg';
import mageHeart from '@/assets/images/mage_heart.svg';
import mageHeartFill from '@/assets/images/mage_heart_fill.svg';
import {useNavigate} from 'react-router-dom';
import logo from '@/assets/images/oneit.png';

interface ProductCardProps {
    product: BaksetProduct;
    basketID: string;
    shared: boolean;
    likeCount: number;
    voteStatus: 'LIKE' | 'DISLIKE' | 'NONE';
    purchaseStatus: 'PURCHASED' | 'NOT_PURCHASED';
}

const BasketProductCard = (props: ProductCardProps) => {
    const {product, basketID, shared, likeCount, voteStatus, purchaseStatus} =
        props;
    const navigate = useNavigate();
    const [vote, setVote] = useState<'LIKE' | 'DISLIKE' | 'NONE'>(voteStatus);
    const [count, setCount] = useState(likeCount);
    const [isOpen, setIsOpen] = useState(false);
    const onSelect = useSetAtom(selectProduct);
    const [isSelected, setIsSelected] = useState(false);
    const selectedCount = useAtomValue(selctedProductCount);

    const deleteAPI = useMutation({
        mutationFn: () =>
            deleteBasketProduct(basketID || '', product.idx.toString()),
        onSuccess: () => window.location.reload(),
    });

    const voteAPI = useMutation({
        mutationFn: () =>
            basketProductVote(basketID, product.idx.toString(), 'uuid', vote),
    });

    useEffect(() => {
        if (selectedCount === 0) {
            setIsSelected(false);
        }
    });

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

        voteAPI.mutate();
    };

    return (
        <div className={cn('box', purchaseStatus === 'PURCHASED' && 'sold')}>
            <div className="image">
                <div
                    className={cn(
                        'photo',
                        purchaseStatus === 'PURCHASED' && 'sold',
                    )}
                >
                    <img
                        onClick={() =>
                            navigate(
                                `/basket/${basketID}/product/${product.idx}`,
                            )
                        }
                        src={product?.thumbnailUrl || logo}
                        alt="제품 이미지"
                    />
                    <div className="heart" onClick={handleVote}>
                        <img
                            src={vote === 'LIKE' ? mageHeartFill : mageHeart}
                            alt="Heart"
                            className="w-full h-full object-contain"
                        />
                        <span
                            className={cn(vote === 'LIKE' && 'text-[#FF5757]')}
                        >
                            {count}
                        </span>
                    </div>
                    {product?.emojiIdx && (
                        <div
                            className={cn(
                                'desc',
                                product.emojiIdx &&
                                    `${EmojiList[product.emojiIdx].name}`,
                            )}
                            onClick={() =>
                                navigate(
                                    `/basket/${basketID}/product/${product.idx}`,
                                )
                            }
                        >
                            <button
                                className={cn(
                                    product.emojiIdx &&
                                        `${EmojiList[product.emojiIdx].name}`,
                                )}
                            >
                                <i></i>
                                <p>{EmojiList[product.emojiIdx].content}</p>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <a
                className="pr-3"
                onClick={() =>
                    navigate(`/basket/${basketID}/product/${product.idx}`)
                }
            >
                <p className="title text-overflow h-10 ">{product.name}</p>
                <p className="price">
                    ₩ {product.originalPrice.toLocaleString()}
                </p>
                <div className="tags">
                    {product.keywords
                        ?.slice(0, 3)
                        .map((tag, idx) => (
                            <span key={`${product.idx}-${idx}`}>
                                #{tag.name}
                            </span>
                        ))}
                </div>
            </a>
        </div>
    );
};

export default BasketProductCard;
