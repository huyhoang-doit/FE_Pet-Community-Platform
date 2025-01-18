import authorizedAxiosInstance from '@/utils/authorizedAxios'

export const handleLogoutAPI = async () => {
  return await authorizedAxiosInstance.get(`http://localhost:3000/api/v1/user/logout`)
}

export const refreshTokenAPI = async () => {
  return await authorizedAxiosInstance.get(`http://localhost:3000/api/v1/user/refresh-token`)
}