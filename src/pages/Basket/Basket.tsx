import {
    basketInvite,
    deleteBasket,
    fetchBasketInfo,
    fetchBasketProducts,
} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../NotFound';
import {Button} from '@/components/ui/button';
import {
    ArrowUp,
    ChevronLeft,
    Edit,
    LockKeyhole,
    MailPlusIcon,
    PlusSquare,
    Send,
    Settings,
    Trash,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Participant, Product} from '@/lib/types';
import BasketProductCard from './components/BasketProductCard';
import {toast} from 'sonner';
import {authAtom} from '@/api/auth';
import {useAtom, useAtomValue} from 'jotai';

import BasketInfoCard from './components/BasketInfoCard';
import KakaoShare from '@/components/common/KakaoShare';
import {selctedProductCount, selectedProduct} from '@/atoms/basket';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {useEffect, useState} from 'react';
import {createInquiry} from '@/api/inquiry';
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
    const selectedCount = useAtomValue(selctedProductCount);
    const [selected, setSelected] = useAtom(selectedProduct);
    const [target, setTarget] = useState('');
    const [{mutate}] = useAtom(createInquiry);

    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
    }, []);

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

    const deleteAPI = useMutation({
        mutationFn: () => deleteBasket(basketID || ''),
        onSuccess: (data) => {
            navigate(`/basket/${basketID}`);
        },
    });

    const inviteAPI = useMutation({
        mutationFn: () => basketInvite(basketID || ''),
        onSuccess: (data) => {
            const invitationIdx = data.invitationIdx;

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
            });
        },
    });

    if (basketInfoAPI.error) {
        console.log(basketInfoAPI.error);
    }

    const handleGoBack = () => {
        navigate(-1);
    };
    const handleDelete = async () => {
        deleteAPI.mutate();
    };

    const handleEdit = () => {
        navigate(`/basket/edit/${basketID}`);
    };
    const handleSend = async () => {
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

    const handleInquiry = () => {
        mutate({basketIdx: basketID || '', selected, target});
        setSelected([]);
    };

    const handleInvite = async () => {
        console.log(import.meta.env.BASE_URL);
        inviteAPI.mutate();
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
                                url={`/basket/share/${basketID}`}
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
                            voteStatus={product.voteStatus || 'NONE'}
                            likeCount={product.likeCount || 0}
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

            <Button
                className="fixed bottom-0 right-0 px-3 py-6 rounded-full shadow-lg m-1"
                onClick={scrollToTop}
            >
                <ArrowUp />
            </Button>
            {selectedCount > 0 && (
                <nav className="fixed bottom-16  w-full bg-white shadow-md flex justify-center max-w-sm gap-2 rounded-lg">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
                            >
                                <span className="text-xs">물어보기</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    물어볼 상대의 이름을 입력해주세요
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="taget"
                                        className="text-right"
                                    >
                                        이름
                                    </Label>
                                    <Input
                                        id="target"
                                        placeholder="누구에게 물어볼까요?"
                                        className="col-span-3"
                                        value={target}
                                        onChange={(e) =>
                                            setTarget(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleInquiry} type="submit">
                                    물어보기
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        variant="ghost"
                        onClick={() => setSelected([])}
                        className="w-full flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                        <span className="text-xs">선택 해제</span>
                    </Button>
                </nav>
            )}
        </>
    );
};

export default Basket;
