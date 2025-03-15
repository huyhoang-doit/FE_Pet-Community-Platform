import { BASE_URL } from "@/configs/globalVariables";
import axios from "axios";

export const chatbotAPI = async (breedName) => {
  const token = localStorage.getItem('access_token')
  const response = await axios.post(`${BASE_URL}/chatbot`, { breedName }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data.data
}
