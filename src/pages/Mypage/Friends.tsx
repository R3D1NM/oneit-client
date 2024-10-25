import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Friend} from '@/lib/types';
import {cn} from '@/lib/utils';
import {CircleEllipsis, UserCircle2} from 'lucide-react';
import React, {useEffect} from 'react';
import FriendCard from './Components/FriendCard';
import {useQuery} from '@tanstack/react-query';
import {
    fetchFriendList,
    fetchFriendRequestsFromMe,
    fetchFriendRequestsToMe,
} from '@/api/friend';
import {useAtomValue} from 'jotai';
import {authAtom} from '@/api/auth';
import RequestedFriendCard from './Components/RequestToMe';
import RequestToMe from './Components/RequestToMe';
import RequestFromMe from './Components/RequestFromMe';
import Header from '@/components/common/Header';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
const {Kakao} = window;
interface SelectedUser {
    uuid: string;
    id: string;
    profile_nickname: string;
    profile_thumbnail_image: string;
}
interface FriendPickerResponse {
    selectedTotalCount: number;
    users: SelectedUser[];
}
interface RequestedFriend {
    requestIdx: number;
    fromUser: Friend;
    requestDate: Date;
}

const Friends = () => {
    const userInfo = useAtomValue(authAtom);

    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
    }, []);

    const friendListAPI = useQuery({
        queryKey: ['friendList'],
        queryFn: () => fetchFriendList(),
    });

    const friendRequestToMeListAPI = useQuery({
        queryKey: ['friendRequestListToMe'],
        queryFn: () => fetchFriendRequestsToMe(),
    });
    const friendRequestFromMeListAPI = useQuery({
        queryKey: ['friendRequestListFromMe'],
        queryFn: () => fetchFriendRequestsFromMe(),
    });

    const inviteFriends = async () => {
        Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: 'ONE!T에서 함께 선물을 골라보아요!',
                description: `${userInfo?.nickname}님이 초대하셨습니다.`,
                imageUrl: 'https://www.oneit.gift/oneit.png',
                link: {
                    webUrl: 'https://www.oneit.gift',
                    mobileWebUrl: 'https://www.oneit.gift',
                },
            },
            buttons: [
                {
                    title: '웹으로 보기',
                    link: {
                        mobileWebUrl: 'https://www.oneit.gift',
                        webUrl: 'https://www.oneit.gift',
                    },
                },
            ],
        });
    };

    return (
        <>
            <Header
                btn_back
                variant="back"
                profile
                title={`친구 목록 ${friendListAPI?.data?.length || 0}`}
            />
            <div className="friendList">
                <ul>
                    <h3 className=""></h3>
                </ul>
                <ul className="scrollbar-hide">
                    {friendListAPI?.data?.map((friend: Friend, idx: number) => (
                        <li key={friend.idx}>
                            <FriendCard friend={friend} />
                        </li>
                    ))}
                </ul>
                <Accordion
                    type="single"
                    collapsible
                    className="absolute bottom-0 right-0 w-full"
                >
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="px-4 border-t-[1px]">
                            나에게 온 친구 요청{' '}
                            {friendRequestToMeListAPI?.data?.length || 0}
                        </AccordionTrigger>
                        <AccordionContent className="friendList scrollbar-hide">
                            <ul>
                                {friendRequestToMeListAPI.data?.map(
                                    (friend: RequestedFriend, idx: number) => (
                                        <li
                                            key={friend.requestIdx}
                                            className="border-b-0"
                                        >
                                            <RequestToMe
                                                friend={friend}
                                                key={idx}
                                            />
                                        </li>
                                    ),
                                )}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="px-4">
                            대기 중인 내 요청{' '}
                            {friendRequestFromMeListAPI?.data?.length || 0}
                        </AccordionTrigger>
                        <AccordionContent className="friendList scrollbar-hide">
                            <ul>
                                {friendRequestFromMeListAPI.data?.map(
                                    (friend: RequestedFriend, idx: number) => (
                                        <li key={friend.requestIdx}>
                                            <RequestFromMe
                                                friend={friend}
                                                key={idx}
                                            />
                                        </li>
                                    ),
                                )}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    );
};

export default Friends;
