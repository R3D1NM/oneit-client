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

interface Result {
    tags: string[];
    title: string;
    comment: string;
}

const resultList = results as Result[];

export const startChat = atom(null, async (get, set, chatID) => {
    set(loading, true);
    try {
        await write(ref(db, `chats/${chatID}`), {
            chatID,
            name: get(name),
            gender: get(gender),
            recipient: get(recipient),
            occasion: get(occasion),
            priceRange: get(priceRange),
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        // console.log(error);
        throw new Error('Failed to start chat');
    } finally {
        set(loading, false);
    }
});
startChat.debugLabel = 'startChat';

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

const recommend = async (payload: Payload) => {
    return new Promise<Product[]>((resolve, reject) => {
        axios
            .post('/v2/product/result/category', payload)
            .then((res) => {
                // console.log(res.data);

                // if (!res.data.isSuccess)
                //     throw new Error('Failed to get recommend list');

                resolve(res.data);
            })
            .catch((err) => {
                // console.log(err);
                reject(err);
            });
    });
};

export const finishChat = atom(
    null,
    async (get, set, chatID: string, option: number, currentDepth: number) => {
        const newTag = get(question)[currentDepth].tags[option];
        set(answers, (prev) => {
            prev[currentDepth] = newTag;
            return prev;
        });
        set(loading, true);

        try {
            await update(ref(db, `/chats/${chatID}`), {
                answers: get(answers),
                modifiedAt: serverTimestamp(),
            });

            const payload = {
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

            // console.log('Payload', payload);

            const recommendList = await recommend(payload);

            set(gift, recommendList);

            //find result with first match
            const tags = Object.values(get(answers));
            const result = resultList.find((result) =>
                result.tags.every((tag) => tags.includes(tag)),
            );
            // console.log(result);

            set(title, result?.title || '네가 주면 난 다 좋아! 🎁');
            set(comment, result?.comment || '#까다롭지_않아요 #취향_안_타요');

            await update(ref(db, `/chats/${chatID}`), {
                result: recommendList,
                resultType: {
                    title: get(title),
                    comment: get(comment),
                },
            });
        } catch (error) {
            // console.log(error);
            throw new Error('Failed to finish chat');
        } finally {
            set(loading, false);
        }
    },
);
