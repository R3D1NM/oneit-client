import {authAtom, logout, userWithdrawal} from '@/api/auth';

import {Button} from '@/components/common/Button';
import {useAtomValue} from 'jotai';
import {User2Icon, UserIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import profileButtonSvg from '@/assets/images/profile_button.svg';
import Header from '@/components/common/Header';
import {useMutation, useQuery} from '@tanstack/react-query';
import {fetchBasketList} from '@/api/basket';
import {Basket} from '@/lib/types';
import logo from '@/assets/images/oneit.png';
import {fetchFriendList} from '@/api/friend';
import {toast} from 'sonner';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from '@/components/ui/dialog';

const Mypage = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const user = useAtomValue(authAtom);
    const handleLogout = async () => {
        await logout();
    };

    const basketListAPI = useQuery({
        queryKey: ['basket'],
        queryFn: () => fetchBasketList(),
    });

    const friendListAPI = useQuery({
        queryKey: ['friend'],
        queryFn: () => fetchFriendList(),
    });

    const withdrawAPI = useMutation({
        mutationKey: ['withdraw'],
        mutationFn: () => userWithdrawal(),
        onSuccess: () => {
            toast('회원 탈퇴가 완료되었습니다');
            localStorage.removeItem('token');
            navigate('/main');
        },
    });

    const handleWithdraw = () => {
        withdrawAPI.mutate();
    };

    const handleNotyet = () => {
        toast('아직 준비 중인 기능이에요');
    };

    return (
        <>
            <Header variant="back" />
            <div className="mypage1">
                <div className="rounding_grey">
                    <div className="nickname_area">
                        <div className="picture">
                            <img
                                src={user?.profileImg || logo}
                                alt="사용자 대표 이미지"
                            />
                        </div>
                        <div className="name">{user?.nickname}</div>
                        <button
                            className="self-center btn_logout ml-auto w-[5.0625rem] h-[2.125rem] flex justify-center items-center bg-[#f01299] text-white text-sm font-bold rounded-lg"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                        <button
                            className="btn_pencil2"
                            onClick={() => navigate('/mypage/edit')}
                        ></button>
                    </div>
                    {/* <div className="wish_area">
                        <div className="title">위시아이템</div>
                        <ul>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                    </div> */}
                </div>
                <div className="rounding_grey ">
                    <div className="basket_area ">
                        <div className="title">현재 참여중인 바구니</div>
                        <div className="wish_area scrollbar-hide">
                            <ul className="scrollbar-hide">
                                {basketListAPI.data?.map((basket: Basket) => (
                                    <li key={basket.idx}>
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/basket/${basket.idx}`,
                                                )
                                            }
                                        >
                                            <img
                                                src={basket.imageUrl || logo}
                                                alt=""
                                                className="h-20 w-20 rounded-xl"
                                            />
                                            <p className="text-overflow-one text-sm text-[#5d5d5d] text-center">
                                                {basket.name}
                                            </p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="nav">
                    <ul>
                        <li>
                            <button onClick={() => navigate('/friends')}>
                                친구 목록
                                <em>{friendListAPI?.data?.length || 0}</em>
                            </button>
                        </li>
                        {/* <li>
                            <button onClick={handleNotyet}>
                                받은 선물바구니
                            </button>
                        </li> */}
                        <li>
                            <button onClick={handleNotyet}>
                                추천 받았던 상품
                            </button>
                        </li>
                        <li>
                            <button onClick={() => navigate('/basket')}>
                                참여 바구니 목록
                            </button>
                        </li>
                        <li>
                            <button onClick={handleNotyet}>타임어택</button>
                        </li>
                    </ul>
                </div>
                <Dialog onOpenChange={setOpen} open={open}>
                    <DialogTrigger>
                        <div className="flex justify-center text-center absolute bottom-1 right-1/2 translate-x-4 text-[#5d5d5d]">
                            <Button variant="underline" className="text-xs">
                                회원 탈퇴
                            </Button>
                        </div>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>회원 탈퇴</DialogHeader>
                        <p className="text-center">
                            ONE!T 회원을 탈퇴하시겠습니까? <br />
                            언제든 다시 가입하실 수 있습니다.
                        </p>
                        <div className="w-full flex gap-2">
                            <Button
                                variant="border"
                                className="w-full"
                                onClick={() => setOpen(false)}
                            >
                                취소
                            </Button>

                            <Button
                                variant="disabled"
                                className="w-full"
                                onClick={handleWithdraw}
                            >
                                탈퇴
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
    {
        /* <div className="flex flex-col w-full justify-center items-center">
                <div
                    className="border-y-[1px] w-full text-start p-2 cursor-pointer hover:bg-oneit-gray/10"
                    onClick={() => navigate('/friends')}
                >
                    친구 목록
                </div>
            </div> */
    }
    {
        /* </div> */
    }
    // );
};

export default Mypage;
