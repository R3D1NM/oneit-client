import {Key, useCallback, useMemo, useState} from 'react';
import {useAtomValue} from 'jotai';
import {authAtom, isLoginAtom} from '@/api/auth';
import BasketInfoCard from '../Basket/components/BasketInfoCard';
import {Link, useNavigate} from 'react-router-dom';

import Header from '@/components/common/Header';
import banner from '@/assets/images/banner.png';
import Countdown from 'react-countdown';

import banner1 from '@/assets/images/banner_1.gif';
import banner2 from '@/assets/images/banner_2.gif';
import banner3 from '@/assets/images/banner_3.gif';
import {useQuery} from '@tanstack/react-query';
import {fectchBirthdayList} from '@/api/friend';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import {Friend} from '@/lib/types';

const FriendBanner = ({friend}: {friend: Friend}) => {
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
        return getNextBirthday(friend.birthDate ?? '');
    }, [friend.birthDate]);

    const renderer = ({
        days,
        hours,
        minutes,
        seconds,
        completed,
    }: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        completed: boolean;
    }) => {
        // console.log(completed);

        if (completed) {
            return <span className="">에요! 🎉</span>;
        } else {
            if (days > 0 && days <= 7) {
                return (
                    <>
                        {' '}
                        <span className="bg-white/70 text-[#ff4bc1] px-1 rounded-md">
                            {days}일
                        </span>{' '}
                        남았어요!
                    </>
                );
            } else if (days == 364) {
                return <span className="">에요! 🎉</span>;
            }
            return (
                <>
                    {' '}
                    <span className="bg-white/70 text-[#ff4bc1] px-1 rounded-md">
                        {hours}시간 {minutes}분
                    </span>{' '}
                    남았어요!
                </>
            );
        }
    };

    return (
        <h2 className="text-lg font-bold text-white">
            <span className="bg-white/70 text-[#ff4bc1] px-1 rounded-md">
                {friend.name}
            </span>{' '}
            님의 생일이
            <Countdown
                // onComplete={() => setOpen(false)}
                // date={Date.now() + 5000}
                date={nextBirthday}
                renderer={renderer}
            />
            <br />
            <p className="text-lg font-bold text-white">
                {/* <span className="bg-white/70 text-[#000] px-1 rounded-md"></span>{' '} */}
                <span className="bg-white/70 text-[#ff4bc1] px-1 rounded-md">
                    타임어택
                </span>{' '}
                바로가기
            </p>
        </h2>
    );
};

