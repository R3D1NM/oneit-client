import {login, redirectURI, updateAuthAtom} from '@/api/auth';
import {sendFCMToken} from '@/api/notification';
import {Spinner} from '@/components/ui/spinner';
import {firebaseMessagingConfig} from '@/lib/firebase';
import axios from 'axios';
import {useAtomValue, useSetAtom} from 'jotai';
import {useEffect, useState} from 'react';
import {redirect, useNavigate} from 'react-router-dom';

const {Kakao} = window;

const Auth = () => {
    const navigate = useNavigate();
    const useUpdateAuth = useSetAtom(updateAuthAtom);
    const [tokenFetched, setTokenFetched] = useState(false);

    const getToken = async () => {
        const token = new URL(window.location.href).searchParams.get('code');
        const res = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            {
                grant_type: 'authorization_code',
                client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
                redirect_uri: import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI,
                code: token,
            },
            {
                headers: {
                    'Content-type':
                        'application/x-www-form-urlencoded;charset=utf-8',
                },
            },
        );
        return res;
    };

    useEffect(() => {
        if (!Kakao.isInitialized()) {
            Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        }

        if (!tokenFetched) {
            setTokenFetched(true);
            getToken()
                .then(async (res) => {
                    const kakaoToken = res.data.access_token;
                    Kakao.Auth.setAccessToken(kakaoToken);

                    login(kakaoToken)
                        .then((isSignedUp: boolean) => {
                            useUpdateAuth();
                            console.log('[AUTH] login success');
                            const isIOS = /iPad|iPhone|iPod/.test(
                                navigator.userAgent,
                            );
                            const isInAppBrowser =
                                /FBAN|FBAV|Instagram|Daum|KAKAOTALK|NAVER/.test(
                                    navigator.userAgent,
                                );
                            if (isSignedUp) {
                                if (isIOS || isInAppBrowser) {
                                    const redirect =
                                        localStorage.getItem('redirect');
                                    console.log(
                                        `[AUTH] Redirect to ${redirect}`,
                                    );

                                    navigate(redirect || '/main', {
                                        replace: true,
                                    });
                                } else {
                                    firebaseMessagingConfig()
                                        .then((token) => {
                                            console.log(
                                                `[AUTH] Firebase token: ${token}`,
                                            );
                                            sendFCMToken(token)
                                                .then((res) => {
                                                    const redirect =
                                                        localStorage.getItem(
                                                            'redirect',
                                                        );
                                                    console.log(
                                                        `[AUTH] Redirect to ${redirect}`,
                                                    );

                                                    navigate(
                                                        redirect || '/main',
                                                        {
                                                            replace: true,
                                                        },
                                                    );
                                                })
                                                .catch((err) => {
                                                    console.log(
                                                        '[AUTH] Error sending FCM token',
                                                        err,
                                                    );
                                                });
                                        })
                                        .catch((err) => {
                                            console.log(
                                                '[AUTH] Error fetching FCM token',
                                                err,
                                            );
                                        });
                                }
                            } else {
                                console.log('[AUTH] Redirect to signup');
                                navigate('/signup', {replace: true});
                            }
                        })
                        .catch((err) => {
                            navigate(
                                '/login?redirect=' +
                                    localStorage.getItem('redirect'),
                                {replace: true},
                            );
                        });
                })
                .catch((err) => {
                    navigate(
                        '/login?redirect=' + localStorage.getItem('redirect'),
                        {replace: true},
                    );
                });
        }
    }, [tokenFetched]);

    return <Spinner />;
};

export default Auth;
