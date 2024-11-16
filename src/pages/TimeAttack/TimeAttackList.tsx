import {fectchBirthdayList, timeAttackToggle} from '@/api/friend';
import Header from '@/components/common/Header';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useMemo} from 'react';
import loading from '@/assets/images/loading.svg';
import SearchIcon from '@/assets/images/search_biggest.png';
import {Friend} from '@/lib/types';
import {Button} from '@/components/common/Button';
import {useNavigate} from 'react-router-dom';
import logo from '@/assets/images/oneit.png';
import {ArrowRightSquare} from 'lucide-react';
import {cn} from '@/lib/utils';
import {toast} from 'sonner';

const FriendCard = (props: {friend: Friend}) => {
    const {friend} = props;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const timeAttackToggleAPI = useMutation({
        mutationKey: ['timeAttackToggle'],
        mutationFn: () => timeAttackToggle(friend.idx.toString() || ''),
    });

    const getNextBirthday = (birthDate: string) => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        const nextBirthday = new Date(
            today.getFullYear(),
            birthDateObj.getMonth(),
            birthDateObj.getDate(),
        );

        if (today > nextBirthday) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }

        return nextBirthday;
    };

    const dday = useMemo(() => {
        const today = new Date();
        const timeDiff =
            getNextBirthday(friend.birthDate ?? '').getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (daysDiff === 365) return 'Day';

        return daysDiff;
    }, [friend?.birthDate]);

    const handleTimeAttackToggle = () => {
        timeAttackToggleAPI
            .mutateAsync()
            .then(() => {
                if (friend.timeAttackAlarm === false) {
                    toast.success('이제 생일 알림을 받아볼 수 있어요');
                } else {
                    toast.success('더 이상 생일 알림을 받지 않습니다');
                }
            })
            .finally(() => {
                queryClient.setQueryData(
                    ['BrithDayFriendList'],
                    (prev: Friend[]) => {
                        return prev.map((item) => {
                            if (item.idx === friend.idx) {
                                return {
                                    ...item,
                                    timeAttackAlarm: !item.timeAttackAlarm,
                                };
                            }
                            return item;
                        });
                    },
                );
            });
    };

    return (
        <>
            <div className="picture ">
                <img
                    src={friend.profileImg || logo}
                    alt="프로필 이미지"
                    className="w-ful h-full object-cover rounded-full"
                />
            </div>
            <div className="info">
                <div className="name">
                    {friend?.nickName}

                    <span className="text-[#ff4bc1] ml-2">D-{dday}</span>
                </div>
                <div className="birth">
                    <i></i>
                    <span>생일</span>
                    <span>{friend?.birthDate?.toString()}</span>
                </div>
            </div>
            <div className="icons">
                <button
                    className={cn(
                        'btn_timer',
                        friend.timeAttackAlarm && 'active',
                    )}
                    onClick={handleTimeAttackToggle}
                ></button>
                <button onClick={() => navigate(`/timeattack/${friend.idx}`)}>
                    <ArrowRightSquare className="text-[#ff4bc1]" />
                </button>
            </div>
        </>
    );
};

const TimeAttackList = () => {
    const navigate = useNavigate();
    const friendListAPI = useQuery({
        queryKey: ['BrithDayFriendList'],
        queryFn: () => fectchBirthdayList(),
    });
    return (
        <>
            <Header
                btn_back
                variant="back"
                profile
                // title={`친구 목록 ${friendListAPI?.data?.length || 0}`}
            />
            <div
                className={cn(
                    'friendList ',
                    friendListAPI?.data?.length === 0 && 'bg-[#FEF1FA]',
                )}
            >
                <ul>
                    <h3 className=""></h3>
                </ul>

                {friendListAPI?.data?.length === 0 && (
                    <div className="flex w-full h-full items-center flex-col justify-center -mt-12 p-4">
                        <img src={SearchIcon} className="w-52 h-52" />
                        <p className="text-center w-full ">
                            7일 이내에 생일인 친구가 없어요
                        </p>
                        <p className="text-xs  mt-2 text-center text-gray-400">
                            ❕타임어택은 알림 발송 후 24시간 동안만 공개됩니다❕{' '}
                            <br />
                            ❕타임어택은 생일 7일전, 3일전, 1일전 알림이
                            발송됩니다❕
                        </p>
                        <Button
                            onClick={() => navigate('/friends')}
                            className="w-full mt-4"
                            variant="border"
                        >
                            친구목록 바로가기
                        </Button>
                    </div>
                )}
                <ul className="scrollbar-hide">
                    {friendListAPI?.data?.map((friend: Friend, idx: number) => (
                        <li key={friend.idx} className="">
                            <FriendCard friend={friend} />
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default TimeAttackList;
