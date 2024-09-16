import {choices} from '@/atoms/inquiry';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Emoji, Product} from '@/lib/types';
import {cn} from '@/lib/utils';
import {useAtomValue} from 'jotai';
import React, {useEffect, useState} from 'react';
import EmojiList from '@/data/emoji.json';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Smile} from 'lucide-react';

const ChoiceCard = ({product, emoji}: {product: Product; emoji: Emoji}) => {
    return (
        <div
            key={product.idx}
            className={cn('rounded-lg overflow-hidden shadow-sm flex flex-col')}
        >
            <div className="relative group">
                <AspectRatio ratio={1 / 1} className="justify-center flex">
                    <div className="relative w-full h-full flex justify-center">
                        <img
                            src={
                                product.thumbnailUrl ||
                                'https://via.placeholder.com/400'
                            }
                            alt={product.name}
                            className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                </AspectRatio>

                <div className="absolute bottom-0 right-0 p-2 transition-colors w-full justify-between flex">
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="w-5">
                                {/* todo: match with emoji image */}
                                {/* <img src={dummyEmoji.emojiImageURL} /> */}
                                <Smile className="text-oneit-pink bg-white rounded-full" />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            side="top"
                            align="start"
                            className="w-fit"
                        >
                            <p className="text-sm">{emoji?.content}</p>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className={cn('p-4 border-t-[0.5px]')}>
                <h3 className="max-w-full  text-sm font-semibold mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                    {product.name}
                </h3>
            </div>
        </div>
    );
};

export default ChoiceCard;
