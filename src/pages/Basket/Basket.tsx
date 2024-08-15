import {
    basketInvite,
    deleteBasket,
    fetchBasketInfo,
    fetchBasketProducts,
    fetcthBasketParticipants,
} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../NotFound';
import {Button} from '@/components/ui/button';
import {
    ArrowUp,
    CalendarCheck,
    ChevronLeft,
    Crown,
    Edit,
    Heart,
    LockKeyhole,
    MailPlusIcon,
    PlusSquare,
    Send,
    Settings,
    Trash,
} from 'lucide-react';
import Share from '@/components/common/Share';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {useState} from 'react';
import {Separator} from '@/components/ui/separator';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Participant, Product} from '@/lib/types';
import BasketProductCard from './components/BasketProductCard';
import {toast} from 'sonner';
import {authAtom} from '@/api/auth';
import {useAtomValue} from 'jotai';
import Logo from '@/assets/oneit.png';
import ParticipantAvatar from './components/ParticipantAvatar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import BasketInfoCard from './components/BasketInfoCard';
import KakaoShare from '@/components/common/KakaoShare';
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

const Basket = () => {
    const user = useAtomValue(authAtom);
    const {basketID} = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () => fetchBasketInfo(basketID || ''),
    });

    const basketProductAPI = useQuery({
        queryKey: ['basket', basketID, 'products'],
        queryFn: () => fetchBasketProducts(basketID || ''),
        enabled: basketInfoAPI.isSuccess && !basketInfoAPI.isError,
    });
    // console.log(data);

    if (basketInfoAPI.error?.toString() === '3009') {
        return (
            <div className="w-full pb-5 justify-center content-center text-center flex flex-col gap-2">
                <p>바구니 참여자가 아닙니다.</p>
                <Button
                    onClick={() => {
                        navigate('/');
                    }}
                    className="w-fit mx-auto"
                >
                    메인으로
                </Button>
            </div>
        );
    }
    if (basketInfoAPI.error?.toString() === '4005') {
        return <NotFound />;
    }
    console.log(basketProductAPI?.error);

    const handleGoBack = () => {
        navigate(-1);
    };
    const handleDelete = async () => {
        try {
            await deleteBasket(basketID || '');
            navigate('/');
        } catch (error) {
            if (error?.toString() === '3008') {
                toast.error('바구니 관리자가 아닙니다.');
            } else {
                console.error(error);
                setError(true);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/basket/edit/${basketID}`);
    };
    const handleSend = async () => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
        Kakao.Picker.selectFriends({
            title: '친구 선택',
            maxPickableCount: 1,
            minPickableCount: 1,
        })
            .then((res: FriendPickerResponse) => {
                console.log(res);
                const uuid = res.users[0].uuid;
                Kakao.API.request({
                    url: '/v1/api/talk/friends/message/default/send',
                    data: {
                        receiver_uuids: [uuid],
                        template_object: {
                            object_type: 'feed',
                            content: {
                                title: `${user?.nickname}님이 선물 바구니를 보냈습니다.`,
                                description: 'ONE!T에서 확인해보세요!',
                                image_url:
                                    basketInfoAPI.data?.imageUrl ||
                                    'https://via.placeholder.com/200',
                                link: {
                                    web_url: `https://www.oneit.gift/basket/${basketID}`,
                                    mobile_web_url: `https://www.oneit.gift/basket/${basketID}`,
                                },
                            },
                            buttons: [
                                {
                                    title: '웹으로 보기',
                                    link: {
                                        mobile_web_url: `https://www.oneit.gift/basket/${basketID}`,
                                        web_url: `https://www.oneit.gift/basket/${basketID}`,
                                    },
                                },
                            ],
                        },
                    },
                })
                    .then((response: any) => {
                        console.log(response);
                        toast.success('선물 바구니 전달 완료');
                    })
                    .catch((error: any) => {
                        console.log(error);
                        toast.error('선물 바구니 전달 실패');
                    });
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    const handleInvite = async () => {
        console.log(import.meta.env.BASE_URL);

        basketInvite(basketID || '').then((res) => {
            const invitationIdx = res.invitationIdx;

            const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/basket/${basketID}/invite/${invitationIdx}`;
            if (!Kakao.isInitialized()) {
                Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
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
        });
    };

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    if (basketInfoAPI.isLoading) return <Spinner />;
    if (basketInfoAPI.isError) return <NotFound />;

    return (
        <>
            <div className="w-full pb-5">
                <div className="flex py-3 flex-wrap items-center justify-between">
                    <Button
                        variant="ghost"
                        size="icon"
                        className=""
                        onClick={handleGoBack}
                    >
                        <ChevronLeft className="" />
                    </Button>
                    {/* <p>{data?.brandName}</p> */}
                    <div className="flex">
                        {/* <Button variant="ghost" size="icon">
                            <Heart />
                        </Button> */}
                        {basketInfoAPI.data?.accessStatus === 'PUBLIC' ? (
                            <KakaoShare
                                title={
                                    'ONE!T 선물 바구니 - ' +
                                    basketInfoAPI.data?.name
                                }
                                description={
                                    basketInfoAPI.data?.description || 'ONE!T'
                                }
                                image={
                                    basketInfoAPI.data?.imageUrl ||
                                    'https://www.oneit.gift/oneit.png'
                                }
                                url={`https://oneit.gift/basket/share/${basketInfoAPI.data?.idx}`}
                            />
                        ) : (
                            <Button variant="ghost" size="icon" disabled>
                                <LockKeyhole />
                            </Button>
                        )}
                        {basketInfoAPI.data.participants?.some(
                            (participant: Participant) =>
                                participant.userIdx == user?.idx,
                        ) && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <Settings />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-30"
                                    side="bottom"
                                    align="end"
                                >
                                    <DropdownMenuLabel>
                                        바구니 설정
                                    </DropdownMenuLabel>
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                navigate(
                                                    `/basket/add/${basketID}`,
                                                );
                                            }}
                                        >
                                            <PlusSquare className="mr-2" />
                                            <span>상품추가</span>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onSelect={handleInvite}
                                        >
                                            <MailPlusIcon className="mr-2" />
                                            <span>초대하기</span>
                                        </DropdownMenuItem>
                                        {user?.idx ===
                                            basketInfoAPI.data
                                                ?.createdUserIdx && (
                                            <>
                                                <DropdownMenuItem
                                                    onSelect={handleSend}
                                                >
                                                    <Send className="mr-2" />
                                                    <span>보내기</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={handleEdit}
                                                >
                                                    <Edit className="mr-2" />
                                                    <span>수정하기</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onSelect={handleDelete}
                                                >
                                                    <Trash className="mr-2" />
                                                    <span>삭제하기</span>
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>

                <BasketInfoCard
                    basket={basketInfoAPI.data}
                    className=" overflow-hidden  w-full my-2"
                />
                <div className="p-1 w-full text-center justify-center bg-oneit-blue flex items-center rounded-md mb-3">
                    <h3 className="text-lg font-bold align-middle">
                        상품 목록
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {basketProductAPI.data?.map((product: Product) => (
                        <BasketProductCard
                            shared={false}
                            key={product.idx}
                            product={product}
                            basketID={basketID || ''}
                        />
                    ))}
                    <div
                        className="rounded-lg overflow-hidden shadow-sm flex items-center justify-center hover:bg-primary-foreground"
                        onClick={(e) => navigate(`/basket/add/${basketID}`)}
                    >
                        상품 추가
                    </div>
                </div>
            </div>
            {error && (
                <Dialog open={error} onOpenChange={setError}>
                    <DialogContent
                        className="sm:max-w-[425px]"
                        onInteractOutside={(e: {
                            preventDefault: () => void;
                        }) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>문제 발생</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            문제가 발생했습니다. 다시 시도해주세요.
                        </DialogDescription>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setError(false);
                                    navigate('/');
                                }}
                            >
                                메인으로
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => {
                                    setError(false);
                                }}
                            >
                                다시시도
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            <Button
                className="fixed bottom-16 right-0 px-3 py-6 rounded-full shadow-lg m-1"
                onClick={scrollToTop}
            >
                <ArrowUp />
            </Button>
        </>
    );
};

export default Basket;
