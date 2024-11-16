import {fetchLikedProducts} from '@/api/product';
import Header from '@/components/common/Header';
import {Product} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useQuery} from '@tanstack/react-query';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import logo from '@/assets/images/oneit.png';

const MyBasket = () => {
    const navigate = useNavigate();
    const likedProductAPI = useQuery({
        queryKey: ['likedProduct'],
        queryFn: () => fetchLikedProducts(),
    });
    return (
        <>
            <Header
                btn_back
                setting
                variant="back"
                profile
                // title={basketInfoAPI.data?.name}
            />
            <div className="p-4 cardList scrollbar-hide">
                <p className="text-2xl font-bold ml-2 bg-gradient-to-b from-[#FF4BC1] to-[#FF4341] text-transparent bg-clip-text">
                    나의 위시리스트
                </p>
                <p className="text-xs ml-2 text-[#5d5d5d]">
                    생일이 다가오면 친구들에게 은근슬쩍 알려줄 수 있어요!
                </p>

                <div className="mt-5 rounding_border">
                    <div className="giftBox_title">
                        <div className="title">
                            <p>좋아요 목록</p>
                            <p>{likedProductAPI.data?.length}</p>
                        </div>
                    </div>

                    {likedProductAPI?.data?.length !== 0 ? (
                        <div className="mt-3 gift_list_in_basket ">
                            <ul>
                                <li className="grid-cols-2 grid gap-2">
                                    {likedProductAPI.data?.map(
                                        (product: Product) => (
                                            <div className={cn('box')}>
                                                <div className="image">
                                                    <div
                                                        className={cn('photo')}
                                                    >
                                                        <img
                                                            onClick={() =>
                                                                navigate(
                                                                    `/product/${product.idx}`,
                                                                )
                                                            }
                                                            src={
                                                                product?.thumbnailUrl ||
                                                                logo
                                                            }
                                                            alt="제품 이미지"
                                                        />
                                                    </div>
                                                </div>
                                                <a
                                                    className="pr-3"
                                                    onClick={() =>
                                                        navigate(
                                                            `/product/${product.idx}`,
                                                        )
                                                    }
                                                >
                                                    <p className="title text-overflow h-10 ">
                                                        {product.name}
                                                    </p>
                                                    <p className="price">
                                                        ₩{' '}
                                                        {product.originalPrice.toLocaleString()}
                                                    </p>
                                                    <div className="tags">
                                                        {product.displayTags
                                                            ?.slice(0, 3)
                                                            .map((tag, idx) => (
                                                                <span
                                                                    key={`${product.idx}-${idx}`}
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                    </div>
                                                </a>
                                            </div>
                                        ),
                                    )}
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <p className="text-sm text-[#5d5d5d] text-center mt-7 mb-1">
                                아직 선물 바구니가 비어있어요!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyBasket;
