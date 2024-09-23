import {confirmInvitation, fetchBasketInfo} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import {useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import NotFound from '../NotFound';
import BasketInfoCard from './components/BasketInfoCard';

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
            <div className="flex flex-col justify-center w-full items-center">
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
            </div>
        </>
    );
};

export default BasketInvitation;
