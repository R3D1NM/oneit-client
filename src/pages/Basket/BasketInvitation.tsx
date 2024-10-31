import {confirmInvitation, fetchBasketInfo} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import {useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';

import {useState} from 'react';
import NotFound from '../NotFound';
import BasketInfoCard from './components/BasketInfoCard';
import Header from '@/components/common/Header';
import {Button} from '@/components/common/Button';
import logo from '@/assets/images/oneit.png';
import {Participant} from '@/lib/types';

const BasketInvitation = () => {
    const {basketID, inviteID} = useParams();
    const navigate = useNavigate();
    const isLogin = useAtomValue(isLoginAtom);
    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    const confirmAPI = useMutation({
        mutationFn: () => confirmInvitation(inviteID || ''),
        onSuccess: (data) => {
            navigate(`/basket/${basketID}`);
        },
    });

    if (basketInfoAPI.error) {
        console.log(basketInfoAPI.error);
    }

    const handleLogin = () => {
        console.log(window.location.pathname);

        navigate('/login?redirect=' + window.location.pathname);
    };

    const handleConfirm = async () => {
        confirmAPI.mutate();
    };
    if (basketInfoAPI.isLoading) return <Spinner />;
    if (basketInfoAPI.isError) return <NotFound />;

    return (
        <>
            <Header variant="logo" />
            <main className="pt-14 px-4" role="main">
                <div className="mt-2.5">
                    <p className="text-sm">선물 바구니에 초대받았어요!</p>
                    <p className="text-2xl font-bold">
                        함께 선물을 골라볼까요?
                    </p>
                </div>
                <div className="p-2 border-[1px] rounded-md my-2 items-center align-middle">
                    <img
                        src={basketInfoAPI?.data?.imageUrl || logo}
                        className="w-full"
                    />
                    <div className="p-2 invite flex w-full justify-between">
                        <div className="flex gap-1 items-center">
                            <p className="text-xs text-white rounded-xl bg-[#ff4bc1] h-fit px-2 py-1">
                                {basketInfoAPI?.data?.dday > 0
                                    ? `D-${basketInfoAPI?.data?.dday}`
                                    : basketInfoAPI?.data?.dday === 0
                                      ? 'D-Day'
                                      : '마감'}
                                {basketInfoAPI?.data?.dday < 0
                                    ? '마감'
                                    : 'D-' + basketInfoAPI?.data?.dday}
                            </p>
                            <p className="text-lg font-semibold text-overflow-one max-w-">
                                {basketInfoAPI?.data?.name}
                            </p>
                        </div>
                        <div className="thums">
                            <ul>
                                {basketInfoAPI?.data?.participants
                                    ?.slice(0, 3)
                                    ?.map(
                                        (
                                            participant: Participant,
                                            idx: number,
                                        ) => (
                                            <li
                                                key={`friend-${participant.userIdx}`}
                                            >
                                                <img
                                                    src={
                                                        participant.profileImage ||
                                                        logo
                                                    }
                                                />
                                            </li>
                                        ),
                                    )}
                                {basketInfoAPI?.data?.participants!.length >
                                    3 && (
                                    <li>
                                        +
                                        {basketInfoAPI?.data?.participants!
                                            .length - 3}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="text-sm text-[#5d5d5d] px-2">
                        <span>
                            {basketInfoAPI?.data?.participants?.length || 0}명의
                            친구들이 선물을 고르고 있어요!
                        </span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 w-full">
                    {!isLogin && (
                        <Button
                            className="w-full bg-kakao-yellow hover:bg-kakao-yellow/90"
                            onClick={handleLogin}
                        >
                            카카오 로그인하고 초대 수락하기
                        </Button>
                    )}
                    {isLogin && (
                        <Button
                            className="w-full bg-oneit-blue hover:bg-oneit-blue/90"
                            onClick={handleConfirm}
                        >
                            초대 수락하기
                        </Button>
                    )}
                    <Button className="w-full" variant="border">
                        메인으로
                    </Button>
                </div>
            </main>
            {/* <div className="flex flex-col justify-center w-full items-center">
                <h3 className="text-2xl font-semibold mb-2">바구니 초대</h3>
                <BasketInfoCard
                    basket={basketInfoAPI.data}
                    className="rounded-lg overflow-hidden shadow-md group  w-full my-2 border-[0.5px]"
                />
                <div className="flex flex-col gap-2 mt-2 w-full">
                    {!isLogin && (
                        <Button
                            className="w-full bg-kakao-yellow hover:bg-kakao-yellow/90"
                            onClick={handleLogin}
                        >
                            카카오 로그인하고 초대 수락하기
                        </Button>
                    )}
                    {isLogin && (
                        <Button
                            className="w-full bg-oneit-blue hover:bg-oneit-blue/90"
                            onClick={handleConfirm}
                        >
                            초대 수락하기
                        </Button>
                    )}
                    <Button className="w-full">메인으로</Button>
                </div>
            </div> */}
        </>
    );
};

export default BasketInvitation;
