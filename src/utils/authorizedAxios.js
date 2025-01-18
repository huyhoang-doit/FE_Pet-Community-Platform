import { handleLogoutAPI, refreshTokenAPI } from '@/apis/auth'
import axios from 'axios'
import { toast } from 'sonner'

let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request là 10p
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000
authorizedAxiosInstance.defaults.withCredentials = true
authorizedAxiosInstance.interceptors.request.use((config) => {

    return config
}, (error) => {
    // Do something with request error
    return Promise.reject(error)
})
let refreshTokenPromise = null

authorizedAxiosInstance.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response?.status === 401) {
        handleLogoutAPI().then(() => {
            // Redirect to login page
            location.href = '/login'
        })
    }
    const originalRequest = error.config
    if (error.response?.status === 410 && originalRequest) {
        if (!refreshTokenPromise) {
            refreshTokenPromise = refreshTokenAPI()
                .then(() => {
                })
                .catch((_error) => {
                    handleLogoutAPI().then(() => {
                        // Redirect to login page
                        location.href = '/login'
                    })
                    return Promise.reject(_error)
                })
                .finally(() => {
                    refreshTokenPromise = null
                })
        }

        return refreshTokenPromise.then(() => {
            return authorizedAxiosInstance(originalRequest)
        })
    }
    if (error.response?.status !== 410) {
        toast.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
})

export default authorizedAxiosInstance