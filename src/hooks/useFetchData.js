import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetCampaign from "@/hooks/useGetCampaign";
import useGetTopDonate from "@/hooks/useGetTopDonate";
import useGetChatUser from "@/hooks/userGetChatUser";
import useGetAllAdoptPost from "./useGetAllAdoptPost";

const useFetchData = () => {
  useGetAllPost();
  useGetAllAdoptPost();
  useGetSuggestedUsers(5);
  useGetCampaign();
  useGetTopDonate();
  useGetChatUser();
};

export default useFetchData;