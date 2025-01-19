import authorizedAxiosInstance from '@/utils/authorizedAxios'

export const handleLogoutAPI = async () => {
  return await authorizedAxiosInstance.post(`http://localhost:3000/api/v1/auth/logout`)
}

export const refreshTokenAPI = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  return await authorizedAxiosInstance.post(`http://localhost:3000/api/v1/auth/refresh-token`, { refresh_token })
}

export const loginAPI = async (data) => {
  return await authorizedAxiosInstance.post(`http://localhost:3000/api/v1/auth/login`, data)
}

