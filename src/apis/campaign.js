import { BASE_URL } from "@/configs/globalVariables"
import authorizedAxiosInstance from "@/utils/authorizedAxios"

export const fetchCampaignAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/campaign/current`)
}