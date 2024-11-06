import {BaksetProduct, Product} from '@/lib/types';
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
            const url = `${import.meta.env.VITE_CURRENT_DOMAIN}/inquiry/${data}`;
            //check if the browser is whale : contain both whale and mobile in userAgent
            if (
                /whale/i.test(navigator.userAgent) &&
                /mobile/i.test(navigator.userAgent)
            ) {
                toast.error(
                    '카카오톡 공유가 지원되지 않는 브라우저입니다. 다른 방법으로 친구를 추가해주세요.',
                    {
                        action: {
                            label: '링크 복사',
                            onClick: () => {
                                navigator.clipboard.writeText(url).then(() => {
                                    toast('클립보드에 복사되었습니다.');
                                });
                            },
                        },
                    },
                );
                return;
            }

            Kakao.Share.sendDefault({
                objectType: 'text',
                text: `🎁친구들이 ${variables.target}님을 위한 선물을 고르고 있어요!\n마음에 드는 선물을 고를 수 있도록 도와주세요🥺`,
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            })
                .then(() => {
                    toast.success('물어보기 전송 완료');
                })
                .catch((err: any) => {
                    console.log(err);
                    toast.error('물어보기 전송 실패');
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
