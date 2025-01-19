import { BASE_URL } from "@/configs/globalVariables"
import authorizedAxiosInstance from "@/utils/authorizedAxios"

export const editProfileAPI = async (formData) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/api/v1/user/profile/edit`, formData)
}

export const suggestedAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/api/v1/api/v1/user/suggested`)
}

export const getProfileAPI = async (userId) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/api/v1/user/${userId}/profile`)
}