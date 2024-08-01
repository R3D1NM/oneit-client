import ProductCard from "@/components/Cards/ProductCard";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Product } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import axios from '@/lib/axios';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import NotFound from "./NotFound";
import { useProductListInfinite } from "@/api/product";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";


const Curation = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [currentItems, setCurrentItems] = useState<Product[]>([]);
    const itemsPerPage = 6;
    const { data, isLoading, isError, fetchNextPage, hasNextPage } = useProductListInfinite()
    const nextFetchTargetRef = useRef<HTMLDivElement | null>(null); // ref 객체 생성
    // console.log(fetchNextPage,hasNextPage);
    

    useEffect(() => {
        // console.log('useEffect');
        
        const options = {
            root: null,
            rootMargin: '30px',
            threshold: 0.2, 
        };

        const fetchCallback: IntersectionObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) return <Spinner />
    if (isError) return <NotFound />

    return (
        <div className="w-full mt-4 flex flex-col content-center justify-center align-middle items-center overflow-y-auto scrollbar-hide">
            <h2 className="text-xl font-bold"> Curation </h2>
            <div className="container py-5 px-2 grid grid-cols-2 gap-2">
                {data?.pages.map((page, pageIndex) => (
                    page.map((product: Product, productIndex: number) => (
                        <ProductCard key={`${pageIndex}-${productIndex}`} product={product} />
                    ))
                ))}
                
            </div>
            {hasNextPage && <div ref={nextFetchTargetRef} className="col-span-2"></div>}
            <Button    
                className="fixed bottom-4 right-4 px-3 py-6 rounded-full shadow-lg"
                onClick={scrollToTop}
            >
                <ArrowUp/>
            </Button>
        </div>
    );
};

export default Curation;
