import {Product} from '@/lib/types';
import {useEffect, useRef} from 'react';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {useProductListInfinite} from '@/hooks/useProductListInfinite';
import {Button} from '@/components/ui/button';
import {ArrowUp, ChevronLeft} from 'lucide-react';
import AddProductCard from './components/AddProductCard';
import {
    emptySelected,
    selctedProductCount,
    selectedProduct,
} from '@/atoms/basket';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {useNavigate, useParams} from 'react-router-dom';
import {addToBasket} from '@/api/basket';

const AddToBasket = () => {
    const {data, isLoading, isError, fetchNextPage, hasNextPage} =
        useProductListInfinite();
    const nextFetchTargetRef = useRef<HTMLDivElement | null>(null); // ref 객체 생성
    const selectedCount = useAtomValue(selctedProductCount);
    const [selected, setSelected] = useAtom(selectedProduct);
    const [{mutate}] = useAtom(addToBasket);
    const {basketID} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '30px',
            threshold: 0.2,
        };

        const fetchCallback: IntersectionObserverCallback = (
            entries,
            observer,
        ) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && hasNextPage) {
                    console.log('fetch next page');

                    fetchNextPage?.();
                    observer.unobserve(entry.target);
                }
            });
        };
        const observer = new IntersectionObserver(fetchCallback, options);
        // console.log(nextFetchTargetRef.current);

        if (nextFetchTargetRef.current) {
            // console.log('observe');

            observer.observe(nextFetchTargetRef.current);
        }

        return () => {
            if (nextFetchTargetRef.current) {
                observer.unobserve(nextFetchTargetRef.current);
            }
        };
    }, [data, hasNextPage, fetchNextPage]);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleGoBack = () => {
        navigate('/basket/' + basketID);
    };

    const handleAdd = async () => {
        mutate({basketIdx: basketID || '', selected});
        setSelected([]);
        // emptyAll();
    };

    if (isLoading) return <Spinner />;
    if (isError) return <NotFound />;

    return (
        <div className="w-full mt-4 flex flex-col content-center justify-center align-middle items-center overflow-y-auto scrollbar-hide">
            <div className="flex py-3 flex-wrap items-center justify-start">
                <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={handleGoBack}
                >
                    <ChevronLeft className="" />
                </Button>
                <h1 className="text-lg font-bold">상품 추가하기 </h1>
            </div>
            <div className="container py-5 px-2 grid grid-cols-2 gap-2">
                {data?.pages.map((page, pageIndex) =>
                    page.map((product: Product, productIndex: number) => (
                        <AddProductCard
                            key={`${pageIndex}-${productIndex}`}
                            product={product}
                        />
                    )),
                )}
            </div>
            {hasNextPage && (
                <div ref={nextFetchTargetRef} className="col-span-2"></div>
            )}
            <Button
                className="fixed bottom-16 right-0 px-3 py-6 rounded-full shadow-lg m-1"
                onClick={scrollToTop}
            >
                <ArrowUp />
            </Button>
            {selectedCount > 0 && (
                <nav className="fixed bottom-16  w-full bg-white shadow-md flex justify-center max-w-sm gap-2 rounded-lg">
                    <Button
                        variant="ghost"
                        className="w-full flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
                        onClick={handleAdd}
                    >
                        <span className="text-xs">추가하기</span>
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setSelected([])}
                        className="w-full flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground"
                    >
                        <span className="text-xs">선택 해제</span>
                    </Button>
                </nav>
            )}
        </div>
    );
};

export default AddToBasket;
