import { getAllMessageAPI } from "@/apis/message";
import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        console.log(selectedUser?.id);
        
        const { data } = await getAllMessageAPI(selectedUser?.id);
        console.log(data);
        
        if (data.status === 200) {
          dispatch(setMessages(data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessage();
  }, [selectedUser]);
};
export default useGetAllMessage;
