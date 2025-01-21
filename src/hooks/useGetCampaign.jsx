import { fetchCampaignAPI } from "@/apis/campaign";
import { setCampaign } from "@/redux/campaignSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCampaign = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const { data } = await fetchCampaignAPI();
                
                if (data.status === 200) {
                    dispatch(setCampaign(data.data));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchCampaign();
    })
}

export default useGetCampaign;