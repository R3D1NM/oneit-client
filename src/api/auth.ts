import {SignUpUser, User} from '@/lib/types';
import axios from '@/lib/axios';
import {atom} from 'jotai';
import {atomWithDefault} from 'jotai/utils';

const getMe = async () => {
    //get user info
    //todo: get user info from server
    return axios
        .get('/v2/kakao/user')
        .then((res) => {
            // console.log(res);
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            // console.log(err);
            return Promise.reject(err);
        });
};

//Auth
const getAuth = async (): Promise<User | null> => {
    const token = {
        access: localStorage.getItem('token'),
        // refresh: cookies.get('refreshToken'),
    };
    // console.log('token', token);

    if (token.access) {
        return getMe()
            .then((res) => res)
            .catch((err) => {
                // console.log(err);
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
    console.log('[AUTH] updating auth');

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
    return axios
        .post('/v2/kakao/login', {
            accessToken: token,
        })
        .then((res) => {
            const accessToken = res.data.accessToken;
            localStorage.setItem('token', accessToken);
            return Promise.resolve(res.data.isSignedUp);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });
};

export const logout = async () => {
    localStorage.removeItem('token');
    //redirect to main page
    window.location.href = '/main';
};

export const redirectURI = atom('/main');

export const signUp = async (user: SignUpUser) => {
    return axios
        .post('/v2/signup', user)
        .then((res) => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const nicknameCheck = async (nickname: string) => {
    return axios
        .get(`/v2/nickname/check?nickname=${nickname}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

interface EditUserInfo {
    nickname: string;
    profileImage?: File | null;
    birthDate: string;
}

export const editUserInfo = async (user: EditUserInfo) => {
    const data = {
        nickname: user.nickname,
        birthDate: user.birthDate,
    };
    let payload = new FormData();
    payload.append('request', JSON.stringify(data));
    if (user.profileImage) {
        payload.append('image', user.profileImage as File);
    }
    return axios
        .patch('/v2/user', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            transformRequest: [() => payload],
        })
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const userWithdrawal = async () => {
    return axios
        .post('/v2/withdraw')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

// export const editBasket = async (
//     basketID: string,
//     basket: Basket,
//     thumbnail: File | null,
// ) => {
//     const data = {
//         name: basket.name,
//         description: basket.description,
//         deadline: basket.deadline,
//         accessStatus: basket.accessStatus,
//     };

//     let payload = new FormData();
//     payload.append('request', JSON.stringify(data));
//     payload.append('image', thumbnail as File);
//     return axios
//         .put(`/v2/giftbox/${basketID}`, basket, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//             transformRequest: [() => payload],
//         })
//         .then((res) => {
//             return Promise.resolve(res.data);
//         })
//         .catch((err) => {
//             return Promise.reject(err);
//         });
// };

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
