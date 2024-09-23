import {update, ref, set as write, serverTimestamp} from 'firebase/database';
import {db} from '@/lib/firebase';
import {atom} from 'jotai';
import {
    gender,
    loading,
    occasion,
    priceRange,
    recipient,
    answers,
    gift,
    question as nextQuestion,
    name,
    question,
    title,
    comment,
} from '@/atoms/recommend';
import {Product} from '@/lib/types';
import axios from '@/lib/axios';
import results from '@/data/result.json';
import {atomWithMutation} from 'jotai-tanstack-query';
import {toast} from 'sonner';
import {sendErrorToSlack} from '@/lib/slack';

interface Result {
    tags: string[];
    title: string;
    comment: string;
}

const resultList = results as Result[];

interface startRecommendVariables {
    chatID: string;
}

export const startRecommend = atomWithMutation<
    unknown,
    startRecommendVariables
>((get) => ({
    mutationKey: ['saveRecommendInfo'],
    mutationFn: async ({chatID}: {chatID: string}) => {
        await write(ref(db, `recommendRecord/${chatID}`), {
            chatID,
            name: get(name),
            gender: get(gender),
            recipient: get(recipient),
            occasion: get(occasion),
            priceRange: get(priceRange),
            createdAt: serverTimestamp(),
            production: import.meta.env.VITE_CURRENT_DOMAIN,
        });
    },
    onSuccess: (data, variables, context) => {},
    onError: (error, variables, context) => {
        console.log(error);
        toast.error('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
    },
}));
startRecommend.debugLabel = 'startChat';
// export const startChat = atom(null, async (get, set, chatID) => {
//     set(loading, true);
//     try {
//         await write(ref(db, `chats/${chatID}`), {
//             chatID,
//             name: get(name),
//             gender: get(gender),
//             recipient: get(recipient),
//             occasion: get(occasion),
//             priceRange: get(priceRange),
//             createdAt: serverTimestamp(),
//         });
//     } catch (error) {
//         // console.log(error);
//         throw new Error('Failed to start chat');
//     } finally {
//         set(loading, false);
//     }
// });
// startChat.debugLabel = 'startChat';

export const next = atom(
    null,
    async (get, set, option: number, currentDepth: number) => {
        const newTag: string = get(question)[currentDepth].tags[option];
        set(answers, (prev) => {
            prev[currentDepth] = newTag;
            return prev;
        });
        // console.log('New keyword', newTag);
    },
);

interface Payload {
    gender: string;
    age: number;
    minPrice: number;
    maxPrice: number;
    keywords: {[key: string]: string};
}

interface finishRecommendVariables {
    chatID: string;
}

export const finishRecommend = atomWithMutation<
    unknown,
    finishRecommendVariables
>((get) => ({
    mutationKey: ['finishRecommend'],
    mutationFn: async ({chatID}: {chatID: string}) => {
        await update(ref(db, `/recommendRecord/${chatID}`), {
            answers: get(answers),
            modifiedAt: serverTimestamp(),
        });

        const payload: Payload = {
            gender: get(gender),
            age: 10,
            minPrice:
                get(priceRange)[0] > get(priceRange)[1]
                    ? get(priceRange)[1]
                    : get(priceRange)[0],
            maxPrice:
                get(priceRange)[1] > get(priceRange)[0]
                    ? get(priceRange)[1]
                    : get(priceRange)[0],
            keywords: get(answers),
        };
        return axios
            .post('/v2/product/result/category', payload)
            .then((res) => {
                if (res.status === 200) {
                    return Promise.resolve(res.data);
                }
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
    onSuccess: async (data, variables, context) => {
        const tags = Object.values(get(answers));
        const result = resultList.find((result) =>
            result.tags.every((tag) => tags.includes(tag)),
        );
        update(ref(db, `/recommendRecord/${variables.chatID}`), {
            answers: get(answers),
            modifiedAt: serverTimestamp(),
            result: data,
            resultType: {
                title: result?.title || '네가 주면 난 다 좋아! 🎁',
                comment: result?.comment || '#까다롭지_않아요 #취향_안_타요',
            },
        }).catch((error) => {
            console.log('[FIREBASE] Failed to update record', error);
            sendErrorToSlack({
                message: `[FIREBASE] Failed to update record ${error}`,
                errorPoint: 'finishRecommend',
            });
            // toast.error('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
        });
    },
}));

// export const finishChat = atom(
//     null,
//     async (get, set, chatID: string, option: number, currentDepth: number) => {
//         const newTag = get(question)[currentDepth].tags[option];
//         set(answers, (prev) => {
//             prev[currentDepth] = newTag;
//             return prev;
//         });
//         set(loading, true);

//         try {
//             await update(ref(db, `/chats/${chatID}`), {
//                 answers: get(answers),
//                 modifiedAt: serverTimestamp(),
//             });

//             const payload = {
//                 gender: get(gender),
//                 age: 10,
//                 minPrice:
//                     get(priceRange)[0] > get(priceRange)[1]
//                         ? get(priceRange)[1]
//                         : get(priceRange)[0],
//                 maxPrice:
//                     get(priceRange)[1] > get(priceRange)[0]
//                         ? get(priceRange)[1]
//                         : get(priceRange)[0],
//                 keywords: get(answers),
//             };

//             // console.log('Payload', payload);

//             const recommendList = await recommend(payload);

//             set(gift, recommendList);

//             //find result with first match
//             const tags = Object.values(get(answers));
//             const result = resultList.find((result) =>
//                 result.tags.every((tag) => tags.includes(tag)),
//             );
//             // console.log(result);

//             set(title, result?.title || '네가 주면 난 다 좋아! 🎁');
//             set(comment, result?.comment || '#까다롭지_않아요 #취향_안_타요');

//             await update(ref(db, `/chats/${chatID}`), {
//                 result: recommendList,
//                 resultType: {
//                     title: get(title),
//                     comment: get(comment),
//                 },
//             });
//         } catch (error) {
//             // console.log(error);
//             throw new Error('Failed to finish chat');
//         } finally {
//             set(loading, false);
//         }
//     },
// );
