import {authAtom, logout, userWithdrawal} from '@/api/auth';

import {Button} from '@/components/common/Button';
import {useAtomValue} from 'jotai';
import {Cake, CakeIcon, User2Icon, UserIcon} from 'lucide-react';
import {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import profileButtonSvg from '@/assets/images/profile_button.svg';
import Header from '@/components/common/Header';
import {useMutation, useQuery} from '@tanstack/react-query';
import {fetchBasketList} from '@/api/basket';
import {Basket} from '@/lib/types';
import logo from '@/assets/images/oneit.png';
import {fetchFriendList, fetchUserInfo, requestFriend} from '@/api/friend';
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

const User = () => {
    const navigate = useNavigate();
    const {userID} = useParams();
    // const user = useAtomValue(authAtom);
    const requestFriendAPI = useMutation({
        mutationKey: ['requestFriend'],
        mutationFn: () => requestFriend(userID || ''),
        onSuccess: () => {
            toast.success('친구 요청을 보냈습니다.');
        },
    });

    const fetchUserInfoAPI = useQuery({
        queryKey: ['user', userID],
        queryFn: () => fetchUserInfo(userID || ''),
    });

    const handleRequest = () => {
        requestFriendAPI.mutate();
    };

    return (
        <>
            <Header variant="back" />
            <div className="mypage1">
                <div className="rounding_grey">
                    <div className="nickname_area">
                        <div className="picture">
                            <img
                                src={fetchUserInfoAPI?.data?.profileImg || logo}
                                alt=""
                            />
                        </div>
                        <div className="name flex flex-col">
                            {fetchUserInfoAPI?.data?.nickName}
                            <span className="text-xs text-[#5d5d5d] flex">
                                <CakeIcon className="w-4 h-4 mr-1" />
                                {fetchUserInfoAPI?.data?.birthDate}
                            </span>
                        </div>
                        {!fetchUserInfoAPI?.data?.isFriend && (
                            <button
                                className="self-center btn_logout ml-auto w-[5.0625rem] h-[2.125rem] flex justify-center items-center bg-[#f01299] text-white text-sm font-bold rounded-lg"
                                onClick={handleRequest}
                            >
                                친구 신청
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default User;