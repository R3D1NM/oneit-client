import React, {useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAtom, useAtomValue} from 'jotai';
import {isLoginAtom} from '@/api/auth';
import logoImage from '@/assets/images/logo.svg';
import mypageIcon from '@/assets/images/icon_mypage.svg';
import backIcon from '@/assets/images/icon_back.svg';
import notifIconLine from '@/assets/images/majesticons_bell-line.svg';
import notifIconColor from '@/assets/images/majesticons_bell-color.svg';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {query} from 'firebase/database';
import {fetchNotifications, notificationAtom} from '@/api/notification';
import {useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import NotifiCard from '@/components/common/NotifiCard';
import {Notif} from '@/lib/types';
import {ArrowDownSquare} from 'lucide-react';
import SearchIcon from '@/assets/images/search.png';
import BombIcon from '@/assets/images/bomb.png';
import {fetchUserInfo} from '@/api/friend';
import Countdown from 'react-countdown';
import {Button} from '@/components/common/Button';
import {toast} from 'sonner';

const TimeAttack = () => {
    const isLogin = useAtomValue(isLoginAtom);
    const [open, setOpen] = useState(false);
    const {timeAttackID} = useParams();

    const navigate = useNavigate();

    const fetchFriendInfoAPI = useQuery({
        queryKey: ['fetchFriendInfo', timeAttackID],
        queryFn: () => fetchUserInfo(timeAttackID || ''),
        enabled: isLogin,
    });

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

    const renderer = ({
        hours,
        minutes,
        seconds,
        completed,
    }: {
        hours: number;
        minutes: number;
        seconds: number;
        completed: boolean;
    }) => {
        // console.log(completed);

        if (completed) {
            return (
                <p className="text-xl font-bold">타임어택이 종료되었어요!</p>
            );
        } else {
            return (
                <p className="text-xl font-bold">
                    {hours}:{minutes}:{seconds} 후에는 닫혀요!
                </p>
            );
        }
        // if (completed) {
        //     return (
        //         <Button
        //             className="w-full"
        //             onClick={() =>
        //                 navigate(`/timeattack/${timeAttackID}/reveal`)
        //             }
        //         >
        //             확인하기
        //         </Button>
        //     );
        // } else {
        // }
    };

    const getNextBirthday = (birthDate: string) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        const nextBirthday = new Date(
            today.getFullYear(),
            birthDateObj.getMonth(),
            birthDateObj.getDate(),
        );

        if (today > nextBirthday) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        return nextBirthday;
    };

    const nextBirthday = useMemo(() => {
        return getNextBirthday(fetchFriendInfoAPI?.data?.birthDate ?? '');
    }, [fetchFriendInfoAPI?.data?.birthDate]);

    const shouldShowCountdown = () => {
        const today = new Date();
        const timeDiff = nextBirthday.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // console.log(daysDiff);

        return daysDiff === 7 || daysDiff === 3 || daysDiff === 1;
    };

    useEffect(() => {
        if (shouldShowCountdown()) {
            setOpen(true);
        }
    }, [nextBirthday]);

    return (
        <div className="bg-time-attack-main w-full h-full bg-cover bg-center">
            <header className="fixed top-0 left-0 right-0 bg-transparent flex h-14 items-center justify-between px-4 z-20 props">
                <div className="flex items-center">
                    <a href="/main" className="flex items-center">
                        <img
                            src={logoImage}
                            alt="Logo"
                            className="w-[4.75rem] h-[2.125rem] object-contain"
                        />
                    </a>
                </div>
                <div className="flex items-center gap-4 right">
                    {(fetchNotifAPI?.data?.length ?? 0) > 0 && (
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
                            <DropdownMenuContent
                                side="bottom"
                                align="end"
                                className="scrollbar-track-white scrollbar-thumb-[#ff9fe5] scrollbar-thumb-rounded-full scrollbar-thin max-h-52 overflow-y-auto"
                            >
                                {fetchNotifAPI?.data?.map(
                                    (notif: Notif, idx: number) => (
                                        <NotifiCard key={idx} notif={notif} />
                                    ),
                                )}
                                {/* {(fetchNotifAPI?.data?.length ?? 0) > 3 && (
                                <div className="flex justify-center py-2 absolute top-3/4 right-1/2">
                                    <ArrowDownSquare className="w-6 h-6" />
                                </div>
                            )} */}
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
            <div className="pt-14 flex flex-col p-4 items-center justify-center">
                <div className="flex flex-col gap-2 items-center justify-center text-center text-white">
                    {shouldShowCountdown() ? (
                        <>
                            <p className="text-xl font-semibold">
                                <span className="text-xl font-semibold text-[#FFCAF2]">
                                    {fetchFriendInfoAPI.data?.nickName}
                                </span>{' '}
                                님의 선물 취향 공개
                            </p>

                            <Countdown
                                onComplete={() => setOpen(false)}
                                // date={Date.now() + 5000}
                                date={nextBirthday}
                                renderer={renderer}
                            />
                        </>
                    ) : (
                        <>
                            <p className="text-xl font-semibold">
                                <span className="text-xl font-semibold text-[#FFCAF2]">
                                    {fetchFriendInfoAPI.data?.nickName}
                                </span>{' '}
                                님의 타임어택이 <br /> 아직 공개되지 않았어요!
                            </p>
                        </>
                    )}
                </div>
                <img src={BombIcon} className="w-52 h-52 mt-6" />
                <p className="text-xs text-white mt-2 text-center">
                    ❕타임어택은 알림 발송 후 24시간 동안만 공개됩니다❕ <br />
                    ❕타임어택은 생일 7일전, 3일전, 1일전 알림이 발송됩니다❕
                </p>

                {shouldShowCountdown() ? (
                    <Button
                        className="w-full mt-12"
                        onClick={() => {
                            if (open) {
                                navigate(`/timeattack/${timeAttackID}/reveal`);
                            } else {
                                toast.error('타임어택이 종료되었어요 :(');
                            }
                        }}
                    >
                        타임어택 확인하기
                    </Button>
                ) : (
                    <button
                        onClick={() => navigate('/curation')}
                        className="h-[7.125rem] rounded-3xl w-full mt-16 relative flex items-center  justify-center bg-[#FEF1FA]"
                    >
                        <img src={SearchIcon} />
                        <div className="flex flex-col text-[#FF4BC1]">
                            <span className="pl-6 text-left text-sm ">
                                공개전까지 취향 저격 선물 찾기!
                            </span>
                            <p className="pl-6 text-left text-lg font-bold">
                                추천 선물 목록 살펴보기
                            </p>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
};

export default TimeAttack;
