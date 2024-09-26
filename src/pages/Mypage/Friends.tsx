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
        <div className="flex w-full flex-col gap-2">
            <div className="flex flex-col w-full items-center border-[1px] mt-3 p-2 rounded-md">
                <div className="flex flex-col w-full py-1">
                    <h3>전체 친구 수: {friendListAPI?.data?.length || 0}</h3>
                    <div className="flex gap-2">
                        <span className="text-oneit-gray text-sm">
                            나에게 온 친구 요청:{' '}
                            {friendRequestToMeListAPI?.data?.length || 0}
                        </span>
                        <span className="text-oneit-gray text-sm">
                            대기 중인 내 요청:{' '}
                            {friendRequestFromMeListAPI?.data?.length || 0}
                        </span>
                    </div>
                </div>
                {/* <Button onClick={kakaoFriendList}>친구 찾아보기</Button> */}
                <Button className="w-full" onClick={inviteFriends}>
                    카카오톡 친구 초대하기
                </Button>
            </div>
            {friendRequestToMeListAPI?.data?.length !== 0 && (
                <div className="gap-2 flex w-full border-[1px] rounded-md p-2 flex-col items-center">
                    <h3 className="">나에게 온 친구 요청</h3>
                    {friendRequestToMeListAPI.data?.map(
                        (friend: RequestedFriend, idx: number) => (
                            <RequestToMe friend={friend} key={idx} />
                        ),
                    )}
                </div>
            )}
            {friendRequestFromMeListAPI?.data?.length !== 0 && (
                <div className="gap-2 flex w-full border-[1px] rounded-md p-2 flex-col items-center">
                    <h3 className="">대기 중인 내 요청</h3>
                    {friendRequestFromMeListAPI.data?.map(
                        (friend: RequestedFriend, idx: number) => (
                            <RequestFromMe friend={friend} key={idx} />
                        ),
                    )}
                </div>
            )}

            {friendListAPI?.data?.length !== 0 && (
                <div className="gap-2 flex w-full border-[1px] rounded-md p-2 flex-col items-center">
                    <h3 className="">친구 목록</h3>
                    {friendListAPI.data?.map((friend: Friend, idx: number) => (
                        <FriendCard friend={friend} key={idx} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Friends;
