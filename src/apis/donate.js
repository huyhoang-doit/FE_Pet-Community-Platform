import { BASE_URL } from "@/configs/globalVariables"
import authorizedAxiosInstance from "@/utils/authorizedAxios"

export const donateAPI = async (amount, description, isAnonymous, campaignId, returnUrl, cancelUrl) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/payment/member/create-payment-link`, {
    amount,
    description,
    isAnonymous,
    campaignId,
    returnUrl,
    cancelUrl
  })
}

export const cancelDonateAPI = async (orderCode) => {
  return await authorizedAxiosInstance.put(`${BASE_URL}/payment/cancel-payment-link`, {
    orderCode
  })
}

export const getTop5DonateAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/donation/top-5`)
}

export const getAllDonateAPI = async (page, limit) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/donation?page=${page}&limit=${limit}`)
}