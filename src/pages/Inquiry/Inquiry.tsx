import {Button} from '@/components/ui/button';
import boxImage from '@/assets/images/giftbox2.png';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {getInquiry} from '@/api/inquiry';

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
        <div className="flex flex-col content-center w-full gap-2 justify-center">
            <div className="rounded-lg overflow-hidden shadow-sm border-[1px] w-full p-3">
                <div className="flex flex-col gap-2 w-full justify-center">
                    <h2 className="flex text-3xl">
                        {inquiryAPI.data?.target
                            ? inquiryAPI.data.target + '님을 위한'
                            : '친구들이 고른'}{' '}
                        <br /> 선물이 준비되었어요!
                    </h2>
                    <img src={boxImage} className="w-full p-3" />

                    <p className="text-center">어떤 선물이 있는지 살펴보고</p>
                    <p className="text-center">이모지로 반응을 남겨주세요</p>
                    <Button onClick={handleStart}>시작하기</Button>
                </div>
            </div>
        </div>
    );
};

export default Inquiry;
