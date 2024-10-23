import {Key, useState} from 'react';
import {useAtomValue} from 'jotai';
import {authAtom, isLoginAtom} from '@/api/auth';
import BasketInfoCard from '../Basket/components/BasketInfoCard';
import {Link, useNavigate} from 'react-router-dom';

import Header from '@/components/common/Header';
import banner from '@/assets/banner.png';

import banner1 from '@/assets/banner_1.gif';
import banner2 from '@/assets/banner_2.gif';
import banner3 from '@/assets/banner_3.svg';

const Main = () => {
    const isLogin = useAtomValue(isLoginAtom);

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    // console.log(token);

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
                        onClick={() => setIsModalOpen(true)}
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
                        onClick={() => setIsModalOpen(true)}
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

                <div
                    className="mt-7 w-full relative"
                    onClick={() => {
                        if (!isLogin) navigate('/login');
                        else
                            window.location.href =
                                'https://www.instagram.com/oneit.gift/';
                    }}
                >
                    <img
                        src={banner}
                        alt="Promotion Banner"
                        className="w-full object-contain"
                    />
                    <div className="absolute inset-0 flex flex-col justify-center items-start p-6 text-white">
                        <h2 className="text-lg font-bold">
                            ONE!T 10월 31일 정식 출시 예정
                            <br />
                            {isLogin
                                ? '인스타그램 둘러보고 출시 소식 받기'
                                : '회원가입하고 출시 알림 받기'}
                        </h2>
                    </div>
                </div>
            </main>
            {isModalOpen && (
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
            )}
        </>
    );
};

export default Main;
