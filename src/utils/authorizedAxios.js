import { handleLogoutAPI, refreshTokenAPI } from '@/apis/auth'
import axios from 'axios'
import { toast } from 'sonner'

let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request là 10p
authorizedAxiosInstance.defaults.timeout = 10 * 60 * 1000
authorizedAxiosInstance.defaults.withCredentials = true
authorizedAxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error)
})

let isRefreshing = false
let refreshSubscribers = []

// Helper function to subscribe to token refresh
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback)
}

// Helper function to notify all subscribers
const onTokenRefreshed = () => {
    refreshSubscribers.forEach((callback) => callback())
    refreshSubscribers = []
}

authorizedAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Handle unauthorized access (expired access token)
        if (error.response?.status === 410 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait for token refresh to complete
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(authorizedAxiosInstance(originalRequest))
                    })
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const res = await refreshTokenAPI()
                const newToken = res.data.data
                
                localStorage.setItem('access_token', newToken);

                // Notify all subscribers that token has been refreshed
                onTokenRefreshed()
                isRefreshing = false

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return authorizedAxiosInstance(originalRequest)
            } catch (_error) {
                isRefreshing = false
                // If refresh token fails, logout and redirect to login
                await handleLogoutAPI()
                location.href = '/login'
                return Promise.reject(_error)
            }
        }

        // Handle already logged out state
        if (error.response?.status === 401) {
            await handleLogoutAPI()
            // location.href = '/login'
            return Promise.reject(error)
        }

        // Handle other errors
        if (error.response?.status !== 410) {
            toast.error(error.response?.data?.message || error?.message)
        }

        return Promise.reject(error)
    }
)

export default authorizedAxiosInstance