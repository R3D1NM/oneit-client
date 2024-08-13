import {confirmInvitation, fetchBasketInfo} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import BasketCard from './components/BasketCard';
import {CalendarCheck} from 'lucide-react';
import {AspectRatio} from '@/components/ui/aspect-ratio';
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

const BasketInvitation = () => {
    const {basketID, inviteID} = useParams();
    const navigate = useNavigate();
    const isLogin = useAtomValue(isLoginAtom);
    const [error, setError] = useState(false);
    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

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
                <h3 className="text-2xl font-semibold mb-4">바구니 초대</h3>
                <div className="rounded-lg overflow-hidden shadow-sm group border-[0.5px] w-full ">
                    <AspectRatio ratio={1 / 1} className="justify-center flex">
                        <div className="relative w-full h-full flex justify-center">
                            <img
                                src={
                                    basketInfoAPI.data.imageUrl ||
                                    'https://www.oneit.gift/oneit.png'
                                }
                                alt={basketInfoAPI.data.name}
                                className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                    </AspectRatio>
                    <div className="p-4 border-t-[0.5px]">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                                {basketInfoAPI.data.name}
                            </h3>
                            <span className="text-sm text-oneit-gray  flex items-center">
                                <CalendarCheck className="inline mr-1" />
                                {
                                    basketInfoAPI.data.deadline
                                        .toString()
                                        .split('T')[0]
                                }
                            </span>
                        </div>
                        <span className="text-sm">
                            {basketInfoAPI.data.description}
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
