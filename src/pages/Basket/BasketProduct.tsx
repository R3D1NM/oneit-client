import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import Gift from '@/assets/images/giftbox.png';
import {Button} from '@/components/ui/button';
import KakaoShare from '@/components/common/KakaoShare';
import {
    ArrowRightSquare,
    CalendarCheck,
    CheckSquare2,
    ChevronLeft,
    CircleEllipsis,
    EllipsisVertical,
    Heart,
    MoveRight,
    Send,
    Trash2,
    XCircleIcon,
} from 'lucide-react';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {Separator} from '@/components/ui/separator';
import {fetchProduct} from '@/api/product';
import {useAtom, useAtomValue} from 'jotai';
import {ScrollArea} from '@/components/ui/scroll-area';
import {cn} from '@/lib/utils';
import {authAtom, isLoginAtom} from '@/api/auth';
import {useState} from 'react';
import {
    addBasketProductComment,
    basketProductVote,
    deleteBasketProduct,
    deleteBasketProductComment,
    fetchBasketProductComments,
    fetchBasketProductDetail,
    productPurchased,
} from '@/api/basket';
import {BaksetProduct, Comment, Keyword} from '@/lib/types';
import {set} from 'date-fns';
import Header from '@/components/common/Header';
import mageHeart from '@/assets/images/mage_heart.svg';
import mageHeartFill from '@/assets/images/mage_heart_fill.svg';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {DropdownMenuTrigger} from '@radix-ui/react-dropdown-menu';
import logo from '@/assets/images/oneit.png';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {toast} from 'sonner';

