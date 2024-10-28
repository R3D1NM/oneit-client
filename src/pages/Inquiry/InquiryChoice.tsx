import {getInquiry} from '@/api/inquiry';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/common/Button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {Emoji, InquiryChoice as InquiryChoiceType} from '@/lib/types';
import {useQuery} from '@tanstack/react-query';
import {Smile} from 'lucide-react';
import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import EmojiList from '@/data/emoji.json';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {addChoice, choices} from '@/atoms/inquiry';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import Header from '@/components/common/Header';

type emojiEnumType = 'LOVE' | 'LIKE' | 'NEED' | 'SOSO' | 'BAD' | 'HAVE';
const emojiEnum: emojiEnumType[] = [
    'LOVE',
    'LIKE',
    'NEED',
    'SOSO',
    'BAD',
    'HAVE',
];

const InquiryChoice = () => {
    const {inquiryID} = useParams();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<emojiEnumType | null>(
        null,
    );
    const choiceList = useAtomValue(choices);
    const selectEmoji = useSetAtom(addChoice);
    const navigate = useNavigate();

    // console.log(EmojiList);

    const inquiryAPI = useQuery({
        queryKey: ['inquiry', inquiryID],
        queryFn: () => getInquiry(inquiryID || ''),
    });

    const handleEmoji = (emoji: emojiEnumType) => {
        if (selectedEmoji === emoji) {
            setSelectedEmoji(null);
            setIsSelected(false);
            return;
        }
        setIsSelected(true);
        setSelectedEmoji(emoji);
        const choice: InquiryChoiceType = {
            productIdx: inquiryAPI.data?.selectedProducts[currentIdx].idx,
            emojiIdx: emoji,
        };
        selectEmoji(choice);
    };

    const handleNext = () => {
        if (currentIdx === inquiryAPI.data.selectedProducts.length - 1) {
            // console.log(choiceList);

            navigate(`/inquiry/${inquiryID}/result`);
        } else {
            setSelectedEmoji(null);
            setCurrentIdx((prev) => prev + 1);
        }
    };
    // console.log(inquiryAPI.data?.selectedProducts);

    const handleGoBack = () => {
        if (currentIdx == 0) {
            navigate(`/inquiry/${inquiryID}`, {replace: true});
        } else {
            setCurrentIdx((prevStep) => prevStep - 1);
            window.history.pushState(null, '', window.location.href);
        }
    };
    useEffect(() => {
        window.history.pushState({currentIdx}, '', window.location.href);
    }, [currentIdx]);

    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault();
            handleGoBack();
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [currentIdx]);

    const EmojiButton = ({emoji}: {emoji: emojiEnumType}) => {
        return (
            <button
                className={cn(
                    `${EmojiList[emoji].name}`,
                    selectedEmoji === emoji && 'active',
                )}
                onClick={() => handleEmoji(emoji)}
            >
                <i></i>
                <p>{EmojiList[emoji].content}</p>
            </button>
        );
    };

    return (
        <>
            <Header btn_back variant="back" profile />
            <div className="question2">
                <div className="big_title">
                    친구들이 준비한 선물 리스트 중<br />
                    <span>
                        {inquiryAPI?.data?.target ? (
                            <>
                                <span>{inquiryAPI?.data?.target}</span>님 마음에
                                드는 선물을 선택해주세요
                            </>
                        ) : (
                            '마음에 드는 선물을 선택해주세요'
                        )}
                    </span>
                </div>

                <div className="select_area">
                    <div className="photo">
                        <img
                            src={
                                inquiryAPI.data?.selectedProducts[currentIdx]
                                    .thumbnailUrl ||
                                'https://via.placeholder.com/400'
                            }
                            alt="상품 대표 이미지"
                        />
                        <div className="desc">
                            <div className="title text-overflow-one">
                                {
                                    inquiryAPI.data?.selectedProducts[
                                        currentIdx
                                    ].name
                                }
                            </div>
                            <div className="text text-overflow">
                                {
                                    inquiryAPI.data?.selectedProducts[
                                        currentIdx
                                    ]?.description
                                }
                            </div>
                        </div>
                    </div>

                    <div className="emoji_area">
                        <div className="area_one">
                            {emojiEnum
                                .slice(0, 3)
                                ?.map((emoji, idx) => (
                                    <EmojiButton emoji={emoji} key={idx} />
                                ))}
                        </div>
                        <div className="area_two">
                            {emojiEnum
                                .slice(3, 6)
                                ?.map((emoji, idx) => (
                                    <EmojiButton emoji={emoji} key={idx} />
                                ))}
                        </div>
                    </div>
                    <Button
                        className="w-full mt-2"
                        onClick={handleNext}
                        variant={isSelected ? 'primary' : 'disabled'}
                        disabled={!isSelected}
                    >
                        {currentIdx ===
                        inquiryAPI.data?.selectedProducts.length - 1
                            ? '결과 확인하기'
                            : '다음 상품 보기'}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default InquiryChoice;
