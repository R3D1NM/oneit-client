import {authAtom} from '@/api/auth';
import axios from 'axios';
import {createStore, useAtomValue} from 'jotai';

const baseURL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api';

const instance = axios.create({
    baseURL,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (config.headers && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// If 401 error occurs, move to login page
instance.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => {
        const token = localStorage.getItem('token');
        if (error.response && error.response.status === 401 && !token) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

// axios.interceptors.response.use(
//     (res) => {
//         return res;
//     },
//     async (error) => {
//         const { config, response } = error;
//         //  401에러가 아니거나 재요청이거나 refresh 요청인 경우 에러 발생
//         if (response.status !== 401 || config.sent || config.url === '/auth/refresh') {
//             return Promise.reject(error);
//         }

//         // 아닌 경우 토큰 갱신
//         config.sent = true; // 무한 재요청 방지
//         getRefreshToken()
//         .then((accessToken)=>{
//             localStorage.setItem("token", accessToken)
//             config.headers.Authorization = `Bearer ${accessToken}`
//             return axios(config)
//         }).catch((err)=>{
//             console.log(err);
//             logout()
//         })

//         return axios(config); // 재요청
//     },
// );
export default instance;