const BasketProduct = () => {
    const {basketID, productID} = useParams();
    const loggedIn = useAtomValue(isLoginAtom);
    const user = useAtomValue(authAtom);
    const navigate = useNavigate();
    //todo: get vote info from API
    const [vote, setVote] = useState<'LIKE' | 'DISLIKE' | 'NONE'>('NONE');
    const [count, setCount] = useState(0);
    const [text, setText] = useState('');
    const queryClient = useQueryClient();

    const fetchCommentsAPI = useQuery({
        queryKey: ['comments', basketID, productID],
        queryFn: () =>
            fetchBasketProductComments(basketID || '', productID || ''),
    });

    const productAPI = useQuery({
        queryKey: ['basketProduct', basketID, productID],
        queryFn: () => {
            return fetchBasketProductDetail(
                basketID || '',
                productID || '',
            ).then((data) => {
                setVote(data.voteStatus);
                setCount(data.likeCountInGiftbox);
                return data;
            });
        },
    });

    const purchasedAPI = useMutation({
        mutationKey: ['purchased'],
        mutationFn: () => productPurchased(basketID || '', productID || ''),
        onSuccess: () => {
            queryClient.setQueryData(
                ['product', productID],
                (prev: BaksetProduct) => {
                    if (prev) {
                        return {
                            ...prev,
                            purchaseStatus:
                                prev.purchaseStatus === 'PURCHASED'
                                    ? 'NOT_PURCHASED'
                                    : 'PURCHASED',
                        };
                    }
                },
            );
            toast('해당 상품의 구매 여부를 표시했어요!');
            // navigate(`/basket/${basketID}`, {replace: true});
        },
    });

    const addCommentAPI = useMutation({
        mutationFn: () =>
            addBasketProductComment(basketID || '', productID || '', text),
        mutationKey: ['addComment'],
        onSuccess: (data) => {
            queryClient.setQueryData(
                ['comments', basketID, productID],
                (prev: Comment[]) => (prev ? [...prev, data] : [data]),
            );
            setText('');
        },
    });

    const deleteCommentAPI = useMutation({
        mutationFn: (commentID: number) =>
            deleteBasketProductComment(commentID),
        mutationKey: ['deleteComment'],
        onSuccess: (data, variables) => {
            queryClient.setQueryData(
                ['comments', basketID, productID],
                (prev: Comment[]) =>
                    prev?.filter((comment) => comment.idx !== variables),
            );
        },
    });

    const voteAPI = useMutation({
        mutationFn: () =>
            basketProductVote(basketID || '', productID || '', 'uuid', vote),
    });

    const deleteBasketProductAPI = useMutation({
        mutationKey: ['deleteBasketProduct'],
        mutationFn: () =>
            deleteBasketProduct(basketID || '', productID?.toString() || ''),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['basket', basketID]});
            navigate(`/basket/${basketID}`, {replace: true});
        },
    });

    const handlePurchased = () => {
        purchasedAPI.mutate();
    };

    const handleVote = () => {
        let newVote: 'LIKE' | 'DISLIKE' | 'NONE';
        let newCount: number;

        if (vote === 'LIKE') {
            newVote = 'NONE';
            newCount = count - 1;
        } else {
            newVote = 'LIKE';
            newCount = count + 1;
        }

        setVote(newVote);
        setCount(newCount);

        // console.log(basketID, product.idx, 'uuid', newVote);

        voteAPI.mutate();
    };
    const handleText = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        console.log(text);
        addCommentAPI.mutateAsync();
    };

    const handleDeleteComment = (commentID: number) => {
        deleteCommentAPI.mutate(commentID);
    };

    const handleDelete = () => {
        deleteBasketProductAPI.mutate();
    };

    if (productAPI.isLoading) return <Spinner />;
    if (productAPI.isError) return <NotFound />;

    return (
        <>
            <Header variant="back" btn_back={false} />

            <div className="cardDetail scrollbar-hide pt-24 pb-0">
                <div className="image_area ">
                    <img
                        src={productAPI?.data?.thumbnailUrl || logo}
                        alt="상품 썸네일"
                    />

                    <div className="black_area">
                        {vote == 'LIKE' ? (
                            <i
                                className="w-7 h-7 mr-0.5 bg-center bg-contain bg-no-repeat block"
                                onClick={handleVote}
                            >
                                <img
                                    src={mageHeartFill}
                                    alt="Heart"
                                    className="w-full h-full object-contain"
                                />
                            </i>
                        ) : (
                            <i
                                className="w-7 h-7 mr-0.5 bg-center bg-contain bg-no-repeat block"
                                onClick={handleVote}
                            >
                                <img
                                    src={mageHeart}
                                    alt="Heart"
                                    className="w-full h-full object-contain"
                                />
                            </i>
                        )}
                        <span
                            className={cn(vote == 'LIKE' && 'text-[#FF5757]')}
                        >
                            {count}
                        </span>
                        {productAPI?.data?.purchaseStatus === 'PURCHASED' ? (
                            <span>이미 누군가 구매한 제품이에요 :(</span>
                        ) : (
                            <span>명이 이 선물을 좋아하고 있어요!</span>
                        )}
                        <div className="flex justify-end ml-16 pr-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button>
                                        <EllipsisVertical />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="mr-2">
                                    <DropdownMenuItem>
                                        <div
                                            onClick={() =>
                                                navigate(
                                                    `/product/${productID}`,
                                                )
                                            }
                                            className="flex justify-between w-full"
                                        >
                                            더 알아보기
                                            <ArrowRightSquare />
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <div
                                            onClick={handlePurchased}
                                            className="flex justify-between w-full"
                                        >
                                            {productAPI?.data
                                                ?.purchaseStatus !== 'PURCHASED'
                                                ? '구매 표시하기'
                                                : '구매 해제하기'}
                                            <CheckSquare2 />
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <div
                                            className="flex w-full justify-between"
                                            onClick={handleDelete}
                                        >
                                            삭제하기
                                            <XCircleIcon className="text-[#FF5757]" />
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <div className="prd_info">
                    <div className="brand">{productAPI?.data?.brandName}</div>
                    <div className="title">{productAPI?.data?.name}</div>
                    <div className="price">
                        <span>₩</span>{' '}
                        {productAPI?.data?.originalPrice.toLocaleString()}
                    </div>
                </div>
                <div className="tag_area">
                    <div className="title">Tag</div>
                    <ul>
                        {productAPI.data?.keywords?.map(
                            (keyword: Keyword, idx: number) => (
                                <li key={idx}>
                                    <button disabled>{keyword.name}</button>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
                <Tabs defaultValue="chat" className="p-1 w-full mt-2">
                    <TabsList className="w-full ">
                        <TabsTrigger value="chat" className="w-full">
                            선물 토크
                        </TabsTrigger>
                        <TabsTrigger value="detail" className="w-full">
                            상세 정보
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="chat" className="talk_area">
                        <div className="chat_area min-h-32 shadow-sm shadow-[#ffcaf2]  rounded-md  overflow-y-auto scrollbar-hide ">
                            {fetchCommentsAPI?.data?.length === 0 && (
                                <div className="flex justify-center text-center">
                                    첫 번째 댓글을 남겨보세요!
                                </div>
                            )}
                            {fetchCommentsAPI?.data?.map(
                                (comment: Comment, idx: number) => {
                                    if (comment.writerIdx == user?.idx) {
                                        return (
                                            <div
                                                key={comment.idx}
                                                className={cn('talking me')}
                                            >
                                                <div className="del">
                                                    <button
                                                        className="btn_del"
                                                        onClick={() =>
                                                            handleDeleteComment(
                                                                comment.idx,
                                                            )
                                                        }
                                                    >
                                                        토크삭제
                                                    </button>
                                                </div>
                                                <div className="info">
                                                    <div className="ballon">
                                                        {comment.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div
                                                className="talking you"
                                                key={comment.idx}
                                            >
                                                <div className="thum">
                                                    {/* todo: get profile of writer */}
                                                    <img
                                                        src={
                                                            comment?.writerProfileImg
                                                        }
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className="info">
                                                    <p className="name">
                                                        {comment.writerNickName}
                                                    </p>
                                                    <div className="ballon">
                                                        {comment.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                },
                            )}
                        </div>
                        <form
                            className="talk_input_fixed px-1 "
                            onSubmit={handleText}
                        >
                            <input
                                type="text"
                                placeholder="이 제품을 추천/비추천하는 이유를 작성해보세요!"
                                onChange={(e) => setText(e.target.value)}
                                value={text}
                            />
                            <button className="btn_send" type="submit"></button>
                        </form>
                    </TabsContent>
                    {/* todo: product detail image */}
                    {productAPI?.data?.detailImages && (
                        <TabsContent value="detail" className="detail_area">
                            {productAPI?.data?.detailImages?.map(
                                (img: string, idx: number) => (
                                    <img
                                        key={`image-${idx}`}
                                        src={img}
                                        alt="상품 상세 이미지"
                                    />
                                ),
                            )}
                        </TabsContent>
                    )}
                    {/* <TabsContent value="detail">제품 상세 이미지</TabsContent> */}
                </Tabs>
            </div>
        </>
    );
};

export default BasketProduct;
