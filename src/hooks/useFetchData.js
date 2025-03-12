import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetCampaign from "@/hooks/useGetCampaign";
import useGetTopDonate from "@/hooks/useGetTopDonate";
import useGetAllAdoptPost from "./useGetAllAdoptPost";

const useFetchData = () => {
  useGetAllPost();
  useGetAllAdoptPost();
  useGetSuggestedUsers(5);
  useGetCampaign();
  useGetTopDonate();
};

export default useFetchData;