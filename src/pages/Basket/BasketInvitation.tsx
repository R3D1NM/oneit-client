import {confirmInvitation, fetchBasketInfo} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import {useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';
import {Button} from '@/components/ui/button';
import {useState} from 'react';
import NotFound from '../NotFound';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import BasketInfoCard from './components/BasketInfoCard';

const BasketInvitation = () => {
    const {basketID, inviteID} = useParams();
    const navigate = useNavigate();
    const isLogin = useAtomValue(isLoginAtom);
    const [error, setError] = useState(false);
    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    if (basketInfoAPI.error?.toString() === '3009') {
        return (
            <div className="w-full pb-5 justify-center content-center text-center flex flex-col gap-2">
                <p>바구니 참여자가 아닙니다.</p>
                <Button
                    onClick={() => {
                        navigate('/');
                    }}
                    className="w-fit mx-auto"
                >
                    메인으로
                </Button>
            </div>
        );
    }

    const handleLogin = () => {
        console.log(window.location.pathname);

        navigate('/login?redirect=' + window.location.pathname);
    };

    const handleConfirm = async () => {
        confirmInvitation(inviteID || '')
            .then((res) => {
                console.log(res);
                if (res) {
                    navigate(`/basket/${basketID}`);
                }
            })
            .catch((err) => {
                console.log(err);
                setError(true);
            });
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
            {error && (
                <Dialog open={error} onOpenChange={setError}>
                    <DialogContent
                        className="sm:max-w-[425px]"
                        onInteractOutside={(e: {
                            preventDefault: () => void;
                        }) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>문제 발생</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            문제가 발생했습니다. 다시 시도해주세요.
                        </DialogDescription>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setError(false);
                                    navigate('/');
                                }}
                            >
                                메인으로
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => {
                                    setError(false);
                                }}
                            >
                                다시시도
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default BasketInvitation;
