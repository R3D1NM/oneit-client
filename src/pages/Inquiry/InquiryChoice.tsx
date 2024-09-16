import {getInquiry} from '@/api/inquiry';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {Emoji, InquiryChoice as InquiryChoiceType} from '@/lib/types';
import {useQuery} from '@tanstack/react-query';
import {Smile} from 'lucide-react';
import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import EmojiList from '@/data/emoji.json';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {addChoice, choices} from '@/atoms/inquiry';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';

const InquiryChoice = () => {
    const {inquiryID} = useParams();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isSelected, setIsSelected] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(0);
    const choiceList = useAtomValue(choices);
    const selectEmoji = useSetAtom(addChoice);
    const naigate = useNavigate();

    const inquiryAPI = useQuery({
        queryKey: ['inquiry', inquiryID],
        queryFn: () => getInquiry(inquiryID || ''),
    });

    const handleEmoji = (emoji: Emoji) => {
        if (selectedEmoji === emoji.idx) {
            setSelectedEmoji(0);
            setIsSelected(false);
            return;
        }
        setIsSelected(true);
        setSelectedEmoji(emoji.idx);
        const choice: InquiryChoiceType = {
            productIdx: inquiryAPI.data?.selectedProducts[currentIdx].idx,
            emojiIdx: emoji.idx,
        };
        selectEmoji(choice);
    };

    const handleNext = () => {
        if (currentIdx === inquiryAPI.data.selectedProducts.length - 1) {
            //todo: submit inquiry result to server
            naigate(`/inquiry/${inquiryID}/result`);
        } else {
            setSelectedEmoji(0);
            setCurrentIdx((prev) => prev + 1);
        }
    };
    // console.log(inquiryAPI.data?.selectedProducts);

    return (
        <div className="flex flex-col content-center w-full gap-2 justify-center items-center">
            <div className="rounded-lg overflow-hidden shadow-sm border-[1px] w-full p-3">
                <div className="flex flex-col justify-center">
                    <AspectRatio ratio={1 / 1} className="justify-center flex">
                        <div className="relative w-full h-full flex justify-center">
                            <img
                                src={
                                    inquiryAPI.data?.selectedProducts[
                                        currentIdx
                                    ].thumbnailUrl ||
                                    'https://via.placeholder.com/400'
                                }
                                alt={
                                    inquiryAPI.data?.selectedProducts[
                                        currentIdx
                                    ].name
                                }
                                className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                    </AspectRatio>
                    <h3 className="max-w-full text-lg font-semibold m-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {inquiryAPI.data?.selectedProducts[currentIdx].name}
                    </h3>
                </div>
                <div className="w-full flex justify-between px-2">
                    {EmojiList.map((emoji, idx) => (
                        <Popover key={idx}>
                            <PopoverTrigger asChild>
                                <div
                                    className="w-5"
                                    onClick={() => handleEmoji(emoji)}
                                >
                                    {/* todo: match with emoji image */}
                                    {/* <img src={dummyEmoji.emojiImageURL} /> */}
                                    <Smile
                                        className={cn(
                                            ' hover:text-oneit-pink',
                                            selectedEmoji === emoji.idx
                                                ? 'text-oneit-pink'
                                                : 'text-oneit-gray',
                                        )}
                                    />
                                </div>
                            </PopoverTrigger>
                            <PopoverContent side="top" className="w-fit">
                                <p className="text-sm">{emoji.content}</p>
                            </PopoverContent>
                        </Popover>
                    ))}
                </div>
            </div>
            {isSelected && (
                <Button className="w-[50%]" onClick={handleNext}>
                    {currentIdx === inquiryAPI.data?.selectedProducts.length - 1
                        ? '결과 확인하기'
                        : '다음 상품 보기'}
                </Button>
            )}
        </div>
    );
};

export default InquiryChoice;
