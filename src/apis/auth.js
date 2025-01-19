import authorizedAxiosInstance from '@/utils/authorizedAxios'
import { MAIN_URL } from '@/utils/constants';

export const handleLogoutAPI = async () => {
  return await authorizedAxiosInstance.post(`${MAIN_URL}/api/v1/auth/logout`)
}

export const refreshTokenAPI = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  return await authorizedAxiosInstance.post(`${MAIN_URL}/api/v1/auth/refresh-token`, { refresh_token })
}

export const loginAPI = async (data) => {
  return await authorizedAxiosInstance.post(`${MAIN_URL}/api/v1/auth/login`, data)
}

export const registerAPI = async (data) => {
  return await authorizedAxiosInstance.post(`${MAIN_URL}/api/v1/auth/register`, data)
}

