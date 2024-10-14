import {authAtom, logout} from '@/api/auth';

import {Button} from '@/components/common/Button';
import {useAtomValue} from 'jotai';
import {User2Icon, UserIcon} from 'lucide-react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import profileButtonSvg from '@/assets/profile_button.svg';
import Header from '@/components/common/Header';

const Mypage = () => {
    const navigate = useNavigate();
    const user = useAtomValue(authAtom);
    const handleLogout = async () => {
        await logout();
    };

    return (
        <>
            <Header variant="back" />
            <main className="pt-14" role="main">
                <div className="profile px-4">
                    <div className="round_box h-[5.5rem] px-3 flex items-center border border-[#e7e7e7] rounded-[1.5rem] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.15)]">
                        <div className="img w-16 h-16 rounded-full overflow-hidden relative">
                            <img
                                src={
                                    user?.profileImgFromKakao ||
                                    profileButtonSvg
                                }
                                alt="Profile"
                                className="absolute w-full h-full object-cover"
                            />
                        </div>
                        <div className="nickname font-bold ml-3">
                            {user?.nickname || '닉네임'}
                        </div>
                        <button
                            className="btn_logout ml-auto w-[5.0625rem] h-[2.125rem] flex justify-center items-center bg-[#f01299] text-white text-sm font-bold rounded-lg"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </main>
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
