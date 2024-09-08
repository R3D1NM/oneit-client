import kakaoLoginImage from '@/assets/kakao_login_medium_wide.png';
import {useEffect, useState} from 'react';

const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI}&scope=profile_nickname,profile_image,account_email,talk_message,friends`;

const Login = () => {
    useEffect(() => {
        const redirect = new URL(window.location.href).searchParams.get(
            'redirect',
        );

        if (redirect) {
            localStorage.setItem('redirect', redirect);
            // setRedirctURI(redirect);
        } else {
            //get uri of the page before login page
            const referrer = document.referrer;
            const uri = referrer ? new URL(referrer).pathname : '/';
            console.log(uri);

            // setRedirctURI(uri || '/');
            localStorage.setItem('redirect', uri || '/');
        }
        // console.log(redirect);
        // console.log(showToast,success);

        // if (success === 'false') {
        //     // setShowToast(true);
        //     toast.error('로그인 실패');
        // }
    }, []);

    return (
        <>
            <div className="flex flex-col content-center mt-3 w-fit justify-center gap-2">
                ONE!T에 가입하고 더 많은 서비스를 이용하세요!
                <div className="flex justify-center">
                    <a href={kakaoURL} className="flex justify-center">
                        <img src={kakaoLoginImage} alt="카카오 로그인" />
                    </a>
                </div>
            </div>
        </>
    );
};

export default Login;
