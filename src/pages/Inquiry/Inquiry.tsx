import boxImage from '@/assets/images/giftbox2.png';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {getInquiry} from '@/api/inquiry';
import Header from '@/components/common/Header';
import {Button} from '@/components/common/Button';

const Inquiry = () => {
    const {inquiryID} = useParams();
    const navigate = useNavigate();

    const inquiryAPI = useQuery({
        queryKey: ['inquiry', inquiryID],
        queryFn: () => getInquiry(inquiryID || ''),
    });

    const handleStart = () => {
        navigate(`/inquiry/${inquiryID}/choice`);
    };

    return (
        <>
            <Header btn_back variant="logo" profile />
            <div className="question1">
                <div className="big_title">
                    {inquiryAPI.data?.target ? (
                        <>
                            <span>{inquiryAPI.data?.target}</span>님을 위한{' '}
                            <br />
                        </>
                    ) : (
                        <>
                            <span>친구들이 만든</span>
                            <br />
                        </>
                    )}
                    선물바구니가 도착했어요!
                </div>
                <div className="visual_banner">
                    <div className="ballon"></div>
                    <div className="cart"></div>
                </div>
            </div>
            <div className="bottom_btn">
                <p className="text">내 취향을 저격한선물은?</p>
                {inquiryAPI?.error ? (
                    <>
                        <Button className="w-full" variant="disabled" disabled>
                            이미 응답 완료했어요
                        </Button>
                    </>
                ) : (
                    <button className="btn_pink2" onClick={handleStart}>
                        선물 바구니 확인하러 가기
                    </button>
                )}
            </div>
        </>
    );
};

export default Inquiry;
