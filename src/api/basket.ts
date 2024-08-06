import {
    basketDeadline,
    basketDescription,
    basketName,
    thumbnail,
} from '@/atoms/basket';
import axios from '@/lib/axios';
import {atom} from 'jotai';

export const createBasket = atom(null, async (get, set) => {
    const data = {
        name: get(basketName),
        description: get(basketDescription),
        deadline: get(basketDeadline),
        createdUserIdx: 108,
        accessStatus: 'PUBLIC',
    };

    let payload = new FormData();
    payload.append('request', JSON.stringify(data));
    payload.append('image', get(thumbnail) as File);
    return axios
        .post('/v1/giftbox', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [() => payload],
        })
        .then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.isSuccess) {
                return Promise.resolve(res.data.result);
            }
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
});

export const fetchBasketInfo = async (basketID: string) => {
    return axios.get(`/v1/giftbox/${basketID}`).then((res) => {
        if (res.status === 200 && res.data.isSuccess) {
            return Promise.resolve(res.data.result);
        } else {
            throw new Error(res.data.message);
        }
    });
};

export const fetchBasketList = async () => {
    return axios.get('/v1/giftbox?userIdx=108').then((res) => {
        if (res.status === 200 && res.data.isSuccess) {
            return Promise.resolve(res.data.result);
        } else {
            throw new Error(res.data.message);
        }
    });
};

export const deleteBasket = async (basketID: string) => {
    return axios.delete(`/v1/giftbox/${basketID}`).then((res) => {
        if (res.status === 200 && res.data.isSuccess) {
            return Promise.resolve(res.data.result);
        } else {
            throw new Error(res.data.message);
        }
    });
};
