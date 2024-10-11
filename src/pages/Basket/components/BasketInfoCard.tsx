import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Basket, Friend, Participant} from '@/lib/types';
import React, {useState} from 'react';
import ParticipantAvatar from './ParticipantAvatar';
import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';
import {CalendarCheck, Crown, Plus, PlusCircle, UserPlus2} from 'lucide-react';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';
import {useMutation, useQuery} from '@tanstack/react-query';
import {toast} from 'sonner';
import {fetchFriendList, requestFriend} from '@/api/friend';
import {useAtomValue} from 'jotai';
import {authAtom} from '@/api/auth';

const BasketInfoCard = ({
    basket,
    ...rest
}: {basket: Basket} & React.HTMLAttributes<HTMLSpanElement>) => {

    const [requestedFriends, setRequestedFriends] = useState<Set<number>>(
        new Set(),
    );

    const user = useAtomValue(authAtom);
    const friendAPI = useQuery({
        queryKey: ['friendList'],
        queryFn: () => fetchFriendList(),
        enabled: !!user,
    });

    const requestFriendAPI = useMutation({
        mutationFn: (friend: string) => requestFriend(friend),
        onSuccess: (data, variables) => {
            toast.success('친구 요청을 보냈습니다.');
            setRequestedFriends((prev) => new Set(prev).add(Number(variables)));
        },
    });


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
                                {(basket.participants?.length ?? 0) > 2 && (
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
                                            {user?.idx !==
                                                participant.userIdx &&
                                                !friendAPI?.data?.some(
                                                    (friend: Friend) =>
                                                        friend.idx ==
                                                        participant.userIdx,
                                                ) &&
                                                participant.userIdx !==
                                                    undefined &&
                                                !requestedFriends.has(
                                                    participant.userIdx,
                                                ) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <UserPlus2
                                                            onClick={() => {
                                                                requestFriendAPI.mutate(
                                                                    participant?.userIdx?.toString() ||
                                                                        '',
                                                                );
                                                            }}
                                                        />
                                                    </Button>
                                                )}
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
