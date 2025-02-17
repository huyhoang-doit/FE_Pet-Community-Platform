import { BASE_URL } from "@/configs/globalVariables";
import authorizedAxiosInstance from "@/utils/authorizedAxios";

export const getStatsAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${BASE_URL}/admin/stats`);
  console.log("response", response);
  return response;
};
