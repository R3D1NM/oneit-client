import {fetchBasketInfo, fetchBasketProducts} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../NotFound';
import {Button} from '@/components/ui/button';
import {ArrowUp, Heart} from 'lucide-react';
import {Participant, Product} from '@/lib/types';
import BasketProductCard from './components/BasketProductCard';
import BasketInfoCard from './components/BasketInfoCard';
import {useAtomValue} from 'jotai';
import {authAtom, isLoginAtom} from '@/api/auth';

const SharedBasket = () => {
    const {basketID} = useParams();
    const navigate = useNavigate();
    const isLoggedIn = useAtomValue(isLoginAtom);
    const user = useAtomValue(authAtom);
    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    const basketProductAPI = useQuery({
        queryKey: ['basket', basketID, 'products'],
        queryFn: () => fetchBasketProducts(basketID || ''),
    });

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    if (
        isLoggedIn &&
        basketInfoAPI.data?.participants?.find(
            (p: Participant) => p.userIdx == user?.idx,
        )
    ) {
        navigate(`/basket/${basketID}`);
    }
    if (basketInfoAPI.isLoading) return <Spinner />;
    if (basketInfoAPI.isError) return <NotFound />;

    return (
        <>
            <div className="w-full pb-5">
                {basketInfoAPI.data?.accessStatus == 'PUBLIC' && (
                    <>
                        <div className="flex py-3 flex-wrap items-center justify-end">
                            <div className="flex">
                                <Button variant="ghost" size="icon">
                                    <Heart />
                                </Button>
                            </div>
                        </div>

                        <BasketInfoCard
                            basket={basketInfoAPI.data}
                            className="overflow-hidden  group  w-full my-2 "
                        />
                        <div className="p-1 w-full text-center justify-center bg-oneit-blue flex items-center rounded-md mb-3">
                            <h3 className="text-lg font-bold align-middle">
                                상품 목록
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {basketProductAPI.data?.map((product: Product) => (
                                <BasketProductCard
                                    shared={true}
                                    key={product.idx}
                                    product={product}
                                    basketID={basketID || ''}
                                    likeCount={product.likeCount || 0}
                                    voteStatus={product.voteStatus || 'NONE'}
                                />
                            ))}
                        </div>
                        <div className="flex w-full justify-center flex-col gap-1">
                            {basketProductAPI.data?.length == 0 && (
                                <div className="flex justify-center text-center">
                                    <p>아직 선물이 담겨있지 않아요</p>
                                </div>
                            )}
                            {!isLoggedIn && (
                                <div
                                    className="rounded-lg overflow-hidden shadow-sm py-1 flex items-center bg-kakao-yellow justify-center hover:bg-kakao-yellow/90 text-center"
                                    onClick={(e) =>
                                        navigate(
                                            `/login?redirect=${window.location.pathname}`,
                                        )
                                    }
                                >
                                    카카오 로그인하고 상품 추가하기
                                </div>
                            )}
                            {/* if not one of participants, */}
                            {isLoggedIn &&
                                !basketInfoAPI.data?.participants?.find(
                                    (p: Participant) => p.userIdx == user?.idx,
                                ) && (
                                    <div
                                        className="rounded-lg overflow-hidden shadow-sm py-1 flex items-center bg-oneit-blue justify-center hover:bg-oneit-blue/90 text-center"
                                        onClick={(e) =>
                                            navigate(
                                                `/login?redirect=${window.location.pathname}`,
                                            )
                                        }
                                    >
                                        카카오 로그인하고 상품 추가하기
                                    </div>
                                )}
                        </div>
                    </>
                )}
            </div>
            <Button
                className="fixed bottom-16 right-0 px-3 py-6 rounded-full shadow-lg m-1"
                onClick={scrollToTop}
            >
                <ArrowUp />
            </Button>
        </>
    );
};

export default SharedBasket;
