import {User} from '@/lib/types';
import axios from '@/lib/axios';
import {atom} from 'jotai';
import {atomWithDefault} from 'jotai/utils';

const getMe = async () => {
    //get user info
    //todo: get user info from server
    return axios
        .get('/v1/kakao/user')
        .then((res) => {
            console.log(res);

            if (res.status == 200 && res.data.isSuccess) {
                return Promise.resolve(res.data.result);
            } else if (res.status == 200 && !res.data.isSuccess) {
                return Promise.reject(res.data.code);
            } else {
                throw new Error('Failed to get user info');
            }
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
};

//Auth
const getAuth = async (): Promise<User | null> => {
    const token = {
        access: localStorage.getItem('token'),
        // refresh: cookies.get('refreshToken'),
    };
    console.log('token', token);

    if (token.access) {
        return getMe()
            .then((res) => res)
            .catch((err) => {
                console.log(err);
                if (err?.toString() == '2104') {
                    localStorage.removeItem('token');
                } else if (
                    err?.response?.status == 401 &&
                    err?.response?.data?.code == 2104
                ) {
                    localStorage.removeItem('token');
                }
                return null;
            });
    }

    // if (token.refresh) {
    //     const accessToken = await getRefreshToken();
    //     if (accessToken) {
    //         localStorage.setItem('token', accessToken);

    //         const userInfo = await getMe();
    //         if (userInfo) return userInfo;
    //     }
    // }

    //not logged in
    return null;
};

export const authAtom = atomWithDefault(getAuth);
authAtom.debugLabel = 'authAtom';

export const updateAuthAtom = atom(null, async (get, set) => {
    console.log('updating auth');

    set(authAtom, getAuth());
});

export const isLoginAtom = atom(async (get) => {
    const user = await get(authAtom);
    if (user) {
        return true;
    } else {
        return false;
    }
});

export const login = async (token: string) => {
    try {
        const res = await axios.post('/v1/kakao/login', {
            accessToken: token,
        });

        if (res.status == 200 && res.data.isSuccess) {
            // const { accessToken, refreshToken } = res.data as LoginResponse;
            const accessToken = res.data.result.accessToken;
            localStorage.setItem('token', accessToken);
            // cookies.set("refreshToken", refreshToken, { path: "/", httpOnly: true });
            return Promise.resolve();
        } else {
            throw new Error('Failed to login');
        }
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
};

export const logout = async () => {
    localStorage.removeItem('token');
    //redirect to main page
    window.location.href = '/';
};

export const redirectURI = atom('/');

// const getRefreshToken = async (): Promise<string> => {
//     return axios.get("/auth/refresh", {
//         headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             refreshToken: localStorage.getItem("refreshToken"),
//         }
//     })
//     .then((res)=>{
//         if(res.status == 200 && res.data.isSuccess && res.data.accessToken){
//             return Promise.resolve(res.data.accessToken)
//         }
//         else if (res.status == 200 && res.data.code == 4000) { //todo: check code
//             logout()
//             return Promise.reject("Refresh token expired")
//         }
//         else{
//             throw new Error("Failed to refresh token")
//         }
//     }).catch((err)=>{
//         console.log(err);
//         return Promise.reject(err)
//     })

// };
