import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {fetchProduct} from '@/api/product';
import {addToBasket, fetchBasketList} from '@/api/basket';
import {Basket} from '@/lib/types';
import {useAtom, useAtomValue} from 'jotai';
import {cn} from '@/lib/utils';
import {isLoginAtom} from '@/api/auth';
import Header from '@/components/common/Header';
import logo from '@/assets/images/oneit.png';

const Product = () => {
    const {productID} = useParams();
    const [{mutate}] = useAtom(addToBasket);
    const loggedIn = useAtomValue(isLoginAtom);

    // console.log(productID);

    const basketAPI = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
        enabled: loggedIn,
    });

    const navigate = useNavigate();

    const productAPI = useQuery({
        queryKey: ['product', productID],
        queryFn: () => fetchProduct(productID || ''),
    });

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleAddToBasket = (basketID: string) => {
        if (productAPI.data) {
            mutate({basketIdx: basketID || '', selected: [productAPI.data]});
        }
    };

    if (productAPI.isLoading) return <Spinner />;
    if (productAPI.isError) return <NotFound />;

    return (
        <>
            <Header variant="back" btn_back={false} />
            <div className="giftRecommDetail scrollbar-hide">
                <div className="prd_area">
                    <div className="photo">
                        <img
                            src={productAPI.data?.thumbnailUrl}
                            alt="제품 대표 이미지"
                        />
                    </div>

                    <div className="info">
                        <div className="brand">
                            {productAPI.data?.brandName || '상품정보없음'}
                        </div>
                        <div className="name">
                            {productAPI.data?.name || '상품정보없음'}
                        </div>
                        <div className="price">
                            ₩{' '}
                            {productAPI.data?.originalPrice?.toLocaleString() ||
                                0}
                        </div>
                        <div className="options">
                            <p className="title">옵션</p>
                            <span>옵션내용</span>
                            <span>옵션내용</span>
                            <span>옵션내용</span>
                            <span>옵션내용</span>
                        </div>
                        <div className="essense">제품요약</div>
                        <div className="contents">
                            {productAPI.data?.description}
                        </div>
                        <div className="tags">
                            {productAPI.data?.keywords?.map((tag, idx) => (
                                <span key={idx}>#{tag}</span>
                            ))}
                        </div>
                    </div>

                    <div className="cart_prd scrollbar-hide">
                        <ul className="scrollbar-hide">
                            {basketAPI.data?.map((basket: Basket) => {
                                const today = new Date();
                                const dday = new Date(basket.deadline);
                                const gap = dday.getTime() - today.getTime();
                                const dDay = Math.ceil(
                                    gap / (1000 * 60 * 60 * 24),
                                );
                                return (
                                    <li>
                                        <div
                                            className="photo"
                                            onClick={() =>
                                                navigate(
                                                    `/basket/${basket.idx}`,
                                                )
                                            }
                                        >
                                            <img
                                                src={basket.imageUrl || logo}
                                                alt=""
                                            />
                                            {dDay >= 0 ? (
                                                <div className="capsule_pink">
                                                    D-
                                                    {dDay}
                                                </div>
                                            ) : (
                                                <div className="capsule_pink">
                                                    마감
                                                </div>
                                            )}
                                        </div>
                                        <div className="name text-overflow">
                                            {basket.name || '바구니 이름'}
                                        </div>
                                        <div className="btn_add_cart_area">
                                            <button
                                                className="btn_add_cart"
                                                onClick={() =>
                                                    handleAddToBasket(
                                                        basket.idx.toString(),
                                                    )
                                                }
                                            >
                                                <i></i>바구니에 추가하기
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="desc">
                        <div className="title">제품 설명</div>
                        {/* todo: product detail images */}
                        <div className="texts"></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
