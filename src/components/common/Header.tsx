import {useAtom, useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';
import logoImage from '@/assets/logo.svg';
import mypageIcon from '@/assets/icon_mypage.svg';
import backIcon from '@/assets/icon_back.svg';
import notifIconLine from '@/assets/majesticons_bell-line.svg';
import notifIconColor from '@/assets/majesticons_bell-color.svg';
import {useNavigate} from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {query} from 'firebase/database';
import {fetchNotifications, notificationAtom} from '@/api/notification';
import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import NotifiCard from './NotifiCard';
import {Notif} from '@/lib/types';

interface HeaderProps {
    variant: 'logo' | 'back';
}

const Header: React.FC<HeaderProps> = ({variant}) => {
    const isLogin = useAtomValue(isLoginAtom);
    const navigate = useNavigate();
    const fetchNotifAPI = useQuery({
        queryKey: ['fetchNotif'],
        queryFn: () => fetchNotifications(),
        enabled: isLogin,
    });

    const toMypage = () => {
        if (isLogin) {
            window.location.href = '/mypage';
        } else {
            window.location.href = '/login';
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white flex h-14 items-center justify-between px-4 z-20">
            <div className="flex items-center">
                {variant === 'logo' ? (
                    <a href="/main" className="flex items-center">
                        <img
                            src={logoImage}
                            alt="Logo"
                            className="w-[4.75rem] h-[2.125rem] object-contain"
                        />
                    </a>
                ) : (
                    <button onClick={handleBack} className="flex items-center">
                        <img
                            src={backIcon}
                            alt="Back"
                            className="w-6 h-6 object-contain"
                        />
                    </button>
                )}
            </div>
            <div className="flex gap-1">
                {isLogin && (fetchNotifAPI?.data?.length ?? 0) > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            {fetchNotifAPI?.data &&
                            !fetchNotifAPI?.data?.some(
                                (notif) => notif.notiStatus !== 'READ',
                            ) ? (
                                <img
                                    src={notifIconLine}
                                    alt="notification"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <img
                                    src={notifIconColor}
                                    alt="notification"
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end">
                            {fetchNotifAPI?.data?.map(
                                (notif: Notif, idx: number) => (
                                    <NotifiCard key={idx} notif={notif} />
                                ),
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <button onClick={toMypage} className="w-9 h-9">
                    <img
                        src={mypageIcon}
                        alt="My Page"
                        className="w-full h-full object-contain"
                    />
                </button>
            </div>
        </header>
    );
};

export default Header;
