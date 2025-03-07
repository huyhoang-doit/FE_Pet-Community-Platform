import { BASE_URL } from "@/configs/globalVariables";
import authorizedAxiosInstance from "@/utils/authorizedAxios";

export const fetchCampaignAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/campaign/current`);
};

export const fetchCampaignsAPI = async (page, q) => {
  return await authorizedAxiosInstance.get(
    `${BASE_URL}/campaign?page=${page}&q=${q}`
  );
};

export const createCampaignAPI = async (values) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/campaign`, values, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteCampaignAPI = async (id) => {
  return await authorizedAxiosInstance.delete(`${BASE_URL}/campaign/${id}`);
}

export const getCampaignByIdAPI = async (id) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/campaign/${id}`);
}

export const getDonationsByCampaignIdAPI = async (id) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/campaign/${id}/donations`);
}


