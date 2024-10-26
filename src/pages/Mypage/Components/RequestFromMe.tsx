import {cancelFriendRequest} from '@/api/friend';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Friend} from '@/lib/types';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {UserCircle2} from 'lucide-react';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import logo from '@/assets/images/oneit.png';

interface RequestedFriend {
    requestIdx: number;
    fromUser: Friend;
    requestDate: Date;
}

const RequestFromMe = (props: {friend: RequestedFriend}) => {
    const {friend} = props;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const cancelRequestAPI = useMutation({
        mutationFn: () =>
            cancelFriendRequest(
                friend.fromUser.idx.toString() || '',
                friend.requestIdx.toString() || '',
            ),
        onSuccess: () => {
            toast.success('친구 요청을 취소했습니다.');
            queryClient.setQueryData(
                ['friendRequestListFromMe'],
                (old: RequestedFriend[]) =>
                    old.filter(
                        (item) => item.fromUser.idx !== friend.fromUser.idx,
                    ),
            );
        },
    });

    const handleCancel = async () => {
        cancelRequestAPI.mutate();
    };

    return (
        <>
            <div className="picture">
                <img
                    src={friend.fromUser.profileImg || logo}
                    alt="프로필 이미지"
                    className="w-ful h-full object-cover rounded-full"
                />
            </div>
            <div className="info">
                <div className="name">{friend?.fromUser?.nickName}</div>
                <div className="birth">
                    <i></i>
                    <span>생일</span>
                    <span>{friend?.fromUser?.birthDate?.toString()}</span>
                </div>
            </div>
            <div className="icons">
                {/* <button className="btn_timer active"></button> */}
                <button
                    className="btn_more"
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                ></button>
                {isOpen && (
                    <div className="overlay">
                        <button
                            className="profile"
                            onClick={() =>
                                navigate('/user/' + friend.fromUser.idx)
                            }
                        >
                            <i></i>프로필보기
                        </button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="trash">
                                    <i></i>취소하기
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogTitle className="hidden" />
                                <AlertDialogHeader>
                                    친구 신청을 취소할까요?
                                </AlertDialogHeader>
                                <AlertDialogDescription className="text-center">
                                    나중에 다시 친구 요청을 보낼 수 있어요.
                                </AlertDialogDescription>
                                <AlertDialogFooter className="flex w-full flex-row gap-2 items-center">
                                    <AlertDialogCancel className="w-full mt-0">
                                        돌아가기
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleCancel}
                                        className="w-full bg-[#ff4bc1] text-white hover:bg-[#ff4bc1]/90"
                                    >
                                        취소하기
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </>
    );
};

export default RequestFromMe;
