import { comment, gift, isValidGift, name, recipient, title } from "@/lib/atoms";
import { db } from "@/lib/firebase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ref , get as read, child} from "firebase/database";
import { atom } from "jotai";
import axios from '@/lib/axios';
import { Product } from "@/lib/types";

export const getGift = atom(null, async (get,set,chatID) => {
    const dbRef = ref(db);
    read(child(dbRef, `/chats/${chatID}`))
    .then(snapshot => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        set(gift, data.result)
        set(recipient, data.recipient)
        set(name, data.name)
        set(isValidGift, true)
        set(title, data.resultType.title || "네가 주면 난 다 좋아! 🎁")
        set(comment, data.resultType.comment || "#까다롭지_않아요 #취향_안_타요")
    } else {
        console.log("No data available");
        set(isValidGift, false)
    }
    })
        .catch(error => {
        console.error(error);
        set(isValidGift, false)
    });
})
getGift.debugLabel = "getGift";

const fetchInfiniteProductList = async (lastProductIdx: null | number = null, pageSize: number = 6): Promise<Product[]> => {
    try {
        // console.log(lastProductIdx);
        const endpoint = lastProductIdx !== null ? `/v1/products/pagination?LastProductIdx=${lastProductIdx}&pageSize=${pageSize}` : `/v1/products/pagination?pageSize=${pageSize}`;
        console.log(lastProductIdx,endpoint);
        
        const res = await axios.get(endpoint);
        if (res.status === 200 && res.data.isSuccess) {
            console.log(res.data.result);
            
            return res.data.result;
        } else {
            throw new Error(res.data.message);
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const useProductListInfinite = (lastProductIdx: null | number = null, pageSize: number = 6) => {
    const {data, isLoading, isError , ...rest} = useInfiniteQuery<Product[], Error>({
        queryKey: ['productList', lastProductIdx, pageSize],
        queryFn: async ( {pageParam} ) => {
            const lastIdx: number | null = (typeof pageParam === 'number' || pageParam === null) ? pageParam : lastProductIdx;
            return fetchInfiniteProductList(lastIdx, pageSize)
        },
        initialPageParam: null,
        getNextPageParam: (lastPage: Product[], allPages) => {
            if (lastPage.length < pageSize) {
                return null;
            }
            // console.log(lastPage[lastPage.length - 1].idx);
            
            return lastPage[lastPage.length - 1].idx;
        }
    });

    return { data, isLoading, isError, ...rest };
}