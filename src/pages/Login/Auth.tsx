import {login, redirectURI, updateAuthAtom} from '@/api/auth';
import {Spinner} from '@/components/ui/spinner';
import axios from 'axios';
import {useAtomValue, useSetAtom} from 'jotai';
import {useEffect} from 'react';
import {redirect, useNavigate} from 'react-router-dom';

const {Kakao} = window;

const Auth = () => {
    const navigate = useNavigate();
    const useUpdateAuth = useSetAtom(updateAuthAtom);

    const getToken = async () => {
        const token = new URL(window.location.href).searchParams.get('code');
        const res = axios.post(
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
        getToken()
            .then(async (res) => {
                // console.log(res);
                const kakaoToken = res.data.access_token;
                // console.log(Kakao);
                Kakao.Auth.setAccessToken(kakaoToken);

                login(kakaoToken)
                    .then(() => {
                        //go back to the page before login page
                        useUpdateAuth();
                        console.log('[AUTH] login success');
                        navigate('/signup');
                        // const redirect = localStorage.getItem('redirect');
                        // console.log(`[AUTH] Redirect to ${redirect}`);

                        // navigate(redirect || '/', {replace: true});
                    })
                    .catch((err) => {
                        // console.log(err);
                        navigate(
                            '/login?redirect=' +
                                localStorage.getItem('redirect'),
                            {replace: true},
                        );
                    });
            })
            .catch((err) => {
                // console.log(err);
                navigate(
                    '/login?redirect=' + localStorage.getItem('redirect'),
                    {replace: true},
                );
            });
    }, []);

    return <Spinner />;
};

export default Auth;
