import Header from '@/components/common/Header';
import React from 'react';
import image from '@/assets/images/giftBox2.svg';
import {Button} from '@/components/common/Button';
import {useNavigate, useParams} from 'react-router-dom';

const AfterBasketCreate = () => {
    const {basketID} = useParams();
    const navigate = useNavigate();
    return (
        <>
            <Header variant="logo" />
            <main
                className=" h-full px-4 flex flex-col items-center justify-center"
                role="main"
            >
                <div className="flex flex-col gap-2">
                    <img src={image} alt="gift" className="p-3 h-40 " />

                    <p className="text-[#ff4bc1] text-2xl font-bold">
                        바구니 생성 완료!
                    </p>
                </div>

                <div className="w-full mt-4 absolute bottom-0 right-0 pl-4 pr-4 mb-6">
                    <Button
                        className="w-full"
                        onClick={() =>
                            navigate('/basket/' + basketID, {replace: true})
                        }
                    >
                        바구니 바로가기
                    </Button>
                </div>
            </main>
        </>
    );
};

export default AfterBasketCreate;
