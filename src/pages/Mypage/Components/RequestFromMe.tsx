import {cancelFriendRequest} from '@/api/friend';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Friend} from '@/lib/types';
import {useMutation} from '@tanstack/react-query';
import {UserCircle2} from 'lucide-react';
import React from 'react';
import {toast} from 'sonner';

interface RequestedFriend {
    requestIdx: number;
    fromUser: Friend;
    requestDate: Date;
}

const RequestFromMe = (props: {friend: RequestedFriend}) => {
    const {friend} = props;

    const cancelRequestAPI = useMutation({
        mutationFn: () =>
            cancelFriendRequest(
                friend.fromUser.idx.toString() || '',
                friend.requestIdx.toString() || '',
            ),
        onSuccess: () => {
            toast.success('친구 요청을 취소했습니다.');
            window.location.reload();
        },
    });

    const handleCancel = async () => {
        cancelRequestAPI.mutate();
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
            <Button className="" onClick={handleCancel}>
                취소하기
            </Button>
        </div>
    );
};

export default RequestFromMe;
