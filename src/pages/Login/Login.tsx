import {useEffect} from 'react';
import logoColor from '@/assets/images/logo_color.svg';
import kakaoIcon from '@/assets/images/kakao.png';
import Header from '@/components/common/Header';

const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI}&scope=profile_nickname,profile_image,account_email,talk_message,friends,name,birthday,birthyear,phone_number`;

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
            const uri = referrer ? new URL(referrer).pathname : '/main';
            console.log(uri);
            console.log(referrer);

            // setRedirctURI(uri || '/');
            localStorage.setItem('redirect', uri || '/main');
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
            <Header variant="logo" />
            <div className="flex min-h-screen flex-col justify-center items-center gap-[1.5625rem] p-4">
                <div
                    className="w-[11.9375rem] h-[6.5rem] block bg-no-repeat bg-center bg-contain"
                    style={{backgroundImage: `url(${logoColor})`}}
                ></div>
                <a
                    href={kakaoURL}
                    className="flex w-full h-[3.125rem] justify-center items-center bg-[#fee500] bg-no-repeat bg-contain bg-center text-[0px] text-transparent"
                    style={{backgroundImage: `url(${kakaoIcon})`}}
                >
                    카카오로 시작하기
                </a>
            </div>
        </>
    );
};

export default Login;
