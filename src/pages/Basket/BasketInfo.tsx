import {
    basketInvite,
    deleteBasket,
    editBasket,
    fetchBasketInfo,
} from '@/api/basket';
import Header from '@/components/common/Header';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import giftBox from './../../assets/images/giftBox.svg';
import friend from './../../assets/images/icon_friend.svg';
import Logo from '@/assets/images/oneit.png';
import {Basket, Friend, Participant} from '@/lib/types';
import {fetchFriendList, requestFriend} from '@/api/friend';
import {useAtomValue} from 'jotai';
import {authAtom} from '@/api/auth';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Trash2Icon, XSquareIcon} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {toast} from 'sonner';
import {cn} from '@/lib/utils';
const {Kakao} = window;

const ParticipantThumbnail = ({participant}: {participant: Participant}) => {
    const user = useAtomValue(authAtom);
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const handleProfile = () => {
        setOpen(!open);
    };

    const requestFriendAPI = useMutation({
        mutationKey: ['requestFriend'],
        mutationFn: () => requestFriend(participant.userIdx?.toString() || ''),
        onSuccess: () => {
            queryClient.setQueryData(['fetchFriends'], (old: Friend[]) => [
                ...old,
                {
                    idx: participant.userIdx,
                    name: participant.nickname,
                    nickname: participant.nickname,
                    profileImage: participant.profileImage,
                    birthDate: new Date(),
                },
            ]);
            toast.success('친구 요청을 보냈습니다.');
        },
    });

    const fetchFriends = useQuery({
        queryKey: ['fetchFriends'],
        queryFn: () => fetchFriendList(),
    });

    const handleRequest = () => {
        requestFriendAPI.mutate();
    };

    return (
        <li key={`friend-${participant.userIdx}`}>
            <button onClick={handleProfile}>
                <div>
                    <img
                        src={participant.profileImage || Logo}
                        alt="참여자 프로필"
                    />
                </div>
                <p>{participant.nickname}</p>
                {open && (
                    <div className="overlay">
                        <button
                            className="profile"
                            onClick={() => {
                                if (user?.idx === participant.userIdx) {
                                    navigate(`/mypage`);
                                } else {
                                    navigate(`/user/${participant.userIdx}`);
                                }
                            }}
                        >
                            <i></i>프로필보기
                        </button>
                        {/* if not on the friendList */}
                        {!fetchFriends?.data?.some(
                            (friend: Friend) =>
                                friend.idx === participant.userIdx,
                        ) &&
                            user?.idx !== participant?.userIdx && (
                                <button
                                    className="profile2"
                                    onClick={handleRequest}
                                >
                                    <i></i>친구 요청
                                </button>
                            )}
                    </div>
                )}
            </button>
        </li>
    );
};

