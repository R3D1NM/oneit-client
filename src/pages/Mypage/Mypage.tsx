import {authAtom, logout} from '@/api/auth';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {useAtomValue} from 'jotai';
import {User2Icon, UserIcon} from 'lucide-react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const Mypage = () => {
    const navigate = useNavigate();
    const user = useAtomValue(authAtom);
    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="py-3 w-full flex flex-col gap-2">
            <div className="flex w-full">
                <div className="flex w-full align-middle justify-between items-center border-[0.5px] rounded-md p-2">
                    <div className="flex items-center">
                        <Avatar className="w-16 border-2 h-16">
                            <AvatarImage
                                src={user?.profileImgFromKakao}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-secondary">
                                <User2Icon className="w-16 h-16" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex">
                            <UserIcon className="inline" />
                            <span>{user?.nickname}</span>
                        </div>
                    </div>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>
            </div>

            <div className="flex flex-col w-full justify-center items-center">
                <div
                    className="border-y-[1px] w-full text-start p-2 cursor-pointer hover:bg-oneit-gray/10"
                    onClick={() => navigate('/friends')}
                >
                    친구 목록
                </div>
            </div>
        </div>
    );
};

export default Mypage;
