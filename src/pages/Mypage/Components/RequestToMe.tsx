import {acceptFriend, rejectFriend} from '@/api/friend';
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
import {Friend} from '@/lib/types';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {UserCircle2} from 'lucide-react';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import logo from '@/assets/images/oneit.png';
import {Button} from '@/components/common/Button';
interface RequestedFriend {
    requestIdx: number;
    fromUser: Friend;
    requestDate: Date;
}

const RequestToMe = (props: {friend: RequestedFriend}) => {
    const {friend} = props;
    const [isDone, setisDone] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const requestAcceptAPI = useMutation({
        mutationFn: () =>
            acceptFriend(
                friend.fromUser.idx.toString() || '',
                friend.requestIdx.toString() || '',
            ),
    });

    const rejectFriendAPI = useMutation({
        mutationFn: () =>
            rejectFriend(
                friend.fromUser.idx.toString() || '',
                friend.requestIdx.toString() || '',
            ),
    });

    const handleAccept = async () => {
        requestAcceptAPI.mutate();
        setisDone(true);
        toast.success('친구 요청을 수락했습니다.');
        queryClient.setQueryData(
            ['friendRequestListToMe'],
            (old: RequestedFriend[]) =>
                old.filter((item) => item.fromUser.idx !== friend.fromUser.idx),
        );
        queryClient.setQueryData(['friendList'], (old: Friend[]) => [
            ...old,
            friend.fromUser,
        ]);
    };

    const handleDeny = async () => {
        rejectFriendAPI.mutate();
        setisDone(true);
        toast.success('친구 요청을 거절했습니다.');
        queryClient.setQueryData(
            ['friendRequestListToMe'],
            (old: RequestedFriend[]) =>
                old.filter((item) => item.fromUser.idx !== friend.fromUser.idx),
        );
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
            <div className="flex gap-2 ml-16 w-16">
                <Button className="w-full h-8" onClick={() => handleAccept()}>
                    수락
                </Button>
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
                                    <i></i>거절하기
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogTitle className="hidden" />
                                <AlertDialogHeader>
                                    친구 신청을 거절할까요?
                                </AlertDialogHeader>
                                <AlertDialogDescription className="text-center">
                                    나중에 다시 친구 요청을 보낼 수 있어요.
                                </AlertDialogDescription>
                                <AlertDialogFooter className="flex w-full flex-row gap-2 items-center">
                                    <AlertDialogCancel className="w-full mt-0">
                                        취소
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeny}
                                        className="w-full bg-[#ff4bc1] text-white hover:bg-[#ff4bc1]/90"
                                    >
                                        거절
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

export default RequestToMe;
