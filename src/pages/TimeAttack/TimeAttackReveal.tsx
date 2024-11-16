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
import {useMutation, useQuery} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import NotifiCard from '@/components/common/NotifiCard';
import {Notif, Product} from '@/lib/types';
import {Button} from '@/components/common/Button';
import {toast} from 'sonner';
import FrontCard from '@/assets/images/time_attack_card_front.png';
import {fetchUserInfo, timeAttackWishRamdom} from '@/api/friend';
import ReactCardFlip from 'react-card-flip';
import giftIcon from '@/assets/images/tabler_gift.svg';
import logo from '@/assets/images/oneit.png';

const TimeAttackReveal = () => {
    const isLogin = useAtomValue(isLoginAtom);
    const [isBack, setIsBack] = useState(true);
    const [prevProduct, setPrevProduct] = useState<null | Product>(null);
    const [isError, setIsError] = useState(false);
    const {timeAttackID} = useParams();

    const navigate = useNavigate();

    const fetchRandomWishAPI = useMutation({
        mutationKey: ['fetchRandomWish'],
        mutationFn: (prevIdx?: number) =>
            timeAttackWishRamdom(timeAttackID || '', prevIdx),
    });

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

    useEffect(() => {
        if (prevProduct?.idx !== -1) {
            fetchRandomWishAPI
                .mutateAsync(prevProduct?.idx)
                .then((res) => {
                    setPrevProduct(res);
                    setIsBack(!isBack);
                })
                .catch((err) => {
                    console.log('[TIMEATTACK] Mo Data Available', err);
                    toast.error('더이상 다른 선물이 없어요');
                    setIsBack(true);
                    setIsError(true);
                });
        }
    }, []);

    const handleNewWish = () => {
        if (isError && isBack) {
            toast.error('더이상 다른 선물이 없어요');
            return;
        }

        if (!isBack) {
            setIsBack(!isBack);
            return;
        }

        fetchRandomWishAPI
            .mutateAsync(prevProduct?.idx)
            .then((res) => {
                setPrevProduct(res);
                setIsBack(!isBack);
            })
            .catch((err) => {
                setIsBack(false);
                // toast.error('새로운 선물을 가져오는 중 오류가 발생했습니다.', {
                //     action: {
                //         label: '다시 시도',
                //         onClick: () => {
                //             handleNewWish();
                //         },
                //     },
                // });
            });
    };

    return (
        <div className="bg-time-attack-sub bg-main bg-cover w-full h-full">
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
            <div className="pt-2 flex flex-col p-4 items-center justify-around gap-4 ">
                <div className="flex flex-col gap-2 items-center justify-center text-center ">
                    <p className="font-semibold text-xl">
                        <span className="text-[#FF4BC1]">
                            {fetchFriendInfoAPI?.data?.nickName || '친구'}
                        </span>{' '}
                        님의 취향을 공개합니다!
                    </p>
                </div>

                <ReactCardFlip isFlipped={isBack}>
                    <div
                        className="w-[292px] h-[427px] bg-white p-4  text-center flex flex-col  justify-center items-center rounded-3xl border border-[#e7e7e7] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.15)] mt-4"
                        key="front"
                        // onClick={handleNewWish}
                    >
                        {/* <img src={FrontCard} className="w-72  h-96 mt-6" /> */}
                        <div className="">
                            <div className="img mt-[1.125rem] w-[165px] h-[165px] mx-auto overflow-hidden rounded-2xl">
                                <img
                                    src={prevProduct?.thumbnailUrl || logo}
                                    alt={prevProduct?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="price_info mt-[1.125rem]">
                                <h3 className="text-lg text-[#3d3d3d] font-bold max-w-full max-h-6  mb-2 text-overflow">
                                    {prevProduct?.name}
                                </h3>
                                <p className="price mt-1.5 text-[#6d6d6d] font-bold before:content-['₩'] before:text-[#b0b0b0] before:font-bold before:inline-block">
                                    {prevProduct?.originalPrice.toLocaleString()}
                                </p>
                                <div className="desc mt-1.5 mb-1.5 w-full text-xs max-h-12 text-overflow">
                                    {prevProduct?.description}
                                </div>
                                {/* <a
                                                        href={item.productUrl}
                                                        className="btn_underline text-[#ff4bc1] underline"
                                                    >
                                                        제품 자세히 보기
                                                    </a> */}
                            </div>
                        </div>
                        <div className=" flex gap-3 items-center w-full mt-2">
                            <Button
                                className="w-full flex-1 flex justify-center items-center"
                                variant="border"
                                onClick={() =>
                                    navigate(`/product/${prevProduct?.idx}`)
                                }
                            >
                                {/* <img
                                    src={giftIcon}
                                    alt="Gift icon"
                                    className="w-6 h-6 mr-1"
                                /> */}
                                자세히 보기
                            </Button>
                            {/* <Button
                                className="w-full flex-1 flex justify-center items-center"
                                variant="border"
                                onClick={() =>
                                    navigate(`/product/${prevProduct?.idx}`)
                                }
                            >
                                <img
                                    src={giftIcon}
                                    alt="Gift icon"
                                    className="w-6 h-6 mr-1"
                                />
                                바구니에 추가하기
                            </Button> */}
                        </div>
                    </div>
                    <div
                        className="w-[292px] h-[427px] bg-time-attack-card text-center bg-center flex flex-col justify-center items-center rounded-3xl  shadow-[0px_0px_5px_0px_rgba(0,0,0,0.15)] mt-4"
                        key="back"
                        onClick={handleNewWish}
                    >
                        {/* <img src={FrontCard} className="w-full  h-full " /> */}
                    </div>
                </ReactCardFlip>

                <Button className="w-full mt-2" onClick={handleNewWish}>
                    {isBack ? '선물 보기' : '다른 선물 뽑기'}
                </Button>
            </div>
        </div>
    );
};

export default TimeAttackReveal;
