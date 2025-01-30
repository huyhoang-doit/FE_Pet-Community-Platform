import { suggestedAPI } from "@/apis/user";
import { setSuggestedUsers } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = (limit) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const { data } = await suggestedAPI(limit);

        if (data.status === 200) {
          dispatch(setSuggestedUsers(data.data.results));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);
};
export default useGetSuggestedUsers;
