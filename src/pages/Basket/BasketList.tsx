import {fetchBasketList} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import React from 'react';
import BasketInfoCard from './components/BasketInfoCard';
import {Basket} from '@/lib/types';
import {useNavigate} from 'react-router-dom';
import Header from '@/components/common/Header';

const BasketList = () => {
    const navigate = useNavigate();
    const {data, isLoading} = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
    });
    if (isLoading) return <Spinner />;
    return (
        <>
            <Header btn_back profile title="바구니 목록" variant="back" />
            <div className="p-4 cardList w-full flex-grow scrollbar-hide">
                {data?.map((basket: Basket) => (
                    <BasketInfoCard key={basket.idx} basket={basket} />
                ))}
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
