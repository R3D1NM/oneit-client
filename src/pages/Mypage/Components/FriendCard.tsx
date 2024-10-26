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
import React, {useState} from 'react';
import logo from '@/assets/images/oneit.png';
import {useNavigate} from 'react-router-dom';
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

const FriendCard = (props: {friend: Friend}) => {
    const {friend} = props;
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const deleteFriendAPI = useMutation({
        mutationFn: () => deleteFriend(friend.idx.toString() || ''),
    });

    const handleDeleteFriend = () => {
        deleteFriendAPI.mutate();
        window.location.reload();
    };

    return (
        <>
            <div className="picture">
                <img
                    src={friend.profileImg || logo}
                    alt="프로필 이미지"
                    className="w-ful h-full object-cover rounded-full"
                />
            </div>
            <div className="info">
                <div className="name">{friend?.nickName}</div>
                <div className="birth">
                    <i></i>
                    <span>생일</span>
                    <span>{friend?.birthDate?.toString()}</span>
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
                            onClick={() => navigate('/user/' + friend.idx)}
                        >
                            <i></i>프로필보기
                        </button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="trash">
                                    <i></i>친구 삭제
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogTitle className="hidden" />
                                <AlertDialogHeader>
                                    친구 목록에서 삭제할까요?
                                </AlertDialogHeader>
                                <AlertDialogDescription className="text-center">
                                    나중에 다시 친구 요청을 보낼 수 있어요.
                                </AlertDialogDescription>
                                <AlertDialogFooter className="flex w-full flex-row gap-2 items-center">
                                    <AlertDialogCancel className="w-full mt-0">
                                        취소
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteFriend}
                                        className="w-full bg-[#ff4bc1] text-white hover:bg-[#ff4bc1]/90"
                                    >
                                        삭제
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

export default FriendCard;
