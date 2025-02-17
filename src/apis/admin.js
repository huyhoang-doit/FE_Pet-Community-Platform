import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { BASE_URL } from "@/configs/globalVariables";

export const getStatsAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/admin/stats`);
};
