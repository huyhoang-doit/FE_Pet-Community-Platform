import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { BASE_URL } from "@/configs/globalVariables";

export const submitPetAPI = async (formData) => {
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/pets/submit`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getPetNotApprovedAPI = async () => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/pets/not-approved`);
};

export const approvePetAPI = async (petId) => {
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/pets/approve/${petId}`
  );
};
