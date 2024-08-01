import ProductCard from "@/components/Cards/ProductCard";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from '@/lib/axios';
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import NotFound from "./NotFound";

const Curation = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [currentItems, setCurrentItems] = useState<Product[]>([]);
    const itemsPerPage = 6;

    const fetchProductList = async (): Promise<Product[]> => {
        return axios.get(`/v1/products`)
            .then(res => {
                if (res.status === 200 && res.data.isSuccess) {
                    // console.log(res.data.result);
                    return Promise.resolve(res.data.result)
                } else {
                    throw new Error(res.data.message)
                }
            })
            .catch(err => {
                console.error(err)
                return Promise.reject(err)
            })
    }
    const { data, isError, isLoading } = useQuery({ queryKey: ['productList'], queryFn: fetchProductList })

    
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentItems(data?.slice(indexOfFirstItem, indexOfLastItem)||[] as Product[]);
        // console.log(currentItems);
        
    }, [currentPage,data]);
    
    const totalPages = Math.ceil((data?.length||0) / itemsPerPage);
    
    const handlePageChange = (pageNumber : number) => {
        setCurrentPage(pageNumber)
        window.scrollTo(0, 0)
    }
    
    const renderPaginationItems = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={i === currentPage} onClick={() => handlePageChange(i)}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }
        return pages;
    };

    if(isLoading) return <Spinner/>
    if(isError) return <NotFound/>

    return (
        <div className="w-full mt-4 flex flex-col content-center justify-center align-middle items-center overflow-y-auto scrollbar-hide">
            <h2 className="text-xl font-bold"> Curation </h2>
            <div className="container py-5 px-2 grid grid-cols-2 gap-2">
                {currentItems.map((product) => {
                    return <ProductCard key={product.productIdx+currentPage} product={product}/>
                })}
            </div>
            <Pagination className="max-w-full px-2">
                <PaginationContent className="gap-0">
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        className={
                            currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                        }
                        onClick={() => handlePageChange(currentPage - 1)}
                    />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={
                            currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
                        }
                    />
                </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default Curation;