const BasketEdit = ({
    closeModal,
    basket,
}: {
    closeModal: () => void;
    basket: Basket;
}) => {
    const queryClient = useQueryClient();
    const editBasketAPI = useMutation({
        mutationKey: ['editBasket'],
        mutationFn: async ({
            basketID,
            basket,
            image,
        }: {
            basketID: string;
            basket: any;
            image: File | null;
        }) => {
            return await editBasket(basketID, basket, image);
        },
        onSuccess: (data, variables) => {
            //todo: update basket info
            queryClient.invalidateQueries({
                queryKey: ['basket', basket.idx.toString()],
            });
            toast.success('바구니 정보가 수정되었습니다.');
            closeModal();
        },
    });

    const formSchema = z.object({
        title: z.string().min(2, {
            message: '바구니 이름은 2자 이상이어야합니다.',
        }),
        image: z.instanceof(File).optional(),
        deadline: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, {
                message: '날짜 형식은 YYYY-MM-DD이어야 합니다.',
            })
            .refine((date) => new Date(date) >= new Date(), {
                message: '과거의 날짜는 선택할 수 없습니다.',
            }),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: basket.name,
            deadline: basket.deadline.toString().split('T')[0],
        },
        mode: 'all',
    });

    const fileRef = form.register('image');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {reset} = form;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);

        const payload = {
            name: values.title,
            deadline: new Date(values.deadline),
            idx: basket.idx,
        };

        editBasketAPI.mutate({
            basketID: basket.idx.toString() || '',
            basket: payload,
            image: values.image || null,
        });
    };

    useEffect(() => {
        if (basket) {
            console.log(basket);
            reset({
                title: basket.name || '',
                deadline: basket.deadline.toString(),
            });
        }
    }, [basket, reset]);

    return (
        <div className="modal_new cartEdit">
            <div className="dim"></div>
            <Form {...form}>
                <form className="inner" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="handler">
                        <button className="close" onClick={closeModal}></button>
                    </div>
                    <div className="input_area">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>바구니 이름</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            autoFocus={true}
                                            {...field}
                                            placeholder="바구니 이름을 입력하세요"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>기념일 수정</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            // autoFocus={true}
                                            {...field}
                                            placeholder="yyyy-mm-dd"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e)}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="edit_area">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({field}) => (
                                <FormItem className="flex gap-2 items-baseline">
                                    <FormLabel>바구니 이미지 수정</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fileRef}
                                            ref={fileInputRef}
                                            onChange={(event) => {
                                                const displayUrl: string =
                                                    URL.createObjectURL(
                                                        event.target.files![0],
                                                    );

                                                // setImageURL(displayUrl);
                                                console.log(event);
                                                const file =
                                                    event.target.files![0];
                                                console.log(file);

                                                field.onChange(file);
                                            }}
                                            type="file"
                                            accept="image/*"
                                            style={{
                                                display: 'none',
                                            }}
                                        />
                                    </FormControl>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fileInputRef.current?.click();
                                        }}
                                        className="btn_edit"
                                    >
                                        edit
                                    </button>
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* <div className="public">
                    다른 사람에게 바구니 공개하기
                    <div className="toggle_area">
                        <input type="checkbox" id="toggle" hidden />

                        <label htmlFor="toggle" className="toggleSwitch">
                            <span className="toggleButton"></span>
                        </label>
                    </div>
                </div> */}
                    <button className="btn_public">
                        바구니 정보 수정 완료
                    </button>
                </form>
            </Form>
        </div>
    );
};

