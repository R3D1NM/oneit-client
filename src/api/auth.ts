import { User } from '@/lib/types';
import axios from '@/lib/axios';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithDefault } from 'jotai/utils'
import { Cookies } from "react-cookie";

const cookies = new Cookies();

// interface LoginResponse {
//     accessToken: string;
//     refreshToken: string;
// }

const getMe = async () => {
    //get user info
    //todo: get user info from server
    return axios.get("/v1/kakao/user")
    .then((res)=>{
        console.log(res);
        
        if(res.status == 200 && res.data.isSuccess){
            return Promise.resolve(res.data.result)
        }
        else{
            throw new Error("Failed to get user info")
        }
    }).catch((err)=>{
        console.log(err);
        return Promise.reject(err)
    })
}

//Auth
const getAuth =  async (): Promise<User | null> => {
    const token = {
        access: localStorage.getItem('token'),
        // refresh: cookies.get('refreshToken'),
    };
    console.log(token);
    

    if (token.access) {
        try {
            const userInfo = await getMe();
            return userInfo;
        }
        catch (err) {
            console.log(err);
            return null;
        }
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
authAtom.debugLabel = "authAtom";

export const updateAuthAtom = atom(null, async (get, set) => {
    set(authAtom, getAuth());
});





export const login = async (token: string) => {
    try {
        const res = await axios.post("/v1/kakao/login", {
            accessToken: token
        });

        if (res.status == 200 && res.data.isSuccess) {
            // const { accessToken, refreshToken } = res.data as LoginResponse;
            const accessToken = res.data.result.accessToken;
            localStorage.setItem("token", accessToken);
            // cookies.set("refreshToken", refreshToken, { path: "/", httpOnly: true });
            return Promise.resolve();
        } else {
            throw new Error("Failed to login");
        }
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}

export const logout = async () => {
    localStorage.removeItem("token")
}


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