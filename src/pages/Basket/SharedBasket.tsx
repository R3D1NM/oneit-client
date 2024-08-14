import {
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
import {Participant, Product} from '@/lib/types';
import BasketProductCard from './components/BasketProductCard';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import ParticipantAvatar from './components/ParticipantAvatar';
import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {cn} from '@/lib/utils';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import BasketInfoCard from './components/BasketInfoCard';

const SharedBasket = () => {
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

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    if (basketInfoAPI.isLoading) return <Spinner />;
    if (basketInfoAPI.isError) return <NotFound />;

    return (
        <>
            <div className="w-full pb-5">
                <div className="flex py-3 flex-wrap items-center justify-end">
                    <div className="flex">
                        <Button variant="ghost" size="icon">
                            <Heart />
                        </Button>
                    </div>
                </div>

                <BasketInfoCard
                    basket={basketInfoAPI.data}
                    className="overflow-hidden  group  w-full my-2 "
                />
                <div className="p-1 w-full text-center justify-center bg-oneit-blue flex items-center rounded-md mb-3">
                    <h3 className="text-lg font-bold align-middle">
                        상품 목록
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {basketProductAPI.data?.map((product: Product) => (
                        <BasketProductCard
                            shared={true}
                            key={product.idx}
                            product={product}
                            basketID={basketID || ''}
                        />
                    ))}
                    <div
                        className="rounded-lg overflow-hidden shadow-sm flex items-center justify-center hover:bg-primary-foreground text-center"
                        onClick={(e) => navigate(`/login`)}
                    >
                        카카오 로그인하고
                        <br /> 상품 추가하기
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

export default SharedBasket;
