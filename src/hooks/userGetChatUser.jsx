import { getChatUserAPI } from "@/apis/user";
import { setChatUsers } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetChatUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChatUser = async () => {
      const { data } = await getChatUserAPI();
      if (data.status === 200) {
        dispatch(setChatUsers(data.data));
      }
    }
    fetchChatUser();
  }, [dispatch]);
}

export default useGetChatUser;