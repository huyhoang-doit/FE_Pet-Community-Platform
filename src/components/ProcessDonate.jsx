import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";

const ProcessDonate = () => {
  const handleDonate = async () => {
    const response = await axios.post('http://localhost:3000/api/v1/payment/create-payment-link', {}, {
      withCredentials: true
    } )
    console.log('response', response.data.paymentLink.checkoutUrl)
    if (response.status === 200) {
      window.location.href = response.data.paymentLink.checkoutUrl
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
            <Button
              className="button--primary button rippleButton"
              data-xf-click="overlay"
              onClick={handleDonate}
            >
              <span className="button-text">Donate</span>
            </Button>
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
