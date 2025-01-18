import { setUserProfile } from "@/redux/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import authorizedAxiosInstance from "@/utils/authorizedAxios";

const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // const [userProfile, setUserProfile] = useState(null);
    
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await authorizedAxiosInstance.get(`http://localhost:3000/api/v1/user/${userId}/profile`);
                
                if (res.data.success) {
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId, dispatch]);
};
export default useGetUserProfile;