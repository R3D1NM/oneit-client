import {BaksetProduct, Inquiry, Product} from '@/lib/types';
import {atomWithMutation} from 'jotai-tanstack-query';
import axios from '@/lib/axios';
import {choices} from '@/atoms/inquiry';
import {toast} from 'sonner';
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
            // const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/inquiry/${data}`;
            // .then(() => {
            //     toast.success('물어보기 전송 완료');
            // })
            // .catch((err: any) => {
            //     console.log(err);
            //     toast.error('물어보기 전송 실패');
            // });
        },
    }),
);

export const getInquiry = async (inquiryIdx: string): Promise<Inquiry> => {
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
