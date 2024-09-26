import {acceptFriend, rejectFriend} from '@/api/friend';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Friend} from '@/lib/types';
import {useMutation} from '@tanstack/react-query';
import {UserCircle2} from 'lucide-react';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
interface RequestedFriend {
    requestIdx: number;
    fromUser: Friend;
    requestDate: Date;
}

const RequestToMe = (props: {friend: RequestedFriend}) => {
    const {friend} = props;
    const [isDone, setisDone] = useState(false);
    const navigate = useNavigate();

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
        window.location.reload();
    };

    const handleDeny = async () => {
        rejectFriendAPI.mutate();
        setisDone(true);
        toast.success('친구 요청을 거절했습니다.');
        window.location.reload();
    };

    return (
        <div className="py-3 w-full border-t-[1px] flex gap-1 justify-between items-center">
            <div className="flex gap-2 items-center">
                <Avatar className="w-14 h-14">
                    <AvatarImage src={friend.fromUser.profileImg} />
                    <AvatarFallback>
                        <UserCircle2 />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h5>{friend.fromUser.nickName}</h5>
                    {/* <span className="text-sm text-oneit-gray">
                        요청일: {friend.requestDate.toLocaleDateString()}
                    </span> */}
                </div>
            </div>
            {isDone == false && (
                <div className="flex gap-2">
                    <Button
                        className="bg-oneit-blue hover:bg-oneit-blue/90"
                        onClick={handleAccept}
                    >
                        수락하기
                    </Button>
                    <Button onClick={handleDeny}>거절하기</Button>
                </div>
            )}
        </div>
    );
};

export default RequestToMe;
