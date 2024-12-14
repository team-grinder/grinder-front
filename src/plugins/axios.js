import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080',
    timeout: 10000,
});

export default instance;