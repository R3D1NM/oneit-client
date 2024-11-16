import {sendErrorToSlack} from '@/lib/slack';
import {AxiosError, AxiosResponse, isAxiosError} from 'axios';
import {useCallback} from 'react';
import {toast} from 'sonner';

const useApiError = () => {
    const handleError = useCallback((error: Error) => {
        console.log(error);

        if (isAxiosError(error)) {
            const {response} = error as AxiosError;
            const {status, data} = response as AxiosResponse;
            const {message, code}: {message: string; code: string} = data;

            if (handlers[status]) {
                console.log(status, code, message);

                handlers[status](code);
            } else {
                toast.error(
                    '서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.',
                );
                sendErrorToSlack({
                    message: `[${status}] ${code} | ${message} | ${error.response?.data}`,
                    errorPoint: error.stack || '',
                });
            }
        } else {
            toast.error('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
            sendErrorToSlack({
                message: error.toString(),
                errorPoint: error?.stack || '',
            });
        }
        return Error;
    }, []);

    return {handleError};
};

const handler400 = (code: string) => {
    switch (code) {
        case 'S3_REQUEST_ERROR':
        case 'S3_FILE_EXTENSION_ERROR':
            toast.error('잘못된 이미지 요청입니다.');
            break;
        case 'INVALID_FRIEND_REQUEST':
            toast.error('이미 친구 요청을 보냈거나 받은 상대입니다.');
            break;
        default:
            toast.error('입력값이 잘못되었습니다. 확인 후 다시 시도해주세요');
    }
};

const handler403 = (code: string) => {
    switch (code) {
        case 'NOT_MANAGER_OF_GIFTBOX':
            toast.error('선물 바구니의 관리자가 아닙니다.');
            break;
        case 'NOT_PARTICIPANT_OF_GIFTBOX':
            toast.error('선물 바구니의 참여자가 아닙니다.');
            break;
        default:
            toast.error('권한이 없습니다.');
    }
};

const handler404 = (code: string) => {
    switch (code) {
        case 'ALREADY_USED_INVITATION':
            toast.error('이미 사용된 초대장입니다.', {
                action: {
                    label: '메인으로',
                    onClick: () => {
                        window.location.href = '/main';
                    },
                },
            });
            break;
        case 'ALREADY_PARTICIPANT_OF_GIFTBOX':
            toast.error('이미 선물 바구니에 참여한 사용자입니다.', {
                action: {
                    label: '메인으로',
                    onClick: () => {
                        window.location.href = '/main';
                    },
                },
            });
            break;
        case 'INVITATION_NOT_FOUND':
            toast.error('잘못된 초대입니다.', {
                action: {
                    label: '메인으로',
                    onClick: () => {
                        window.location.href = '/main';
                    },
                },
            });
            break;
        case 'ALREADY_USED_INQUIRY':
            toast.error('이미 응답한 물어보기입니다.', {
                action: {
                    label: '메인으로',
                    onClick: () => {
                        window.location.href = '/main';
                    },
                },
            });
            break;
        case 'PRODUCT_NOT_FOUND':
            toast.error('상품을 찾을 수 없습니다.', {
                action: {
                    label: '메인으로',
                    onClick: () => {
                        window.location.href = '/main';
                    },
                },
            });
            break;
        case 'GIFTBOX_NOT_FOUND':
            toast.error('상품 정보를 불러오는데 실패하였습니다.', {
                action: {
                    label: '메인으로',
                    onClick: () => {
                        window.location.href = '/main';
                    },
                },
            });
            break;
        case 'PRODUCT_DTO_ERROR':
            toast.error('상품 정보를 찾을 수 없습니다.', {
                action: {
                    label: '메인으로',
                    onClick: () => {
                        window.location.href = '/main';
                    },
                },
            });
            break;
        case 'NO_MORE_PRODUCTS':
            toast.error('더이상 다른 선물이 없어요');
            break;
        default:
            toast.error('요청을 찾을 수 없습니다.', {
                action: {
                    label: '메인으로',
                    onClick: () => {
                        window.location.href = '/main';
                    },
                },
            });
    }
};

const handler500 = (code: string) => {
    toast.error('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
};

const handlers: {[key: number]: (code: string) => void} = {
    400: handler400,
    403: handler403,
    404: handler404,
    500: handler500,
};
export default useApiError;
