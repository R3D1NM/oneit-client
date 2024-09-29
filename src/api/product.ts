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

// export const getGift = atom(null, async (get, set, chatID) => {
//     const dbRef = ref(db);
//     read(child(dbRef, `/chats/${chatID}`))
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const data = snapshot.val();
//                 set(gift, data.result);
//                 set(recipient, data.recipient);
//                 set(name, data.name);
//                 set(isValidGift, true);
//                 set(title, data.resultType.title || '네가 주면 난 다 좋아! 🎁');
//                 set(
//                     comment,
//                     data.resultType.comment || '#까다롭지_않아요 #취향_안_타요',
//                 );
//             } else {
//                 console.log('No data available');
//                 set(isValidGift, false);
//             }
//         })
//         .catch((error) => {
//             console.error(error);
//             set(isValidGift, false);
//         });
// });
// getGift.debugLabel = 'getGift';

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
