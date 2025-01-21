import { getTop5DonateAPI } from "@/apis/donate";
import { setTopDonate } from "@/redux/donateSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetTopDonate = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchTopDonate = async () => {
            const { data } = await getTop5DonateAPI();
            if (data.status === 200) {
                dispatch(setTopDonate(data.data));
            }
        }
        fetchTopDonate();
    })
}

export default useGetTopDonate;