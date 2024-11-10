import {CollctionProduct, Keyword, Product} from '@/lib/types';
import {useNavigate, useParams} from 'react-router-dom';
import ProductCard from '../Product/components/ProductCard';
import {AspectRatio} from '@/components/ui/aspect-ratio';
import {Button} from '@/components/ui/button';
import {ChevronLeft, Heart} from 'lucide-react';
import KakaoShare from '@/components/common/KakaoShare';
import {useQuery} from '@tanstack/react-query';
import {fetchCollectionDetail} from '@/api/collection';
import {Spinner} from '@/components/ui/spinner';
import NotFound from '../NotFound';
import logo from '@/assets/images/oneit.png';
import {useEffect, useState} from 'react';

// const MAXPAGE = 5;

const Collection = () => {
    const {collectionID} = useParams();
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const fetchCollectionAPI = useQuery({
        queryKey: ['collection', collectionID],
        queryFn: () => fetchCollectionDetail(collectionID || ''),
    });

    // console.log(fetchCollectionAPI?.data?.collectionProductDTOList);

    // console.log(fetchCollectionAPI?.data);
    useEffect(() => {
        history.pushState(null, '', '');

        const handleClickBrowserBackBtn = () => {
            console.log('prevent going back');
        };

        window.addEventListener('popstate', handleClickBrowserBackBtn);

        return () => {
            window.removeEventListener('popstate', handleClickBrowserBackBtn);
        };
    }, [navigate]);

    const handleGoBack = () => {
        navigate('/curation');
    };

    useEffect(() => {
        const spans = document.querySelectorAll('.progress_bar_wrap span');

        const handleAnimationEnd = () => {
            setCurrentPage((prevPage) => {
                const newPage = prevPage + 1;
                if (
                    fetchCollectionAPI.data?.collectionProductDTOList &&
                    newPage <
                        fetchCollectionAPI.data.collectionProductDTOList.length
                ) {
                    return newPage;
                } else if (
                    fetchCollectionAPI.data?.collectionProductDTOList &&
                    newPage ===
                        fetchCollectionAPI.data.collectionProductDTOList.length
                ) {
                    setTimeout(() => {
                        navigate('/curation');
                    }, 3000);
                    return newPage;
                }
                return prevPage;
            });
        };

        spans.forEach((span) => {
            span.addEventListener('animationend', handleAnimationEnd);
        });

        return () => {
            spans.forEach((span) => {
                span.removeEventListener('animationend', handleAnimationEnd);
            });
        };
    }, [fetchCollectionAPI.data]);

    const updateActiveSpan = (newPage: number) => {
        const spans = document.querySelectorAll('.progress_bar_wrap span');
        spans.forEach((span, index) => {
            const htmlSpan = span as HTMLElement;
            htmlSpan.classList.remove('active');
            if (index === newPage) {
                htmlSpan.classList.add('active');
                htmlSpan.style.animation = 'none';
                htmlSpan.offsetHeight; // Trigger reflow
                htmlSpan.style.animation = '';
            }
        });
    };

    useEffect(() => {
        updateActiveSpan(currentPage);
    }, [currentPage]);

    // useEffect(() => {
    //     let touchStartX = 0;
    //     let touchEndX = 0;

    //     const handleTouchStart = (e: TouchEvent) => {
    //         touchStartX = e.changedTouches[0].screenX;
    //     };

    //     const handleTouchEnd = (e: TouchEvent) => {
    //         touchEndX = e.changedTouches[0].screenX;
    //         handleSwipeGesture();
    //     };

    //     const handleSwipeGesture = () => {
    //         if (touchEndX < touchStartX) {
    //             // console.log('swiped left', currentPage);

    //             // Swiped left
    //             setCurrentPage((prevPage) => {
    //                 const newPage = prevPage + 1;
    //                 // console.log(newPage);

    //                 return fetchCollectionAPI.data?.collectionProductDTOList &&
    //                     newPage <=
    //                         fetchCollectionAPI.data.collectionProductDTOList
    //                             .length
    //                     ? newPage
    //                     : prevPage;
    //             });
    //         }
    //         if (touchEndX > touchStartX) {
    //             console.log('swiped right', currentPage);

    //             // Swiped right
    //             setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    //         }
    //     };

    //     document.addEventListener('touchstart', handleTouchStart);
    //     document.addEventListener('touchend', handleTouchEnd);

    //     return () => {
    //         document.removeEventListener('touchstart', handleTouchStart);
    //         document.removeEventListener('touchend', handleTouchEnd);
    //     };
    // }, []);

    useEffect(() => {
        const handleMouseDown = () => {
            document
                .querySelector('.progress_bar_wrap')
                ?.classList.add('paused');
        };

        const handleMouseUp = () => {
            document
                .querySelector('.progress_bar_wrap')
                ?.classList.remove('paused');
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchstart', handleMouseDown);
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchstart', handleMouseDown);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, []);

    if (fetchCollectionAPI.isLoading) return <Spinner />;
    if (fetchCollectionAPI.isError) return <NotFound />;

    return (
        <>
            <div className="collection">
                <div className="progress_bar_wrap">
                    <span></span>
                    {fetchCollectionAPI.data?.collectionProductDTOList?.map(
                        (product: CollctionProduct, idx: number) => (
                            <span key={`span-${idx}`}></span>
                        ),
                    )}
                    {/* <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span> */}
                </div>
                <div className="thum">
                    <div className="image">
                        <img
                            src={
                                fetchCollectionAPI.data
                                    ?.collectionThumbnailUrl || logo
                            }
                            alt="컬렉션 썸네일"
                        />
                    </div>
                    <span className="text-overflow-one">
                        {fetchCollectionAPI.data?.collectionName}
                    </span>
                    <button className="close" onClick={handleGoBack}></button>
                </div>
                {currentPage > 0 ? (
                    <>
                        <div className="visual">
                            <img
                                src={
                                    fetchCollectionAPI.data
                                        ?.collectionProductDTOList[
                                        currentPage - 1
                                    ]?.showcaseImageUrl || logo
                                }
                                alt="상품 이미지"
                            />
                        </div>

                        <div className="tags">
                            <ul>
                                {fetchCollectionAPI.data?.collectionProductDTOList[
                                    currentPage - 1
                                ]?.keywords.map((tag: Keyword, idx: number) => (
                                    <li key={idx}>{tag.name}</li>
                                ))}
                            </ul>
                        </div>
                        {fetchCollectionAPI?.data?.collectionProductDTOList[
                            currentPage - 1
                        ]?.productStatus === 'ACTIVE' && (
                            <button
                                className="btn_more"
                                onClick={() =>
                                    navigate(
                                        `/product/${fetchCollectionAPI?.data?.collectionProductDTOList[currentPage - 1]?.productIdx}`,
                                    )
                                }
                            >
                                제품 더 알아보기
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <div className="visual">
                            <img
                                src={
                                    fetchCollectionAPI.data
                                        ?.collectionThumbnailUrl || logo
                                }
                                alt="컬렉션 대표 이미지"
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Collection;
