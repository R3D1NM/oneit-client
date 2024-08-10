import kakaoLoginImage from '@/assets/kakao_login_medium_wide.png';
import {useEffect, useState} from 'react';
import {toast, Toaster} from 'sonner';

const kakaoURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI}&scope=friends`;

const Login = () => {
    const [showToast, setShowToast] = useState(false);
    useEffect(() => {
        const success = new URL(window.location.href).searchParams.get(
            'success',
        );
        // console.log(showToast,success);

        // if (success === 'false') {
        //     // setShowToast(true);
        //     toast.error('로그인 실패');
        // }
    }, [showToast]);

    return (
        <>
            <div className="flex flex-col content-center mt-3 w-fit justify-center gap-2">
                ONE!T에 가입하고 더 많은 서비스를 이용하세요!
                <div>
                    <a href={kakaoURL}>
                        <img src={kakaoLoginImage} alt="카카오 로그인" />
                    </a>
                </div>
            </div>
            {/* {showToast && <Toaster />} */}
        </>
    );
};

export default Login;
