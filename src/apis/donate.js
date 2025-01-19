import { BASE_URL } from "@/configs/globalVariables"
import authorizedAxiosInstance from "@/utils/authorizedAxios"

export const donateAPI = async (amount, message, isAnonymous) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/payment/create-payment-link`, {
    amount,
    message,
    isAnonymous
  })
}