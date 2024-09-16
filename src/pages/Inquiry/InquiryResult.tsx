import {getInquiry, submitInquiry} from '@/api/inquiry';
import {Button} from '@/components/ui/button';
import {Product} from '@/lib/types';
import {useQuery} from '@tanstack/react-query';
import React, {Key} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import ChoiceCard from './Components/ChoiceCard';
import EmojiList from '@/data/emoji.json';
import {useAtom, useAtomValue} from 'jotai';
import {choices} from '@/atoms/inquiry';

const InquiryResult = () => {
    const {inquiryID} = useParams();
    const navigate = useNavigate();
    const selectedEmojis = useAtomValue(choices);
    const [choiceList, setChoiceList] = useAtom(choices);
    const [{mutate}] = useAtom(submitInquiry);

    const inquiryAPI = useQuery({
        queryKey: ['inquiry', inquiryID],
        queryFn: () => getInquiry(inquiryID || ''),
    });

    const handleSubmit = () => {
        mutate(inquiryID || '');
        navigate(`/inquiry/after`, {replace: true});
    };

    return (
        <>
            <div className="flex flex-col content-center w-full gap-2 justify-center items-center">
                <p>결과 확인하기</p>
                <div className="grid grid-cols-2 gap-2">
                    {inquiryAPI.data?.selectedProducts.map(
                        (product: Product, idx: Key) => {
                            const selected = selectedEmojis.find(
                                (c) => c.productIdx === product.idx,
                            );
                            const emoji = EmojiList.find(
                                (e) => e.idx === selected?.emojiIdx,
                            );
                            if (emoji) {
                                return (
                                    <ChoiceCard
                                        key={idx}
                                        product={product}
                                        emoji={emoji}
                                    />
                                );
                            } else {
                                navigate(`/inquiry/${inquiryID}/choice`);
                            }
                        },
                    )}
                </div>
                <div className="flex justify-between gap-2">
                    <Button onClick={handleSubmit}>결과 보내기</Button>
                    <Button onClick={() => navigate(`/inquiry/${inquiryID}`)}>
                        다시하기
                    </Button>
                </div>
            </div>
        </>
    );
};

export default InquiryResult;
