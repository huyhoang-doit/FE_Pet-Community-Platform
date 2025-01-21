import { BASE_URL } from "@/configs/globalVariables"
import authorizedAxiosInstance from "@/utils/authorizedAxios"

export const editProfileAPI = async (formData) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/user/profile/edit`, formData)
}

export const suggestedAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/user/suggested`)
}

export const getProfileAPI = async (username) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/user/${username}/profile`)
}

export const followOrUnfollowAPI = async (userId) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/user/followorunfollow/${userId}`)
}

export const getProfileByIdAPI = async (userId) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/user/id/${userId}/profile`)
}

export const getChatUserAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/user/chat-users`)
}
