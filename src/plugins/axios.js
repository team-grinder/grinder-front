import axios from 'axios';

const $axios = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true, // 쿠키 포함
});

export default $axios;