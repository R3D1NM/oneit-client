import {
    accessStatus,
    basketDeadline,
    basketDescription,
    basketName,
    selectedProduct,
    thumbnail,
} from '@/atoms/basket';
import axios from '@/lib/axios';
import {
    BaksetProduct,
    BaskestProductDetail,
    Basket,
    Participant,
    Product,
    Comment,
} from '@/lib/types';
import {atom} from 'jotai';
import {atomWithMutation} from 'jotai-tanstack-query';
import {toast} from 'sonner';

export const createBasket = atom(null, async (get, set): Promise<number> => {
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
        .post('/v2/giftbox', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [() => payload],
        })
        .then((res) => {
            console.log(res);
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
});

export const fetchBasketInfo = async (basketID: string): Promise<Basket> => {
    return axios
        .get(`/v2/giftbox/${basketID}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchBasketList = async (): Promise<Basket[]> => {
    return axios
        .get('/v2/giftbox')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteBasket = async (basketID: string) => {
    return axios
        .delete(`/v2/giftbox/${basketID}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const editBasket = async (
    basketID: string,
    basket: Basket,
    thumbnail: File | null,
): Promise<Basket> => {
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
        .put(`/v2/giftbox/${basketID}`, basket, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [() => payload],
        })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

type AddToBasketVariables = {
    basketIdx: string;
    selected: Product[];
};

export const addToBasket = atomWithMutation<unknown, AddToBasketVariables>(
    (get) => ({
        mutationKey: ['addToBasket'],
        mutationFn: async ({basketIdx, selected}: AddToBasketVariables) => {
            console.log(selected);

            const products = selected.map((p) => Number(p.idx));
            return axios
                .post(`v2/giftbox/${basketIdx}/products`, products)
                .then((res) => {
                    return Promise.resolve(res.data);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        },
        onSuccess: (data, variables, context) => {
            toast.success('상품이 추가되었습니다.', {
                action: {
                    label: '확인하기',
                    onClick: () => {
                        window.location.href = '/basket/' + variables.basketIdx;
                    },
                },
            });
        },
    }),
);

// export const addToBasket = atom(null, async (get, set, basketIdx: string) => {
//     const selected = get(selectedProduct);
//     const products = selected.map((p) => Number(p.idx));
//     return axios
//         .post(`v2/giftbox/${basketIdx}/products`, products)
//         .then((res) => {
//             set(selectedProduct, []);
//             return Promise.resolve(res.data);
//         })
//         .catch((err) => {
//             return Promise.reject(err);
//         });
// });

export const fetchBasketProducts = async (
    basketIdx: string,
): Promise<BaksetProduct[]> => {
    return axios
        .get(`v2/giftbox/${basketIdx}/products`)
        .then((res) => {
            if (res.status === 200) {
                return Promise.resolve(res.data);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteBasketProduct = async (
    basketIdx: string,
    productIdx: string,
) => {
    const payload = [Number(productIdx)];
    return axios
        .delete(`v2/giftbox/${basketIdx}/products`, {
            data: payload,
        })
        .then((res) => {
            if (res.status === 200) {
                return Promise.resolve(res.data);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

interface basketInviteInterface {
    invitationIdx: number;
}

export const basketInvite = async (
    basketIdx: string,
): Promise<basketInviteInterface> => {
    return axios
        .post(`v2/giftbox/${basketIdx}/invitation`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const confirmInvitation = async (invitationIdx: string) => {
    return axios
        .patch(`v2/giftbox/invitation/${invitationIdx}/status`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
};

export const fetcthBasketParticipants = async (
    basketIdx: string,
): Promise<Participant[]> => {
    return axios
        .get(`v2/giftbox/${basketIdx}/participants`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const basketProductVote = async (
    basketIdx: string,
    productIdx: string,
    browserUuid: string = 'browserUuid',
    vote: 'LIKE' | 'DISLIKE' | 'NONE',
) => {
    return axios
        .put(`v2/giftbox/products/vote`, {
            giftboxIdx: basketIdx,
            productIdx,
            browserUuid,
            vote,
        })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchBasketProductComments = async (
    basketIdx: string,
    productIdx: string,
): Promise<Comment[]> => {
    return axios
        .get(`v2/giftbox/${basketIdx}/products/${productIdx}/comments`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const addBasketProductComment = async (
    basketIdx: string,
    productIdx: string,
    comment: string,
): Promise<Comment> => {
    const data = {
        content: comment,
    };
    return axios
        .post(`v2/giftbox/${basketIdx}/products/${productIdx}/comments`, data)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteBasketProductComment = async (commentIdx: number) => {
    return axios
        .delete(`v2/comments/${commentIdx}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const searchKewordProduct = async (
    basketIdx: string,
    keyword: string,
): Promise<BaksetProduct[]> => {
    return axios
        .get(
            `/v2/giftbox/${basketIdx}/products/search?searchKeyword=${keyword}`,
        )
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const productPurchased = async (
    basketIdx: string,
    productIdx: string,
) => {
    return axios
        .put(`v2/giftbox/${basketIdx}/products/${productIdx}/purchase`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchBasketProductDetail = async (
    basketIdx: string,
    productIdx: string,
): Promise<BaskestProductDetail> => {
    return axios
        .get(`v2/giftbox/${basketIdx}/products/${productIdx}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
