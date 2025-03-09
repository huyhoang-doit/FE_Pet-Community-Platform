import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils/formatVND";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Campaigns = () => {
  const { campaigns } = useSelector((store) => store.campaign);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tất cả chiến dịch quyên góp</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign) => (
          <Card key={campaign._id} className="w-full">
            <CardHeader>
              <CardTitle>{campaign.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={(campaign.currentAmount / campaign.targetAmount) * 100}
                />
                <div className="flex justify-between text-sm">
                  <span>Đã quyên góp: {formatVND(campaign.currentAmount)}</span>
                  <span>Mục tiêu: {formatVND(campaign.targetAmount)}</span>
                </div>
                <Button className="w-full" style={{marginBottom: "10px"}}>Quyên góp ngay</Button>
                <Link to={`/donate/${campaign._id}`}>
                  <Button className="w-full">Xem chi tiết</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
