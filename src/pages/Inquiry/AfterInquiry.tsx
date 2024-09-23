import {isLoginAtom} from '@/api/auth';
import {Button} from '@/components/ui/button';
import {useAtomValue} from 'jotai';
import React from 'react';
import {useNavigate} from 'react-router-dom';

const AfterInquiry = () => {
    const navigate = useNavigate();
    const isLogin = useAtomValue(isLoginAtom);
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
