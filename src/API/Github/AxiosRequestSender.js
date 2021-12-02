import axios from 'axios'

// Create an axios instance
const service = axios.create({
    baseURL: 'https://api.github.com', // api base_url
    timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
    config.headers['Authorization'] = 'Token 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'
    return config;
}, error => {
    Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
    response => {
        if (response.status !== 200) {
            return Promise.reject("Request error.");
        } else {
            return response.data;
        }
    },
    error => {
        return Promise.reject(error)
    })

export default service