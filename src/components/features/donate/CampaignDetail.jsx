import { useParams } from "react-router-dom";
import ProcessDonate from "./ProcessDonate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import {
  getCampaignByIdAPI,
  getDonationsByCampaignIdAPI,
} from "@/apis/campaign";
import { formatVND } from "@/utils/formatVND";
import { formatDate } from "@/utils/formatDateTime";

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);
  useEffect(() => {
    const fetchCampaign = async () => {
      const response = await getCampaignByIdAPI(id);
      setCampaign(response.data.data);
    };
    const fetchDonations = async () => {
      const response = await getDonationsByCampaignIdAPI(id);
      console.log(response.data.data);
      setDonations(response.data.data);
    };
    id && fetchCampaign();
    id && fetchDonations();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="relative h-[400px] rounded-xl overflow-hidden">
          <img
            src={campaign?.image}
            alt={campaign?.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{campaign?.title}</h1>
          <ProcessDonate campaign={campaign} />
        </div>
      </div>

      {/* Campaign Details Tabs */}
      <Tabs defaultValue="story" className="w-full">
        <TabsList className="w-full justify-start border-b">
          <TabsTrigger value="story" className="text-lg font-bold mr-4">
            Câu chuyện
          </TabsTrigger>
          <TabsTrigger value="updates" className="text-lg font-bold mr-4">
            Cập nhật
          </TabsTrigger>
          <TabsTrigger value="donors" className="text-lg font-bold">
            Người ủng hộ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="story" className="mt-6">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: campaign?.description }} />
          </div>
        </TabsContent>

        <TabsContent value="updates" className="mt-6">
          <div className="space-y-6">
            <h2>Người tạo chiến dịch</h2>
            <div className="flex items-center gap-4">
              <img
                src={campaign?.user?.profilePicture}
                alt={campaign?.user?.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-300"
              />
              <h3 className="text-lg font-bold">
                {campaign?.user?.lastName} {campaign?.user?.firstName}
              </h3>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="donors" className="mt-6">
          <div className="space-y-4">
            {donations?.map((donor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200">
                    {donor?.user?.profilePicture && (
                      <img
                        src={donor?.user?.profilePicture}
                        alt={
                          donor?.user?.lastName + " " + donor?.user?.firstName
                        }
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {donor?.isAnonymous
                        ? "Ẩn danh"
                        : donor?.user?.firstName
                        ? donor?.user?.lastName + " " + donor?.user?.firstName
                        : donor?.user?.username}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(donor?.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatVND(donor.amount)}
                  </p>
                  {donor.message && (
                    <p className="text-sm text-gray-600">{donor.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetail;
