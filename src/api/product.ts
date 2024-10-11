import {db} from '@/lib/firebase';
import {ref, get as read, child} from 'firebase/database';
import axios from '@/lib/axios';
import {Product} from '@/lib/types';

export const fetchRecommendedProducts = async (chatID: string) => {
    const dbRef = ref(db);
    return read(child(dbRef, `/recommendRecord/${chatID}`))
        .then((snapshot) => {
            if (snapshot.exists() && snapshot.val().resultType) {
                const data = snapshot.val();
                console.log(data);

                return Promise.resolve(data);
            } else {
                // console.log('[FIREBASE] No data available');
                return Promise.reject('No data available');
                // window.location.href = '/404';
            }
        })
        .catch((error) => {
            console.log('[FIREBASE] fetchRecommendedProduct |', error);
            return Promise.reject(
                `[FIREBASE] fetchRecommendedProduct | ${error}`,
            );
        });
};

export const fetchProductList = async (
    lastProductIdx: number | null,
    pageSize: number,
): Promise<Product[]> => {
    const endpoint =
        lastProductIdx !== null
            ? `/v2/products?LastProductIdx=${lastProductIdx}&pageSize=${pageSize}`
            : `/v2/products?pageSize=${pageSize}`;
    // console.log(lastProductIdx, endpoint);
    return axios
        .get(endpoint)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchProduct = async (productID: string): Promise<Product> => {
    return axios
        .get(`/v2/products/${productID}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
