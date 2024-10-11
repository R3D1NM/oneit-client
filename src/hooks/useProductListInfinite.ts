import {fetchProductList} from '@/api/product';
import axios from '@/lib/axios';
import {Product} from '@/lib/types';
import {useInfiniteQuery} from '@tanstack/react-query';

const fetchInfiniteProductList = async (
    lastProductIdx: null | number = null,
    pageSize: number = 6,
): Promise<Product[]> => {
    try {
        // console.log(lastProductIdx);
        return fetchProductList(lastProductIdx, pageSize);
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const useProductListInfinite = (
    lastProductIdx: null | number = null,
    pageSize: number = 6,
) => {
    const {data, isLoading, isError, ...rest} = useInfiniteQuery<
        Product[],
        Error
    >({
        queryKey: ['productList', lastProductIdx, pageSize],
        queryFn: async ({pageParam}) => {
            const lastIdx: number | null =
                typeof pageParam === 'number' || pageParam === null
                    ? pageParam
                    : lastProductIdx;
            return fetchInfiniteProductList(lastIdx, pageSize);
        },
        initialPageParam: null,
        getNextPageParam: (lastPage: Product[], allPages) => {
            if (lastPage.length < pageSize) {
                return null;
            }
            // console.log(lastPage[lastPage.length - 1].idx);

            return lastPage[lastPage.length - 1].idx;
        },
    });

    return {data, isLoading, isError, ...rest};
};
