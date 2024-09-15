import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Basket, Participant} from '@/lib/types';
import React from 'react';
import ParticipantAvatar from './ParticipantAvatar';
import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';
import {CalendarCheck, Crown, Plus, PlusCircle} from 'lucide-react';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';

const BasketInfoCard = ({
    basket,
    ...rest
}: {basket: Basket} & React.HTMLAttributes<HTMLSpanElement>) => {
    console.log(basket.idx, basket.deadline);

    return (
        <div className="" {...rest}>
            <AspectRatio ratio={1 / 1} className="justify-center flex">
                <div className="relative w-full h-full flex justify-center">
                    <img
                        src={
                            basket.imageUrl ||
                            'https://www.oneit.gift/oneit.png'
                        }
                        alt={basket.name}
                        className="relative z-[-10] h-full object-cover hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </div>
            </AspectRatio>
            <div className="p-2 bg-white border-t-[0.5px]">
                <div className="flex w-full">
                    <div className="flex flex-col w-full">
                        <h3 className="text-xl font-bold md:text-xl">
                            {basket?.name}
                        </h3>
                        <p className="text-oneit-gray text-sm mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                            {basket?.description}
                        </p>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex -space-x-3">
                                {basket.participants
                                    ?.slice(0, 3)
                                    .map(
                                        (
                                            participant: Participant,
                                            idx: number,
                                        ) => (
                                            <ParticipantAvatar
                                                key={idx}
                                                nickname={
                                                    participant.nickname ||
                                                    '익명의 참여자'
                                                }
                                                profileImage={
                                                    participant.profileImage ||
                                                    'https://via.placeholder.com/320?text=oneit'
                                                }
                                                userRole={participant.userRole}
                                            />
                                        ),
                                    )}
                                {basket.participants?.length &&
                                    basket.participants?.length > 2 && (
                                        <PlusCircle className="text-oneit-pink h-10 w-10 z-10 bg-white rounded-full p-0" />
                                    )}
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-fit flex justify-center"
                            align="end"
                        >
                            <div className="grid gap-2">
                                <h3>참여자 목록</h3>
                                {basket.participants?.map(
                                    (participant: Participant, idx: number) => (
                                        <div
                                            className="flex w-full items-center"
                                            key={idx}
                                        >
                                            <Avatar
                                                className={cn(
                                                    participant.userRole ==
                                                        'MANAGER' &&
                                                        'border-2 border-oneit-pink',
                                                )}
                                            >
                                                <AvatarImage
                                                    src={
                                                        participant.profileImage
                                                    }
                                                />
                                            </Avatar>
                                            <span className="ml-2">
                                                {participant.nickname ||
                                                    '익명의 참여자'}
                                                {participant.userRole ===
                                                    'MANAGER' && (
                                                    <Crown className="inline-block ml-1 text-oneit-pink" />
                                                )}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center justify-end">
                    <span className="text-sm text-gray-500">
                        <CalendarCheck className="inline-block mr-1" />
                        {basket?.deadline.toString().split('T')[0]}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BasketInfoCard;
