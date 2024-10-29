import {BaksetProduct, Product} from '@/lib/types';
import {atomWithMutation} from 'jotai-tanstack-query';
import axios from '@/lib/axios';
import {choices} from '@/atoms/inquiry';
const {Kakao} = window;

type CreateInquiryVariables = {
    basketIdx: string;
    selected: BaksetProduct[];
    target: string;
};

export const createInquiry = atomWithMutation<unknown, CreateInquiryVariables>(
    (get) => ({
        mutationKey: ['createInquiry'],
        mutationFn: async ({
            basketIdx,
            selected,
            target,
        }: CreateInquiryVariables) => {
            // console.log(selected);

            const products = selected.map((p) => Number(p.idx));
            const payload = {
                productIdxList: products,
                giftboxIdx: Number(basketIdx),
                target,
            };
            return axios
                .post(`v2/inquiry`, payload)
                .then((res) => {
                    return Promise.resolve(res.data);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        },
        onSuccess: (data, variables, context) => {
            const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/inquiry/${data}`;

            Kakao.Share.sendDefault({
                objectType: 'text',
                text: `🎁친구들이 ${variables.target}님을 위한 선물을 고르고 있어요!\n마음에 드는 선물을 고를 수 있도록 도와주세요🥺`,
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            });
        },
    }),
);

export const getInquiry = async (inquiryIdx: string) => {
    return axios
        .get(`/v2/inquiry/${inquiryIdx}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const submitInquiry = atomWithMutation<unknown, string>((get) => ({
    mutationKey: ['submitInquiry'],
    mutationFn: async (inquiryIdx: string) => {
        const payload = get(choices);
        return axios
            .post(`/v2/inquiry/${inquiryIdx}/emoji`, payload)
            .then((res) => {
                return Promise.resolve(res.data);
            })
            .catch((err) => {
                return Promise.reject(err);
            });
    },
}));
