import axios from 'axios';

const baseURL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api';

const instance = axios.create({
    baseURL,
})

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if(config.headers && token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }, 
    (error) => {
        return Promise.reject(error)
    }
)

export default instance;