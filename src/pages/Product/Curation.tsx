import ProductCard from './components/ProductCard';
import {Collection, Product} from '@/lib/types';
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
import {useMutation, useQuery} from '@tanstack/react-query';
import {searchProduct} from '@/api/product';
import {useNavigate} from 'react-router-dom';
import Header from '@/components/common/Header';
import dummyImage7 from './../../assets/images/dummy_7.png';
import {fetchCollectionList} from '@/api/collection';
import {cn} from '@/lib/utils';

const Curation = () => {
    const {data, isLoading, isError, fetchNextPage, hasNextPage} =
        useProductListInfinite();
    const navigate = useNavigate();
    const nextFetchTargetRef = useRef<HTMLDivElement | null>(null); // ref 객체 생성
    const [keyword, setKeyword] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
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
    const fetchCollectionListAPI = useQuery({
        queryKey: ['collections'],
        queryFn: () => fetchCollectionList(),
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

    //redirect go back to basket page
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault();
            navigate(`/main`);
        };

        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    if (isLoading) return <Spinner />;
    if (isError) return <NotFound />;

    return (
        <>
            <Header variant="back" btn_back profile title="추천 선물 리스트" />
            <div className="p-4 giftRecommList scrollbar-hide">
                <div className="slide scrollbar-hide">
                    <ul className="scrollbar-hide">
                        {fetchCollectionListAPI.data?.map(
                            (collection: Collection, index: number) => (
                                <li key={collection.idx}>
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/collection/${collection.idx}`,
                                            )
                                        }
                                    >
                                        <img
                                            src={collection.thumbnailUrl}
                                            alt=""
                                        />
                                        <p className="name text-overflow-one">
                                            {collection.name}
                                        </p>
                                    </button>
                                </li>
                            ),
                        )}
                    </ul>
                </div>
                <div className="slide_btns_area">
                    {/* <div className="btns">
                        <button className="active">받고싶어한</button>
                        <button className="">많이 선물 한</button>
                    </div>
                    <button className="btn_right_more"></button> */}
                    {searchOpen && (
                        <div className="flex w-full h-8 items-center">
                            <input
                                className="h-4 w-full m-0 p-0"
                                type="text"
                                placeholder="검색어를 2자 이상 입력해주세요"
                                value={keyword}
                                onChange={(e) => handleKeyword(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="btn_func">
                        {/* <button className="filter"></button> */}
                        <button
                            className={cn(
                                'search',
                                // searchOpen &&
                                //     'border-[#ff4341] border-[1px] rounded-lg',
                            )}
                            onClick={() => setSearchOpen(!searchOpen)}
                        ></button>
                    </div>
                </div>

                <div className="cart">
                    <div className="title">ONE!T 추천</div>
                    <div className="gift_list">
                        <ul>
                            <li className="grid-cols-2 grid gap-2">
                                {keyword.length < 2 ? (
                                    <>
                                        {data?.pages.map((page, pageIndex) =>
                                            page.map(
                                                (
                                                    product: Product,
                                                    productIndex: number,
                                                ) => (
                                                    <ProductCard
                                                        key={`${pageIndex}-${productIndex}`}
                                                        product={product}
                                                    />
                                                ),
                                            ),
                                        )}
                                    </>
                                ) : (
                                    searchKeywordAPI.data?.map(
                                        (
                                            product: Product,
                                            productIndex: number,
                                        ) => (
                                            <ProductCard
                                                key={productIndex}
                                                product={product}
                                            />
                                        ),
                                    )
                                )}
                                {hasNextPage && keyword.length < 2 && (
                                    <div
                                        ref={nextFetchTargetRef}
                                        className="col-span-2"
                                    ></div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Curation;
