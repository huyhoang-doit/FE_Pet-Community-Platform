import { setSuggestedUsers } from "@/redux/authSlice";
import authorizedAxiosInstance from "@/utils/authorizedAxios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const { data } = await authorizedAxiosInstance.get(
          "http://localhost:3000/api/v1/user/suggested"
        );
        if (data.status === 200) {
          dispatch(setSuggestedUsers(data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);
};
export default useGetSuggestedUsers;
