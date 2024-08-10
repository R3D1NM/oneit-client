import {
    accessStatus,
    basketDeadline,
    basketDescription,
    basketName,
    selectedProduct,
    thumbnail,
} from '@/atoms/basket';
import axios from '@/lib/axios';
import {Basket} from '@/lib/types';
import {atom} from 'jotai';

export const createBasket = atom(null, async (get, set) => {
    const data = {
        name: get(basketName),
        description: get(basketDescription),
        deadline: get(basketDeadline),
        accessStatus: get(accessStatus),
    };

    let payload = new FormData();
    payload.append('request', JSON.stringify(data));
    payload.append('image', get(thumbnail) as File);
    set(basketName, '');
    set(basketDescription, '');
    set(basketDeadline, null);
    set(thumbnail, null);
    set(accessStatus, 'PUBLIC');
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
    return axios
        .get(`/v1/giftbox/${basketID}`)
        .then((res) => {
            if (res.status === 200 && res.data.isSuccess) {
                return Promise.resolve(res.data.result);
            } else if (res.status === 401) {
                return Promise.reject(res.data.message);
            } else if (res.status === 200 && !res.data.isSuccess) {
                return Promise.reject(res.data.code);
            } else {
                throw new Error(res.data.message);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchBasketList = async () => {
    return axios.get('/v1/giftbox').then((res) => {
        if (res.status === 200 && res.data.isSuccess) {
            return Promise.resolve(res.data.result);
        } else if (res.status === 200 && !res.data.isSuccess) {
            return Promise.reject(res.data.code);
        } else {
            throw new Error(res.data.message);
        }
    });
};

export const deleteBasket = async (basketID: string) => {
    return axios.delete(`/v1/giftbox/${basketID}`).then((res) => {
        if (res.status === 200 && res.data.isSuccess) {
            return Promise.resolve(res.data.result);
        } else if (res.status === 200 && !res.data.isSuccess) {
            return Promise.reject(res.data.code);
        } else {
            throw new Error(res.data.message);
        }
    });
};

export const editBasket = async (
    basketID: string,
    basket: Basket,
    thumbnail: File | null,
) => {
    const data = {
        name: basket.name,
        description: basket.description,
        deadline: basket.deadline,
        accessStatus: basket.accessStatus,
    };

    let payload = new FormData();
    payload.append('request', JSON.stringify(data));
    payload.append('image', thumbnail as File);
    return axios
        .put(`/v1/giftbox/${basketID}`, basket, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [() => payload],
        })
        .then((res) => {
            if (res.status === 200 && res.data.isSuccess) {
                return Promise.resolve(res.data.result);
            } else if (res.status === 200 && !res.data.isSuccess) {
                return Promise.reject(res.data.code);
            } else {
                throw new Error(res.data.message);
            }
        });
};

export const addToBasket = atom(null, async (get, set, basketIdx: string) => {
    const selected = get(selectedProduct);
    const products = selected.map((p) => Number(p.idx));
    return axios
        .post(`v1/giftbox/${basketIdx}/products`, products)
        .then((res) => {
            if (res.status === 200 && res.data.isSuccess) {
                set(selectedProduct, []);
                return Promise.resolve(res.data.result);
            } else if (res.status === 200 && !res.data.isSuccess) {
                return Promise.reject(res.data.code);
            } else {
                throw new Error(res.data.message);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
});

export const fetchBasketProducts = async (basketIdx: string) => {
    return axios
        .get(`v1/giftbox/${basketIdx}/products`)
        .then((res) => {
            if (res.status === 200 && res.data.isSuccess) {
                return Promise.resolve(res.data.result);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteBasketProduct = async (
    basketIdx: string,
    productIdx: number,
) => {
    const payload = [Number(productIdx)];
    return axios
        .delete(`v1/giftbox/${basketIdx}/products`, {
            data: payload,
        })
        .then((res) => {
            if (res.status === 200 && res.data.isSuccess) {
                return Promise.resolve(res.data.result);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
