import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Wallet } from "lucide-react";
import { donateAPI } from "@/apis/donate";

const ProcessDonate = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleDonate = async () => {
    const response = await donateAPI(amount, message, isAnonymous);
    
    if (response.status === 200) {
      window.location.href = response.data.paymentLink.checkoutUrl;
    }
  }

  return (
    <div className="my-10">
      <div className="block-container">
        <h3 className="block-minorHeader">
          <Link to="/donate/danh-cap-mat-troi.3/" rel="nofollow">
            Alley mèo đồng minh
          </Link>
        </h3>

        <div className="block-body">
          <div className="block-row">
            <div className="donate-progressBarContainer mb-2">
              <div
                className="donate-progressBarContainer-bar"
                style={{ width: "20%" }}
              ></div>
              <div className="donate-progressBarContainer-progress">20%</div>
            </div>

            <dl className="pairs pairs--justified mb-2">
              <dt>Đã nhận</dt>
              <dd>1,002,381₫</dd>
            </dl>

            <dl className="pairs pairs--justified">
              <dt>Mục tiêu</dt>
              <dd>5,000,000₫</dd>
            </dl>
          </div>

          <div className="block-row flex items-center justify-between gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="button--primary button rippleButton">
                  <span className="button-text">Donate</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[825px]">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Donate to Alley mèo đồng minh</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Số tiền quyên góp:</label>
                      <input
                        type="number"
                        value={amount}
                        min={0}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Nhập số tiền quyên góp"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1">Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter your message"
                        rows="3"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="anonymous">Ẩn danh</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={!isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="anonymous">Tiết lộ số tiền</label>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        onClick={() => setOpen(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDonate}
                        className="button--primary"
                      >
                        <Wallet /> <span className="ml-2">Donate</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Link
              to="/donate/danh-cap-mat-troi.3/"
              className="button button rippleButton"
            >
              <span className="button-text">Xem</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessDonate;
