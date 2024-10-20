import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import Gift from '@/assets/giftbox.png';
import {Button} from '@/components/ui/button';
import KakaoShare from '@/components/common/KakaoShare';
import {
    CalendarCheck,
    ChevronLeft,
    Heart,
    MoveRight,
    Send,
    Trash2,
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
    deleteBasketProductComment,
    fetchBasketProductComments,
} from '@/api/basket';
import {Comment} from '@/lib/types';
import {set} from 'date-fns';

const BasketProduct = () => {
    const {basketID, productID} = useParams();
    const loggedIn = useAtomValue(isLoginAtom);
    const user = useAtomValue(authAtom);
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const queryClient = useQueryClient();

    const fetchCommentsAPI = useQuery({
        queryKey: ['comments', basketID, productID],
        queryFn: () =>
            fetchBasketProductComments(basketID || '', productID || ''),
    });

    const productAPI = useQuery({
        queryKey: ['product', productID],
        queryFn: () => fetchProduct(productID || ''),
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

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleText = (e: {preventDefault: () => void}) => {
        e.preventDefault();
        console.log(text);
        addCommentAPI.mutateAsync();
    };

    const handleDeleteComment = (commentID: number) => {
        deleteCommentAPI.mutate(commentID);
    };

    if (productAPI.isLoading) return <Spinner />;
    if (productAPI.isError) return <NotFound />;

    return (
        <div className={cn('w-full', loggedIn ? 'pb-20' : 'pb-16')}>
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
                    <Button variant="ghost" size="icon">
                        <Heart />
                    </Button>
                    <KakaoShare
                        title="ONE!T - 선물 추천"
                        description={productAPI.data?.name || 'ONE!T'}
                        url={`/product/${productAPI.data?.idx}`}
                        image={
                            productAPI.data?.thumbnailUrl ||
                            'https://www.oneit.gift/oneit.png'
                        }
                    />
                </div>
            </div>

            <div className="flex justify-center w-full">
                <img
                    src={productAPI.data?.thumbnailUrl || Gift}
                    alt="recommended product"
                    // width={200}
                    // height={200}
                    className="object-cover group-hover:opacity-50 transition-opacity"
                />
            </div>
            <div className="py-2 bg-white dark:bg-gray-950">
                <p className="text-oneit-gray text-sm mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                    {productAPI.data?.categoryDisplayName}
                </p>
                <a
                    href={productAPI.data?.productUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <h3 className="text-xl font-bold md:text-xl">
                        {productAPI.data?.name}
                    </h3>
                </a>
                <div className="flex items-center justify-between mt-2">
                    <p>{productAPI.data?.brandName}</p>
                    <h4 className="text-base font-semibold md:text-lg text-onei">
                        {productAPI.data?.originalPrice.toLocaleString()}원
                    </h4>
                </div>
            </div>
            <Separator className="mb-2" />
            <div className="flex flex-col">
                <div className="flex w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                    <p className="text-oneit-pink text-sm inline-block">
                        {productAPI.data?.keywords?.map((keyword, idx) => (
                            <span
                                key={idx}
                                className="mr-1"
                            >{`#${keyword}`}</span>
                        ))}
                    </p>
                </div>
                <div className="flex">
                    <p className="break-words  whitespace-normal">
                        {productAPI.data?.description}
                    </p>
                </div>
            </div>
            <div className="pt-1">
                <p>선물 토크</p>
                <div className="bg-[#FEF1FA] w-full min-h-32">
                    <div className="flex w-full gap-2 flex-col">
                        {fetchCommentsAPI?.data?.map(
                            (comment: Comment, idx: number) => {
                                if (comment.writerIdx == user?.idx) {
                                    return (
                                        <div
                                            key={idx}
                                            className={cn(
                                                'flex gap-2',
                                                'justify-end',
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <p>{comment.writerNickName}</p>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            comment.idx,
                                                        )
                                                    }
                                                >
                                                    <Trash2 />
                                                </button>
                                            </div>
                                            <p>{comment.content}</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            'flex gap-2',
                                            user?.idx == comment.writerIdx
                                                ? 'justify-end'
                                                : 'justify-start',
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <p>{comment.writerNickName}</p>
                                        </div>
                                        <p>{comment.content}</p>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>
                <form className="flex w-full gap-2" onSubmit={handleText}>
                    <input
                        className="w-full border-[#D1D1D1] border-2 rounded-md"
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                    ></input>
                    <button type="submit">
                        <Send />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BasketProduct;