const BasketInfo = () => {
    const {basketID} = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const user = useAtomValue(authAtom);
    const navigate = useNavigate();

    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    const deleteAPI = useMutation({
        mutationFn: () => deleteBasket(basketID || ''),
        onSuccess: (data) => {
            navigate(`/basket`, {replace: true});
        },
    });
    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
    }, []);

    const inviteAPI = useMutation({
        mutationFn: () => basketInvite(basketID || ''),
        mutationKey: ['invite'],
    });

    const handleInvite = () => {
        inviteAPI.mutateAsync().then((res) => {
            const invitationIdx = res.invitationIdx;

            const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/basket/${basketID}/invite/${invitationIdx}`;

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
            }).then(() => {
                toast.success('친구에게 초대장을 보냈습니다.');
            });
        });
    };

    // const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // const openModal = () => setIsOpen(true);
    const closeModal2 = () => setIsOpen2(false);

    const hanldeDelete = () => {
        deleteAPI.mutate();
    };

    const handleCopy = async () => {
        inviteAPI.mutateAsync().then((res) => {
            const invitationIdx = res.invitationIdx;

            const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/basket/${basketID}/invite/${invitationIdx}`;

            navigator.clipboard.writeText(url).then(() => {
                toast('클립보드에 복사되었습니다.');
            });
        });
    };

    return (
        <>
            <Header variant="back" btn_back profile />
            <div className="cardInfo">
                <div className="list_rounding">
                    <div className="writing gap-2">
                        <div>
                            <img
                                src={basketInfoAPI?.data?.imageUrl || Logo}
                                alt="bakset thumbnail"
                                className=""
                            />
                        </div>
                        <div>
                            {basketInfoAPI?.data?.dday >= 0 ? (
                                <div className="dDay">
                                    D-
                                    {basketInfoAPI?.data?.dday}
                                </div>
                            ) : (
                                <div className="text-[#ff5757] text-sm font-semibold">
                                    {-basketInfoAPI?.data?.dday}일 지남
                                </div>
                            )}
                            <div
                                className={cn(
                                    'title text-overflow-one',
                                    basketInfoAPI.data?.participants.some(
                                        (parti: Participant) =>
                                            parti.userRole == 'MANAGER' &&
                                            parti.userIdx == user?.idx,
                                    )
                                        ? 'min-w-44'
                                        : 'min-w-60',
                                )}
                            >
                                {basketInfoAPI?.data?.name}
                            </div>
                        </div>
                        {basketInfoAPI.data?.participants.some(
                            (parti: Participant) =>
                                parti.userRole == 'MANAGER' &&
                                parti.userIdx == user?.idx,
                        ) && (
                            <div className="gap-1">
                                <button
                                    className="btn_pencil"
                                    onClick={() => setIsOpen(true)}
                                ></button>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <button>
                                            {/* <Trash2Icon className="text-[#ff5757]" /> */}
                                            <XSquareIcon className="text-[#ff5757]" />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            바구니를 삭제할까요?
                                        </AlertDialogHeader>
                                        <AlertDialogDescription className="text-center">
                                            바구니를 삭제하면 <br />
                                            바구니에 담긴 선물들도 함께
                                            삭제됩니다.
                                        </AlertDialogDescription>
                                        <AlertDialogFooter className="flex w-full flex-row gap-2 items-center">
                                            <AlertDialogCancel className="w-full mt-0">
                                                취소
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={hanldeDelete}
                                                className="w-full bg-[#ff4bc1] text-white hover:bg-[#ff4bc1]/90"
                                            >
                                                삭제
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                    <button
                        className="btn_shadow"
                        onClick={() => navigate(`/basket/${basketID}`)}
                    >
                        <i>
                            <img src={giftBox} alt="" />
                        </i>
                        선물 바구니 보러가기
                    </button>
                </div>
                <div className="list_rounding">
                    <div className="friend_list">
                        <div>
                            <p className="title">참여중인 친구목록</p>
                            {/* <button className="btn_txt">모두 친구추가</button> */}
                        </div>
                        <div>
                            <ul>
                                {basketInfoAPI?.data?.participants?.map(
                                    (participant: Participant, idx: number) => (
                                        <ParticipantThumbnail
                                            participant={participant}
                                        />
                                    ),
                                )}
                            </ul>
                        </div>

                        <div>
                            <button
                                className="btn_shadow"
                                onClick={() => setIsOpen2(true)}
                            >
                                <i>
                                    <img src={friend} alt="" />
                                </i>
                                새로운 친구 초대하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <BasketEdit
                    closeModal={closeModal}
                    basket={basketInfoAPI?.data}
                />
            )}
            {isOpen2 && (
                <div className="modal_new share">
                    <div className="dim"></div>

                    <div className="inner">
                        <div className="handler">
                            <button
                                className="close"
                                onClick={closeModal2}
                            ></button>
                        </div>
                        <div className="title">
                            친한 친구를 바구니에 초대해보세요
                        </div>
                        <div className="btn_share_area">
                            <button className="kakao" onClick={handleInvite}>
                                카카오톡
                            </button>
                            <button className="link" onClick={handleCopy}>
                                링크복사
                            </button>
                        </div>
                        <button
                            className="btn_text"
                            onClick={() =>
                                navigate(`/basket/${basketID}/invite`)
                            }
                        >
                            친구목록에서 초대하기
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BasketInfo;
