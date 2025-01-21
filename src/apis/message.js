import { BASE_URL } from "@/configs/globalVariables"
import authorizedAxiosInstance from "@/utils/authorizedAxios"

export const sendMessageAPI = async (receiverId, textMessage) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/message/send/${receiverId}`, { textMessage })
}

export const getAllMessageAPI = async (userId) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/message/all/${userId}`)
}
