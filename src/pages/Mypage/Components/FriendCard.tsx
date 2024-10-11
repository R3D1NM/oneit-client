import {deleteFriend} from '@/api/friend';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Friend} from '@/lib/types';
import {useMutation} from '@tanstack/react-query';
import {CircleEllipsis, Trash2, User, UserCircle2} from 'lucide-react';
import React from 'react';

const FriendCard = (props: {friend: Friend}) => {
    const {friend} = props;

    const deleteFriendAPI = useMutation({
        mutationFn: () => deleteFriend(friend.idx.toString() || ''),
    });

    const handleDeleteFriend = () => {
        deleteFriendAPI.mutate();
        window.location.reload();
    };

    return (
        <div className="py-3 w-full border-t-[1px] flex gap-1 justify-between items-center">
            <div className="flex gap-2 items-center">
                <Avatar className="w-14 h-14">
                    <AvatarImage src={friend.profileImg} />
                    <AvatarFallback>
                        <UserCircle2 />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h5>{friend.nickName}</h5>
                    <span className="text-sm text-oneit-gray">
                        {/* {friend?.birthDate.toDateString()} */}
                    </span>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={null} size="icon">
                        <CircleEllipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-30" side="bottom" align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <User className="mr-2" />
                            <span>프로필 보기</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDeleteFriend}>
                            <Trash2 className="mr-2" />
                            <span>친구 끊기</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default FriendCard;
