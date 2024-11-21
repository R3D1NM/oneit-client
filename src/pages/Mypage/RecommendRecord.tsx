import {authAtom} from '@/api/auth';
import {fetchRecommendRecord} from '@/api/chat';
import {Button} from '@/components/common/Button';
import Header from '@/components/common/Header';
import {Product, RecommendRecord as RRT} from '@/lib/types';
import {useQuery} from '@tanstack/react-query';
import {useAtomValue} from 'jotai';
import React from 'react';
import {useNavigate} from 'react-router-dom';
import angel from '@/assets/images/banner_1.gif';
import {toast} from 'sonner';

// Utility function to format the date
const formatDate = (timestamp: number): string => {
    if (timestamp === 0) return '';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const RecommendRecord = () => {
    const user = useAtomValue(authAtom);
    const navigate = useNavigate();
    const fetchRecommendRecordAPI = useQuery({
        queryKey: ['recommendRecord'],
        queryFn: () => fetchRecommendRecord(user?.idx.toString() || ''),
    });

    const handleProductClick = (product: Product) => {
        if (product.productStatus === 'ACTIVE') {
            navigate(`/product/${product.idx}`);
        } else {
            toast.error('지금은 구매할 수 없는 상품이에요');
        }
    };

    // if (fetchRecommendRecordAPI.isSuccess) {
    //     console.log(fetchRecommendRecordAPI.data);
    // }
    return (
        <>
            <Header variant="back" />
            <div className="mypage1 scrollbar-hide mb-4">
                {fetchRecommendRecordAPI?.data?.length === 0 && (
                    <div className="flex flex-col justify-center align-middle mt-[4.5rem] p-4  items-center">
                        <img src={angel} className="p-16" />

                        <p className="text-sm -mt-14 text-gray-400">
                            추천 기록이 없습니다.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/recommend')}
                            className="w-full mt-4"
                        >
                            선물 추천 받으러 가기
                        </Button>
                    </div>
                )}
                {fetchRecommendRecordAPI?.data?.map(
                    (record: RRT) =>
                        record?.result?.length > 0 && (
                            <div className="rounding_grey " key={record.chatID}>
                                <div className="basket_area ">
                                    <div>
                                        <div className="title flex flex-col">
                                            {record.name}에게 줄 선물 추천
                                            <span className="text-xs text-[#5d5d5d]">
                                                {formatDate(
                                                    record?.createdAt || 0,
                                                )}
                                            </span>
                                        </div>
                                        <div className="wish_area scrollbar-hide">
                                            <ul className="scrollbar-hide">
                                                {record?.result?.map(
                                                    (prod: Product) => (
                                                        <li key={prod.idx}>
                                                            <button
                                                                onClick={() =>
                                                                    handleProductClick(
                                                                        prod,
                                                                    )
                                                                }
                                                            >
                                                                <img
                                                                    src={
                                                                        prod.thumbnailUrl
                                                                    }
                                                                    alt=""
                                                                    className="h-20 w-20 rounded-xl"
                                                                />
                                                                <p className="text-overflow-one text-sm text-[#5d5d5d] text-center">
                                                                    {prod.name}
                                                                </p>
                                                            </button>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ),
                )}
            </div>
        </>
    );
};

export default RecommendRecord;
