import ProductCard from './components/ProductCard';
import {Product} from '@/lib/types';
import {useEffect, useRef, useState} from 'react';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import {useProductListInfinite} from '@/hooks/useProductListInfinite';
import {Button} from '@/components/ui/button';
import {ArrowUp, Search} from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {Input} from '@/components/ui/input';
import {useMutation} from '@tanstack/react-query';
import {searchProduct} from '@/api/product';

const Curation = () => {
    const {data, isLoading, isError, fetchNextPage, hasNextPage} =
        useProductListInfinite();
    const nextFetchTargetRef = useRef<HTMLDivElement | null>(null); // ref 객체 생성
    const [keyword, setKeyword] = useState('');
    const [searchedList, setsearchedList] = useState<Product[]>([]);
    // console.log(fetchNextPage,hasNextPage);

    const searchKeywordAPI = useMutation({
        mutationFn: (keyword: string) => {
            return searchProduct(keyword);
        },
        // onSuccess: (data) => {
        //     console.log(data);
        //     // setsearchedList(data);
        // },
    });

    const handleKeyword = async (keyword: string) => {
        setKeyword(keyword);
        if (keyword.length > 1) {
            await searchKeywordAPI.mutateAsync(keyword);
        }
    };

    useEffect(() => {
        // console.log('useEffect');

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
    }, [data, hasNextPage, fetchNextPage, keyword.length]);

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    if (isLoading) return <Spinner />;
    if (isError) return <NotFound />;

    return (
        <div className="w-full mt-4 flex flex-col content-center justify-center align-middle items-center overflow-y-auto scrollbar-hide">
            <h2 className="text-xl font-bold"> Curation </h2>
            <div className="w-full flex justify-end">
                <Collapsible title="검색">
                    <CollapsibleTrigger>
                        <Search />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex gap-2 w-full">
                        <Input
                            type="text"
                            placeholder="2자 이상 입력해주세요"
                            value={keyword}
                            onChange={(e) => handleKeyword(e.target.value)}
                        />
                        {/* <Button></Button> */}
                    </CollapsibleContent>
                </Collapsible>
            </div>
            {keyword.length < 2 ? (
                <>
                    <div className="container py-5 px-2 grid grid-cols-2 gap-2">
                        {data?.pages.map((page, pageIndex) =>
                            page.map(
                                (product: Product, productIndex: number) => (
                                    <ProductCard
                                        key={`${pageIndex}-${productIndex}`}
                                        product={product}
                                    />
                                ),
                            ),
                        )}
                    </div>
                </>
            ) : (
                <div className="container py-5 px-2 grid grid-cols-2 gap-2">
                    {searchKeywordAPI.data?.map(
                        (product: Product, productIndex: number) => (
                            <ProductCard key={productIndex} product={product} />
                        ),
                    )}
                </div>
            )}
            {hasNextPage && keyword.length < 2 && (
                <div ref={nextFetchTargetRef} className="col-span-2"></div>
            )}
            <Button
                className="fixed bottom-0 right-0 px-3 py-6 rounded-full shadow-lg m-1"
                onClick={scrollToTop}
            >
                <ArrowUp />
            </Button>
        </div>
    );
};

export default Curation;
