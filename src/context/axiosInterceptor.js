import axios from "axios";

const axiosIstance = axios.create({
    baseURL: 'http://localhost',
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosIstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('auth-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    }, (error) => {
        return Promise.reject(error)
    }
)

export default axiosIstance;