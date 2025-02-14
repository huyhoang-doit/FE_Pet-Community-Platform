import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { BASE_URL } from "@/configs/globalVariables";

export const submitPetAPI = async (formData) => {
  console.log(formData);
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
