import authorizedAxiosInstance from '@/utils/authorizedAxios'
import { BASE_URL } from '@/configs/globalVariables'

export const likeOrDislikeAPI = async (postId, action) => {
  return await authorizedAxiosInstance.put(`${BASE_URL}/post/${postId}/${action}`)
}

export const commentAPI = async (postId, text) => {
  return await authorizedAxiosInstance.post(`${BASE_URL}/post/${postId}/comment`, { text })
}

export const deletePostAPI = async (postId) => {
  return await authorizedAxiosInstance.delete(`${BASE_URL}/post/${postId}`)
}

export const bookmarkAPI = async (postId) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/post/${postId}/bookmark`)
}

export const fetchAllPostsAPI = async (page) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/post/all?sortBy=createdAt:desc&limit=4&page=${page}`)
}

export const getPostById = async (postId) => {
  return await authorizedAxiosInstance.get(`${BASE_URL}/post/${postId}/getpostbyid`)
}

export const addPostsAPI = async (formData) => {
  return await authorizedAxiosInstance.post(
    `${BASE_URL}/post/addpost`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}
