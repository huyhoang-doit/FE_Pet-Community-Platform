import { Button } from "antd";
import { Bone, Grid2x2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdoptionCreatePost() {
  return (
    <div className="my-5">
      <div className="block-container">
        <h3 className="block-minorHeader">Pet Love - Animal Care</h3>

        <div className="block-body">
          <div className="block-row"></div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/staff" rel="nofollow">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
                <Bone className="cursor-pointer text-white" size={18} />
                <span className="button-text">Thêm bài đăng</span>
              </Button>
            </Link>

            <Link to="/staff" rel="nofollow">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition duration-300 flex items-center gap-2">
                <Grid2x2 className="cursor-pointer text-white" size={18} />
                <span className="button-text">Thống kê</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
