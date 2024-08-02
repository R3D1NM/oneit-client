import {login, updateAuthAtom} from '@/api/auth';
import {Spinner} from '@/components/ui/spinner';
import axios from 'axios';
import {useSetAtom} from 'jotai';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

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
		getToken()
			.then(async (res) => {
				console.log(res);
				const kakaoToken = res.data.access_token;
				login(kakaoToken)
					.then(() => {
						//go back to the page before login page
						useUpdateAuth();
						console.log('login success');
						navigate('/');
					})
					.catch((err) => {
						console.log(err);
						navigate('/login?success=false');
					});
			})
			.catch((err) => {
				console.log(err);
				navigate('/login?success=false');
			});
	}, []);

	return <Spinner />;
};

export default Auth;