const Main = () => {
    const isLogin = useAtomValue(isLoginAtom);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [autoPlay, setAutoPlay] = useState(true);
    const handleInteractionStart = useCallback(() => setAutoPlay(false), []);
    const handleInteractionEnd = useCallback(() => setAutoPlay(true), []);
    // console.log(token);

    const fetchBirthdayFriendListAPI = useQuery({
        queryKey: ['BrithDayFriendList'],
        queryFn: () => fectchBirthdayList(),
        enabled: isLogin,
    });

    return (
        <>
            <Header variant="logo" />
            <main className="pt-14">
                <div className="flex flex-col gap-6 p-4">
                    <button
                        onClick={() => navigate('/recommend')}
                        className="h-[7.125rem] rounded-3xl w-full relative flex flex-col justify-center bg-[#fff0f0]"
                    >
                        <div className="pl-6 text-left text-sm text-[#5d5d5d] mb-2">
                            선물 요정이 알려드려요!
                        </div>
                        <div className="pl-6 text-left text-lg font-bold">
                            선물 요정에게
                            <br />
                            선물 추천을 받아보세요
                        </div>
                        <img
                            src={banner1}
                            alt="Banner 1"
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-[4.625rem] h-[4.625rem] object-contain"
                        />
                    </button>

                    <button
                        onClick={() => navigate('/basket')}
                        className="h-[7.125rem] rounded-3xl w-full relative flex flex-col justify-center bg-[#fef1fa]"
                    >
                        <div className="pl-6 text-left text-sm text-[#5d5d5d] mb-2">
                            내 위시템을 모아 모아~
                        </div>
                        <div className="pl-6 text-left text-lg font-bold">
                            바구니에 선물을 담고
                            <br />
                            다같이 골라볼까요?
                        </div>
                        <img
                            src={banner2}
                            alt="Banner 2"
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-[4.625rem] h-[4.625rem] object-contain"
                        />
                    </button>

                    <button
                        onClick={() => navigate('/curation')}
                        className="h-[7.125rem] rounded-3xl w-full relative flex flex-col justify-center bg-[#eee3ff]"
                    >
                        <div className="pl-6 text-left text-sm text-[#5d5d5d] mb-2">
                            친구를 위한 다양한 추천 선물 !
                        </div>
                        <div className="pl-6 text-left text-lg font-bold">
                            ONE!T이 추천하는
                            <br />
                            선물 목록 살펴 보기
                        </div>
                        <img
                            src={banner3}
                            alt="Banner 3"
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-[4.625rem] h-[4.625rem] object-contain"
                        />
                    </button>
                </div>

                <div className="mt-7 w-full relative">
                    <img
                        src={banner}
                        alt="Promotion Banner"
                        className="w-full object-contain"
                    />
                    {!isLogin ||
                    fetchBirthdayFriendListAPI?.data?.length === 0 ? (
                        <div
                            className="absolute inset-0 flex flex-col justify-center items-start p-6 text-white"
                            onClick={() => {
                                if (!isLogin) navigate('/login');
                                else
                                    window.location.href =
                                        'https://www.instagram.com/oneit.gift/';
                            }}
                        >
                            <h2 className="text-lg font-bold text-white">
                                <span className="bg-white/70 text-[#ff4bc1] px-1 rounded-md">
                                    ONE!T
                                </span>{' '}
                                오픈 기념 이벤트 🎉
                                <br />
                                {isLogin ? (
                                    <p className="text-lg font-bold text-white">
                                        인스타그램에서 참여하고{' '}
                                        {/* <span className="bg-white/70 text-[#000] px-1 rounded-md"></span>{' '} */}
                                        <span className="bg-white/70 text-[#ff4bc1] px-1 rounded-md">
                                            선물
                                        </span>{' '}
                                        받기
                                    </p>
                                ) : (
                                    <p className="text-lg font-bold text-white">
                                        회원가입하고 참여하기
                                    </p>
                                )}
                            </h2>
                        </div>
                    ) : (
                        <Carousel
                            className="absolute inset-0 flex flex-col justify-center items-start  text-white"
                            opts={{loop: true}}
                            autoplay={autoPlay}
                            autoplayInterval={2500}
                            onMouseDown={handleInteractionStart}
                            onMouseUp={handleInteractionEnd}
                            onTouchStart={handleInteractionStart}
                            onTouchEnd={handleInteractionEnd}
                        >
                            <CarouselContent className="w-full m-0">
                                {fetchBirthdayFriendListAPI.data?.map(
                                    (friend: Friend, index: number) => (
                                        <CarouselItem
                                            key={index}
                                            className="w-full flex flex-col  justify-center"
                                            onClick={() => {
                                                navigate('/timeattack');
                                            }}
                                        >
                                            <FriendBanner friend={friend} />
                                        </CarouselItem>
                                    ),
                                )}
                            </CarouselContent>
                        </Carousel>
                    )}
                </div>
            </main>
            {/* {isModalOpen && (
                <div
                    className="absolute inset-0 flex items-center justify-center"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-25 z-10"></div>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl p-6 z-20 max-w-[20.5rem] w-full flex flex-col justify-center"
                    >
                        <p className="text-left text-[#5d5d5d]">
                            아직 공사 중이에요!
                        </p>
                        <div className="text-lg font-bold mt-2 mb-5 text-left">
                            10월 31일 출시를 목표로
                            <br />
                            열심히 개발하고 있어요!
                        </div>
                        {isLogin ? (
                            <a
                                href="https://www.instagram.com/oneit.gift/"
                                className="bg-[#000000] text-white w-full h-[2.5625rem] text-sm font-bold flex justify-center items-center"
                            >
                                인스타그램 둘러보고 ONE!T 소식 받기
                            </a>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-[#fee500] w-full h-[2.5625rem] text-sm font-bold flex justify-center items-center"
                            >
                                카카오 회원가입하고 출시 알림 받기
                            </button>
                        )}
                    </div>
                </div>
            )} */}
        </>
    );
};

export default Main;
