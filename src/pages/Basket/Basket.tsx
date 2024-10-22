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
import {Participant, Product} from '@/lib/types';
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
    const [{mutate}] = useAtom(createInquiry);
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [dDay, setDDay] = useState(0);
    const [mode, setMode] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    //redirect go back to basket page
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault();
            navigate(`/basket`);
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

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

    const handleDelete = async () => {
        deleteAPI.mutate();
    };

    const handleInquiry = () => {
        mutate({basketIdx: basketID || '', selected, target});
        setSelected([]);
    };

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    //todo: search product by keyword & filtering
    const handleSearch = () => {
        setSearchOpen(!searchOpen);
    };

    const handleModeChange = () => {
        if (basketProductAPI.data?.length === 0) return;
        console.log('mode change', mode);

        setMode(!mode);
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
                        {dDay >= 0 ? (
                            <div className="count">
                                D-
                                {dDay}
                            </div>
                        ) : (
                            <div className="count">{-dDay}일 지남</div>
                        )}
                        {dDay < 3 && dDay >= 0 && (
                            <p>마감일이 얼마 남지 않았어요 빨리 골라주세요</p>
                        )}
                        {dDay < 0 && <p>이미 마감된 선물 바구니입니다.</p>}

                        <div className="bar_wrap">
                            <div className="bar">
                                <div
                                    className="color"
                                    // todo: change graph depending on dDay
                                    style={{
                                        width:
                                            dDay <= 0
                                                ? '100%'
                                                : `${((basketInfoAPI.data - dDay) * 100) / 3}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="giftBox"></div>
                        </div>
                    </div>
                    <button
                        className={cn(
                            'image animate-pulse bg-center bg-contain bg-no-repeat block',
                            mode && 'bg-border-[#FF4BC1] border-4',
                        )}
                        style={{backgroundImage: `url(${giftMessage})`}}
                        onClick={handleModeChange}
                    ></button>
                </div>

                <div className="mt-5 rounding_border">
                    <div className="giftBox_title">
                        <div className="title">
                            <p>바구니에 담긴 선물</p>
                            <p>{basketProductAPI.data?.length}</p>
                        </div>
                        <div className="icons">
                            <button
                                className="btn_zoomer"
                                onClick={handleSearch}
                            ></button>
                            <button className="btn_filter"></button>
                        </div>
                    </div>
                    {basketProductAPI?.data?.length !== 0 ? (
                        <div className="mt-3 gift_list ">
                            <ul>
                                <li className="grid-cols-2 grid gap-2">
                                    {basketProductAPI.data?.map(
                                        (product: Product) => (
                                            <BasketProductCard
                                                shared={false}
                                                key={product.idx}
                                                product={product}
                                                basketID={basketID || ''}
                                                voteStatus={
                                                    product.voteStatus || 'NONE'
                                                }
                                                likeCount={
                                                    product.likeCount || 0
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
                    )}
                </div>
            </div>

            <>
                <Global
                    styles={{
                        '.MuiPaper-root.MuiPaper-root': {
                            height: `calc(50% - ${drawerBleeding}px - 100px)`,
                            overflow: 'visible',
                        },
                    }}
                />
                <SwipeableDrawer
                    anchor="bottom"
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                    swipeAreaWidth={drawerBleeding}
                    ModalProps={{
                        keepMounted: true,
                    }}
                >
                    <Box
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
                    >
                        {/* <Box
              sx={{
                width: 30,
                height: 6,
                bgcolor: "grey.300",
                borderRadius: "3px",
                position: "absolute",
              }}
            /> */}
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
                    </Box>

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
                        {/* <button className="btn_border pink">
                            <i className="link"></i>외부 링크 가져오기
                        </button> */}
                    </div>
                </SwipeableDrawer>
                {/* <Button
                    className="fixed bottom-[48px] right-0 z-[999] px-3 py-6 rounded-full shadow-lg m-1"
                    onClick={scrollToTop}
                >
                    <ArrowUp />
                </Button> */}
            </>
        </>
    );
};

export default Basket;
