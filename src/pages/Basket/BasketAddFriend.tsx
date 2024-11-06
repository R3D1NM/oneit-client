import {authAtom} from '@/api/auth';
import {fetchFriendList} from '@/api/friend';
import Header from '@/components/common/Header';
import {Friend, Participant} from '@/lib/types';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useAtomValue} from 'jotai';
import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import logo from '@/assets/images/oneit.png';
import {Button} from '@/components/common/Button';
import {basketInvite, fetchBasketInfo} from '@/api/basket';
import {toast} from 'sonner';
const {Kakao} = window;
import loading from '@/assets/images/loading.svg';

const FriendInviteCard = ({friend}: {friend: Friend}) => {
    const {basketID} = useParams();
    const user = useAtomValue(authAtom);

    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
            console.log('카카오 초기화');
        }
    }, []);

    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    const inviteAPI = useMutation({
        mutationFn: () => basketInvite(basketID || ''),
        onSuccess: (data) => {
            const invitationIdx = data.invitationIdx;

            const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/basket/${basketID}/invite/${invitationIdx}`;
            //check if the browser is whale : contain both whale and mobile in userAgent
            if (
                /whale/i.test(navigator.userAgent) &&
                /mobile/i.test(navigator.userAgent)
            ) {
                toast.error(
                    '카카오톡 공유가 지원되지 않는 브라우저입니다. 다른 방법으로 친구를 추가해주세요.',
                    {
                        action: {
                            label: '링크 복사',
                            onClick: () => {
                                navigator.clipboard.writeText(url).then(() => {
                                    toast('클립보드에 복사되었습니다.');
                                });
                            },
                        },
                    },
                );
                return;
            }

            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: user
                        ? `${user?.nickname}님이 선물 바구니에 초대했습니다.`
                        : 'ONE!T 선물 바구니에 초대되었습니다.',
                    description: basketInfoAPI.data.name || 'ONE!T 선물 바구니',
                    imageUrl:
                        basketInfoAPI.data.imageUrl ||
                        'https://www.oneit.gift/oneit.png',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                },
                buttons: [
                    {
                        title: 'ONE!T에서 확인하기',
                        link: {
                            mobileWebUrl: url,
                            webUrl: url,
                        },
                    },
                ],
            });
            toast.success('친구에게 초대장을 보냈습니다.');
        },
    });

    const handleInvite = () => {
        inviteAPI.mutate();
    };

    return (
        <>
            <div className="picture">
                <img
                    src={friend.profileImg || logo}
                    alt="프로필 이미지"
                    className="w-ful h-full object-cover rounded-full"
                />
            </div>
            <div className="info">
                <div className="name">{friend?.nickName}</div>
                <div className="birth">
                    <i></i>
                    <span>생일</span>
                    <span>{friend?.birthDate?.toString()}</span>
                </div>
            </div>
            {basketInfoAPI?.data?.participants.some(
                (parti: Participant) => parti.userIdx === friend.idx,
            ) ? (
                <div className="ml-16 flex justify-end">
                    <Button className="w-20 h-8" disabled variant="disabled">
                        초대됨
                    </Button>
                </div>
            ) : (
                <div className="ml-16 flex justify-end">
                    <Button
                        className="w-20 h-8"
                        onClick={() => {
                            handleInvite();
                        }}
                    >
                        초대하기
                    </Button>
                </div>
            )}
        </>
    );
};
const BasketAddFriend = () => {
    const {basketId} = useParams();
    const user = useAtomValue(authAtom);
    const navigate = useNavigate();

    const friendListAPI = useQuery({
        queryKey: ['friendList'],
        queryFn: () => fetchFriendList(),
    });
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
                {friendListAPI?.data?.length === 0 && (
                    <div className="flex w-full h-full items-center flex-col justify-center">
                        <img src={loading} />
                        <p className="text-center w-full text-gray-400">
                            아직 친구가 없어요
                        </p>
                        <Button
                            className="w-80 p-3 mt-8 "
                            variant="border"
                            onClick={() => navigate(`/basket/${basketId}/info`)}
                        >
                            뒤로 가기
                        </Button>
                    </div>
                )}
                <ul className="scrollbar-hide">
                    {friendListAPI?.data?.map((friend: Friend, idx: number) => (
                        <li key={friend.idx}>
                            <FriendInviteCard friend={friend} />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default BasketAddFriend;
