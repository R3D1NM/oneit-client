import {deleteBasket, fetchBasketInfo, fetchBasketProducts} from '@/api/basket';
import {Spinner} from '@/components/ui/spinner';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import NotFound from '../NotFound';
import {Button} from '@/components/ui/button';
import {
    ArrowUp,
    CalendarCheck,
    ChevronLeft,
    Edit,
    Heart,
    LockKeyhole,
    PlusSquare,
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
import {Product} from '@/lib/types';
import BasketProductCard from './components/BasketProductCard';

const Basket = () => {
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
    });
    // console.log(data);

    const handleGoBack = () => {
        navigate(-1);
    };
    const handleDelete = async () => {
        try {
            await deleteBasket(basketID || '');
            navigate('/');
        } catch (error) {
            console.error(error);
            setError(true);
        }
    };

    const handleEdit = () => {
        navigate(`/basket/edit/${basketID}`);
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
                        <Button variant="ghost" size="icon">
                            <Heart />
                        </Button>
                        {basketInfoAPI.data?.accessStatus === 'PUBLIC' ? (
                            <Share
                                title="ONE!T"
                                text={basketInfoAPI.data?.name || 'ONE!T'}
                                url={`https://oneit.gift/basket/${basketInfoAPI.data?.idx}`}
                            />
                        ) : (
                            <Button variant="ghost" size="icon" disabled>
                                <LockKeyhole />
                            </Button>
                        )}
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
                                    <DropdownMenuItem onSelect={handleEdit}>
                                        <Edit />
                                        <span>수정하기</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={(e) => {
                                            navigate(`/basket/add/${basketID}`);
                                        }}
                                    >
                                        <PlusSquare />
                                        <span>상품추가</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={handleDelete}>
                                        <Trash />
                                        <span>삭제하기</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="flex justify-center w-full">
                    <img
                        src={
                            basketInfoAPI.data?.imageUrl ||
                            'https://via.placeholder.com/200'
                        }
                        alt="recommended product"
                        // width={200}
                        // height={200}
                        className="object-cover group-hover:opacity-50 transition-opacity"
                    />
                </div>
                <div className="py-2 bg-white dark:bg-gray-950">
                    <h3 className="text-xl font-bold md:text-xl">
                        {basketInfoAPI.data?.name}
                    </h3>
                    <p className="text-oneit-gray text-sm mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">
                        {basketInfoAPI.data?.description}
                    </p>
                    <div className="flex items-center justify-end">
                        <span className="text-sm text-gray-500">
                            <CalendarCheck className="inline-block mr-1" />
                            {
                                basketInfoAPI.data?.deadline
                                    .toString()
                                    .split('T')[0]
                            }
                        </span>
                    </div>
                </div>
                <div className="p-1 w-full text-center justify-center bg-oneit-blue flex items-center rounded-md mb-3">
                    <h3 className="text-lg font-bold align-middle">
                        상품 목록
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {basketProductAPI.data?.map((product: Product) => (
                        <BasketProductCard
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
