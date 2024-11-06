import {fetchBasketList} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import React from 'react';
import BasketInfoCard from './components/BasketInfoCard';
import {Basket} from '@/lib/types';
import {useNavigate} from 'react-router-dom';
import Header from '@/components/common/Header';
import empty from '@/assets/images/loading.svg';

const BasketList = () => {
    const navigate = useNavigate();
    const {data, isLoading} = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
    });
    if (isLoading) return <Spinner />;
    return (
        <>
            <Header profile title="바구니 목록" variant="logo" />
            <div className="p-4 cardList w-full flex-grow scrollbar-hide">
                {data?.map((basket: Basket) => (
                    <BasketInfoCard key={basket.idx} basket={basket} />
                ))}
                {data?.length === 0 && (
                    <div className="flex flex-col justify-center align-middle mt-[4.5rem]  items-center">
                        <img src={empty} className="h-52 w-52" />
                        <p className="mt-4 text-sm text-gray-400">
                            친한 친구를 위한 선물바구니를 준비해보세요
                        </p>
                    </div>
                )}
            </div>

            <div className="btn_area_fixed px-2">
                <button
                    className="btn_pink"
                    onClick={() => navigate('/basket/create')}
                >
                    <i className="basket"></i>선물 바구니 만들기
                </button>
            </div>
        </>
    );
};

export default BasketList;
