import authorizedAxiosInstance from "@/utils/authorizedAxios"
import { MAIN_URL } from "@/utils/constants"

export const editProfileAPI = async (formData) => {
  return await authorizedAxiosInstance.post(`${MAIN_URL}/api/v1/user/profile/edit`, formData)
}

export const suggestedAPI = async () => {
  return await authorizedAxiosInstance.get(`${MAIN_URL}/api/v1/api/v1/user/suggested`)
}

export const getProfileAPI = async (userId) => {
  return await authorizedAxiosInstance.get(`${MAIN_URL}/api/v1/user/${userId}/profile`)
}