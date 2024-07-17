import ProductCard from "@/components/Cards/ProductCard";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";

const Curation = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [currentItems, setCurrentItems] = useState<Product[]>([]);
    const itemsPerPage = 6;

    const products : Product[] = [
        {
            "title": "1 \"당+ 체력 보충\" 꿀빠는시간 스틱꿀 버라이어티팩 21개입(3종 x 7스틱)  ",
            "url": "https://gift.kakao.com/product/2915615",
            "price": 25400,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20230906115514_7c56265604bd4a45bd6f90c06a0fdd11.png",
            "id": 1
        },
        {
            id: 2,
            "title": "2 [단독/리본포장] \"푸른 텍스처+애프터배스 향\" 블루 웨이브 바디 오일 120ML  ",    
            "url": "https://gift.kakao.com/product/7695898",
            "price": 33000,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20240202154320_0cfefbb52a6149ffa1b3b2074d45e111.jpg"
        },
        {
            id: 3,
            "title": "3 프리미엄 호텔용 40수 샤워가운 1개 (Oeko-Tex 1등급)+마스크 1개 증정 (송월타월) ",
            "url": "https://gift.kakao.com/product/926087",
            "price": 42900,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20230320142117_a0adbc755cba4129a07d5769d37f6c8b.jpg"
        },
        {
            id: 4,
            "title": "4 [선물포장] 슬밋 퍼퓸 핸드크림 30ml (3종 중 택 1)  ",
            "url": "https://gift.kakao.com/product/6780518",
            "price": 15000,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20240513151857_a3a56a4414eb4dbe8177a91e86015297.jpg"
        },
        {
            "title": "5 \"당+ 체력 보충\" 꿀빠는시간 스틱꿀 버라이어티팩 21개입(3종 x 7스틱)  ",
            "url": "https://gift.kakao.com/product/2915615",
            "price": 25400,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20230906115514_7c56265604bd4a45bd6f90c06a0fdd11.png",
            "id": 5
        },
        {
            id: 6,
            "title": "6 [단독/리본포장] \"푸른 텍스처+애프터배스 향\" 블루 웨이브 바디 오일 120ML  ",    
            "url": "https://gift.kakao.com/product/7695898",
            "price": 33000,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20240202154320_0cfefbb52a6149ffa1b3b2074d45e111.jpg"
        },
        {
            id: 7,
            "title": "7 프리미엄 호텔용 40수 샤워가운 1개 (Oeko-Tex 1등급)+마스크 1개 증정 (송월타월) ",
            "url": "https://gift.kakao.com/product/926087",
            "price": 42900,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20230320142117_a0adbc755cba4129a07d5769d37f6c8b.jpg"
        },
        {
            id: 8,
            "title": "8 [선물포장] 슬밋 퍼퓸 핸드크림 30ml (3종 중 택 1)  ",
            "url": "https://gift.kakao.com/product/6780518",
            "price": 15000,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20240513151857_a3a56a4414eb4dbe8177a91e86015297.jpg"
        },
        {
            "title": "9\"당+ 체력 보충\" 꿀빠는시간 스틱꿀 버라이어티팩 21개입(3종 x 7스틱)  ",
            "url": "https://gift.kakao.com/product/2915615",
            "price": 25400,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20230906115514_7c56265604bd4a45bd6f90c06a0fdd11.png",
            "id": 9
        },
        {
            id: 10,
            "title": "10 [단독/리본포장] \"푸른 텍스처+애프터배스 향\" 블루 웨이브 바디 오일 120ML  ",    
            "url": "https://gift.kakao.com/product/7695898",
            "price": 33000,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20240202154320_0cfefbb52a6149ffa1b3b2074d45e111.jpg"
        },
        {
            id: 11,
            "title": "11 프리미엄 호텔용 40수 샤워가운 1개 (Oeko-Tex 1등급)+마스크 1개 증정 (송월타월) ",
            "url": "https://gift.kakao.com/product/926087",
            "price": 42900,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20230320142117_a0adbc755cba4129a07d5769d37f6c8b.jpg"
        },
        {
            id: 12,
            "title": "12 [선물포장] 슬밋 퍼퓸 핸드크림 30ml (3종 중 택 1)  ",
            "url": "https://gift.kakao.com/product/6780518",
            "price": 15000,
            "image": "https://img1.kakaocdn.net/thumb/C320x320@2x.fwebp.q82/?fname=https%3A%2F%2Fst.kakaocdn.net%2Fproduct%2Fgift%2Fproduct%2F20240513151857_a3a56a4414eb4dbe8177a91e86015297.jpg"
        }
    ]

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentItems(products.slice(indexOfFirstItem, indexOfLastItem));
        // console.log(currentItems);
        
    }, [currentPage]);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePageChange = (pageNumber : number) => {
        setCurrentPage(pageNumber)
        window.scrollTo(0, 0)
    }

    return (
        <div className="w-full mt-4 flex flex-col content-center justify-center align-middle items-center max-h-[200vsh]">
            <h2 className="text-xl font-bold"> Curation </h2>
            <div className="container py-5 px-2 grid grid-cols-2 gap-2">
                {currentItems.map((product) => {
                    return <ProductCard key={product.id+currentPage} product={product}/>
                })}
            </div>
            <Pagination>
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        className={
                            currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                        }
                        onClick={() => handlePageChange(currentPage - 1)}
                    />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink href="#" isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                        {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
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
