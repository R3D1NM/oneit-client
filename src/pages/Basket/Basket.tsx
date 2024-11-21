import {
    basketInvite,
    deleteBasket,
    fetchBasketInfo,
    fetchBasketProducts,
    searchKewordProduct,
} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../NotFound';
import {BaksetProduct, Participant} from '@/lib/types';
import BasketProductCard from './components/BasketProductCard';
import {toast} from 'sonner';
import {authAtom} from '@/api/auth';
import {useAtom, useAtomValue} from 'jotai';

import BasketInfoCard from './components/BasketInfoCard';
import KakaoShare from '@/components/common/KakaoShare';
import {selctedProductCount, selectedProduct} from '@/atoms/basket';

import {useEffect, useState} from 'react';
import {createInquiry} from '@/api/inquiry';
import {SwipeableDrawer, Box, Typography} from '@mui/material';
import {Global} from '@emotion/react';
import Header from '@/components/common/Header';
import giftBox2 from '@/assets/images/giftBox2.svg';
import giftMessage from '@/assets/images/gift_messege.svg';
import giftMessageFill from '@/assets/images/gift_messege_fill.svg';
import {cn} from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/common/Button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {ArrowUp} from 'lucide-react';

const {Kakao} = window;
const drawerBleeding = 48;
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
    const [{mutateAsync}] = useAtom(createInquiry);
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [dDay, setDDay] = useState(0);
    const [mode, setMode] = useState(false);
    const [keyword, setKeyword] = useState('');
    const toggleDrawer = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }
    }, []);

    const basketInfoAPI = useQuery({
        queryKey: ['basket', basketID],
        queryFn: () =>
            fetchBasketInfo(basketID || '').then((data) => {
                const dDay =
                    Math.ceil(
                        (new Date(data?.deadline).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24),
                    ) || 0;
                setDDay(dDay);
                return data;
            }),
    });

    const basketProductAPI = useQuery({
        queryKey: ['basket', basketID, 'products'],
        queryFn: () => fetchBasketProducts(basketID || ''),
        enabled: basketInfoAPI.isSuccess && !basketInfoAPI.isError,
    });

    const deleteAPI = useMutation({
        mutationFn: () => deleteBasket(basketID || ''),
        onSuccess: (data) => {
            navigate(`/basket/${basketID}`);
        },
    });

    const searchKeywordAPI = useMutation({
        mutationKey: ['searchKeywordBasketProduct'],
        mutationFn: async (keyword: string) => {
            return searchKewordProduct(basketID || '', keyword);
        },
    });

    if (basketInfoAPI.error) {
        console.log(basketInfoAPI.error);
    }

    const handleDelete = async () => {
        deleteAPI.mutate();
    };

    const handleCopy = async () => {
        mutateAsync({
            basketIdx: basketID || '',
            selected: basketProductAPI.data || [],
            target,
        }).then((data) => {
            const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/inquiry/${data}`;
            setMode(false);
            navigator.clipboard.writeText(url).then(() => {
                toast('클립보드에 복사되었습니다.');
            });
        });
    };

    const handleInquiry = () => {
        if (target === '' || basketProductAPI.data?.length === 0) {
            return;
        }

        if (
            !basketInfoAPI.data?.participants?.some(
                (parti: Participant) =>
                    parti.userRole == 'MANAGER' && parti.userIdx == user?.idx,
            )
        ) {
            toast.error('물어보기는 바구니 관리자만 가능합니다.');
            return;
        }

        mutateAsync({
            basketIdx: basketID || '',
            selected: basketProductAPI.data || [],
            target,
        })
            .then((data) => {
                const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/inquiry/${data}`;

                // toast.success('물어보기 전송 완료');
                Kakao.Share.sendDefault({
                    objectType: 'text',
                    text: `🎁친구들이 ${target}님을 위한 선물을 고르고 있어요!\n마음에 드는 선물을 고를 수 있도록 도와주세요🥺`,
                    link: {
                        mobileWebUrl: url,
                        webUrl: url,
                    },
                });
                setMode(false);
            })
            .catch((err) => {
                if (err?.response?.status === 403) {
                    toast.error('물어보기는 바구니 관리자만 가능합니다.');
                }
                // console.log(err);

                setMode(false);
            });
    };

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleSearch = () => {
        setSearchOpen(!searchOpen);
    };

    const handleModeChange = () => {
        if (basketProductAPI.data?.length === 0) return;
        if (
            !basketInfoAPI.data?.participants?.some(
                (parti: Participant) =>
                    parti.userRole == 'MANAGER' && parti.userIdx == user?.idx,
            )
        ) {
            toast.error('물어보기는 바구니 관리자만 가능합니다.');
            return;
        }
        setMode(!mode);
    };

    const handleKeyword = async (keyword: string) => {
        setKeyword(keyword);
        if (keyword.length > 1) {
            await searchKeywordAPI.mutateAsync(keyword);
        }
    };

    const calculateElapsedPercentage = (
        createdAt: string,
        deadline: string,
    ): number => {
        const createdAtDate = new Date(createdAt);
        const deadlineDate = new Date(deadline);
        const todayDate = new Date();

        const totalTime = deadlineDate.getTime() - createdAtDate.getTime();
        const elapsedTime = todayDate.getTime() - createdAtDate.getTime();

        const percentage = (elapsedTime / totalTime) * 100;

        return Math.min(Math.max(percentage, 0), 100); // Ensure the percentage is between 0 and 100
    };

    if (basketInfoAPI.isLoading) return <Spinner />;
    if (basketInfoAPI.isError) return <NotFound />;

    return (
        <>
            <Header
                btn_back
                setting
                variant="back"
                profile
                title={basketInfoAPI.data?.name}
            />
            <div className="p-4 cardList scrollbar-hide">
                <div className="Dday_wrap">
                    <div className="graph">
                        {basketInfoAPI?.data?.dday !== undefined &&
                        basketInfoAPI.data.dday > 0 ? (
                            <div className="count">D-{dDay}</div>
                        ) : basketInfoAPI?.data?.dday === 0 ? (
                            <div className="count">D-Day</div>
                        ) : (
                            <div className="count">
                                {-(basketInfoAPI?.data?.dday ?? 0)}일 지남
                            </div>
                        )}
                        {(basketInfoAPI?.data?.dday ?? 0) < 3 &&
                            (basketInfoAPI?.data?.dday ?? 0) >= 0 && (
                                <p>
                                    마감일이 얼마 남지 않았어요 빨리 골라주세요
                                </p>
                            )}
                        {(basketInfoAPI?.data?.dday ?? 0) < 0 && (
                            <p>이미 마감된 선물 바구니입니다.</p>
                        )}

                        <div className="bar_wrap">
                            <div className="bar">
                                <div
                                    className="color"
                                    style={{
                                        width:
                                            dDay <= 0
                                                ? '100%'
                                                : `${calculateElapsedPercentage(basketInfoAPI!.data!.createdAt.toString(), basketInfoAPI!.data!.deadline)}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="giftBox"></div>
                        </div>
                    </div>
                    <Dialog open={mode} onOpenChange={handleModeChange}>
                        <DialogTrigger>
                            <div
                                className={cn(
                                    'image bg-center bg-contain bg-no-repeat block',
                                    mode &&
                                        'shadow-[#FF4BC1] rounded-full shadow-sm',
                                    !mode && 'animate-wiggle',
                                )}
                                style={{backgroundImage: `url(${giftMessage})`}}
                                onClick={handleModeChange}
                            ></div>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>선물 바구니 물어보기</DialogTitle>

                                <DialogDescription>
                                    선물 받는 사람에게 바구니에 담긴 선물이{' '}
                                    <br />
                                    마음에 드는지 물어보세요!
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="name"
                                        className="text-right"
                                    >
                                        받는 사람
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="받는 사람 이름"
                                        className="col-span-3"
                                        onChange={(e) =>
                                            setTarget(e.target.value)
                                        }
                                        value={target}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full gap-2">
                                <Button
                                    className="w-full"
                                    onClick={handleInquiry}
                                >
                                    카카오톡
                                </Button>
                                <Button
                                    className="w-full"
                                    onClick={handleCopy}
                                    variant="border"
                                >
                                    링크복사
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="mt-5 mb-8 rounding_border">
                    <div className="giftBox_title">
                        <div className="title">
                            <p>바구니에 담긴 선물</p>
                            <p>{basketProductAPI.data?.length}</p>
                        </div>
                        <div className="icons">
                            <button
                                className="btn_zoomer"
                                onClick={() => setSearchOpen(!searchOpen)}
                            ></button>
                        </div>
                    </div>
                    {searchOpen && (
                        <div className="flex gap-2 mt-2">
                            <input
                                type="text"
                                placeholder="검색어를 2자 이상 입력해주세요"
                                value={keyword}
                                onChange={(e) => handleKeyword(e.target.value)}
                            />
                        </div>
                    )}
                    {keyword.length < 2 ? (
                        basketProductAPI?.data?.length !== 0 ? (
                            <div className="mt-3 gift_list_in_basket ">
                                <ul>
                                    <li className="grid-cols-2 grid gap-2">
                                        {basketProductAPI.data?.map(
                                            (product: BaksetProduct) => (
                                                <BasketProductCard
                                                    shared={false}
                                                    key={product.idx}
                                                    product={product}
                                                    basketID={basketID || ''}
                                                    voteStatus={
                                                        product.voteStatus ||
                                                        'NONE'
                                                    }
                                                    likeCount={
                                                        product.likeCountInGiftbox ||
                                                        0
                                                    }
                                                    purchaseStatus={
                                                        product.purchaseStatus ||
                                                        'NOT_PURCHASED'
                                                    }
                                                />
                                            ),
                                        )}
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <p className="text-sm text-[#5d5d5d] text-center mt-7 mb-1">
                                    아직 선물 바구니가 비어있어요!
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="mt-3 gift_list_in_basket ">
                            <ul>
                                <li className="grid-cols-2 grid gap-2">
                                    {searchKeywordAPI.data?.map(
                                        (
                                            product: BaksetProduct,
                                            productIndex: number,
                                        ) => (
                                            <BasketProductCard
                                                shared={false}
                                                key={product.idx}
                                                product={product}
                                                basketID={basketID || ''}
                                                voteStatus={
                                                    product.voteStatus || 'NONE'
                                                }
                                                likeCount={
                                                    product.likeCountInGiftbox ||
                                                    0
                                                }
                                                purchaseStatus={
                                                    product.purchaseStatus ||
                                                    'NOT_PURCHASED'
                                                }
                                            />
                                        ),
                                    )}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <>
                <div className="fixed bottom-0 w-full p-2 right-1/2 translate-x-1/2 z-30">
                    <Button
                        className="w-full"
                        onClick={() => toggleDrawer(true)}
                    >
                        <img src={giftBox2} alt="선물 바구니 아이콘" />
                        선물 추가하기
                    </Button>
                </div>
                <Global
                    styles={{
                        '.MuiPaper-root.MuiPaper-root': {
                            // height: `calc(50% - ${drawerBleeding}px - 100px)`,
                            height: `160px`,

                            overflow: 'visible',
                        },
                    }}
                />
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onClick={() => toggleDrawer(!open)}
                    onClose={() => toggleDrawer(false)}
                    onOpen={() => toggleDrawer(true)}
                    // swipeAreaWidth={drawerBleeding}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    disableSwipeToOpen={false}
                    disableDiscovery={true}
                    // disableScrollLock={true}
                >
                    {/* <Box
                        sx={{
                            position: 'absolute',
                            top: -drawerBleeding,
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            visibility: 'visible',
                            right: 0,
                            left: 0,
                            background:
                                'linear-gradient(90deg, #ff4341, #ff4bc1)',
                        }}
                        onClick={() => toggleDrawer(true)} // Add onClick handler here
                    >
                        <Typography
                            sx={{
                                p: 1,
                                color: 'white',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <i>
                                <img src={giftBox2} alt="선물 바구니 아이콘" />
                            </i>
                            선물 추가하기
                        </Typography>
                    </Box> */}

                    <div className="bottom_sheet -z-10">
                        <button
                            className="btn_border pink"
                            onClick={() => navigate('/recommend')}
                        >
                            <i className="gift"></i>선물 요정에게 추천 받아
                            추가하기
                        </button>
                        <button
                            className="btn_border pink"
                            onClick={() => navigate('/curation')}
                        >
                            <i className="zoomer"></i>상품 검색을 통해 선물
                            추가하기
                        </button>
                    </div>
                </SwipeableDrawer>
            </>
        </>
    );
};

export default Basket;
