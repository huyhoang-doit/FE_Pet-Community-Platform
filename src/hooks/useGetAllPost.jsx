import { setPosts } from "@/redux/postSlice";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await authorizedAxiosInstance.get('http://localhost:3000/api/v1/post/all');
                if (res.data.success) { 
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllPost();
    }, []);
};
export default useGetAllPost;