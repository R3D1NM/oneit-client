import axios from 'axios';

const baseURL = import.meta.env.PROD ? import.meta.env.VITE_API_URL : '/api';

const instance = axios.create({
    baseURL,
})

export default instance;