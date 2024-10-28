import {Keyword, Product} from '@/lib/types';
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

const Collection = () => {
    const {collectionID} = useParams();
    const navigate = useNavigate();
    const fetchCollectionAPI = useQuery({
        queryKey: ['collection', collectionID],
        queryFn: () => fetchCollectionDetail(collectionID || ''),
    });

    if (fetchCollectionAPI.isLoading) return <Spinner />;
    if (fetchCollectionAPI.isError) return <NotFound />;

    // console.log(fetchCollectionAPI?.data);

    const handleGoBack = () => {
        navigate('/curation');
    };

    return (
        <>
            <div className="collection">
                <div className="progress_bar_wrap">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
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

                <div className="visual">
                    <img
                        src={
                            fetchCollectionAPI.data?.productList[0]
                                ?.thumbnailUrl || logo
                        }
                        alt="상품 이미지"
                    />
                </div>

                <div className="tags">
                    <ul>
                        {fetchCollectionAPI.data?.productList[0]?.keywords.map(
                            (tag: Keyword, idx: number) => (
                                <li key={idx}>{tag.name}</li>
                            ),
                        )}
                    </ul>
                </div>
                {fetchCollectionAPI?.data?.productList[0]?.status ===
                'ACTIVE' ? (
                    <button
                        className="btn_more"
                        onClick={() =>
                            navigate(
                                `/product/${fetchCollectionAPI?.data?.productList[0]?.idx}`,
                            )
                        }
                    >
                        제품 더 알아보기
                    </button>
                ) : (
                    <button className=" btn_more " disabled>
                        품절된 상품이에요 :(
                    </button>
                )}
            </div>
        </>
    );
};

export default Collection;
