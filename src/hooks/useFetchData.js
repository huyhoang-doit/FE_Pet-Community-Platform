import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import useGetCampaign from "@/hooks/useGetCampaign";
import useGetTopDonate from "@/hooks/useGetTopDonate";
import useGetAllAdoptPost from "./useGetAllAdoptPost";
import { useEffect } from "react";

const useFetchData = () => {
  const { fetchAllPost } = useGetAllPost();
  const { fetchAdoptPosts } = useGetAllAdoptPost();
  const { fetchSuggestedUsers } = useGetSuggestedUsers(5);
  const { fetchCampaigns } = useGetCampaign();
  const { fetchTopDonate } = useGetTopDonate();

  useEffect(() => {
    fetchAllPost();
    fetchAdoptPosts();
    fetchSuggestedUsers();
    fetchCampaigns();
    fetchTopDonate();
  }, [
    fetchAllPost,
    fetchAdoptPosts,
    fetchSuggestedUsers,
    fetchCampaigns,
    fetchTopDonate,
  ]);
};

export default useFetchData;
