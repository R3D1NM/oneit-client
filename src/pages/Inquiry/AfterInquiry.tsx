import {isLoginAtom} from '@/api/auth';
import {Button} from '@/components/common/Button';
import Header from '@/components/common/Header';

import {useAtomValue} from 'jotai';
import React from 'react';
import {useNavigate} from 'react-router-dom';

import image from '@/assets/images/giftBox2.svg';

const AfterInquiry = () => {
    const navigate = useNavigate();
    const isLogin = useAtomValue(isLoginAtom);

    return (
        <>
            <Header variant="logo" />
            <main className="pt-14 px-4" role="main">
                <div className="mt-2.5">
                    <p className="text-sm text-[#ff4bc1]">
                        친구들에게 선택한 결과를 보냈어요!
                    </p>
                    <p className="text-2xl font-bold">
                        친구들이 선물 고르는데 <br /> 도움이 될 거에요!
                    </p>
                </div>
                <div className="flex-col flex justify-center align-middle items-center mt-24">
                    <img src={image} alt="gift" className="p-3 h-60 " />
                </div>

                <div className="w-full mt-4 absolute bottom-0 right-0 pl-4 pr-4 mb-2">
                    <Button
                        className="w-full"
                        onClick={() => navigate('/main')}
                    >
                        메인으로
                    </Button>
                </div>
            </main>
        </>
    );

    return (
        <div className="flex flex-col content-center w-full gap-2 justify-center items-center">
            <h3 className="text-xl">감사합니다!</h3>
            <p>친구들이 선물 고르는데 도움이 될 거에요!</p>
            {/* todo: img */}
            <img
                src="https://via.placeholder.com/400"
                alt="gift"
                className="w-full p-3"
            />
            <div className="flex flex-col gap-2 w-full">
                <Button onClick={() => navigate('/')}>메인으로</Button>
                {!isLogin && (
                    <Button
                        onClick={() => navigate('/login')}
                        className="bg-kakao-yellow hover:bg-kakao-yellow/90"
                    >
                        로그인하고 나를 위한 선물 고르기
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AfterInquiry;
