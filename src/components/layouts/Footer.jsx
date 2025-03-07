import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="flex justify-evenly p-8 bg-[#6e1d99] text-white">
      <div className="flex flex-col gap-4 text-lg">
        <div>
          <h2 className="font-bold">FTHEO DÕI CHÚNG TÔI</h2>
        </div>
        <ul className="flex gap-4">
          <li>
            <Link to="https://www.facebook.com/shinichikun120">
              <FaFacebookF />
            </Link>
          </li>
          <li>
            <Link to={"#"}>
              <FaXTwitter />
            </Link>
          </li>
          <li>
            <Link to={"#"}>
              <FaInstagram />
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-lg ">
        <h2 className="font-bold">HỖ TRỢ</h2>
        <ul className="flex flex-col gap-2">
          <li>Liên hệ chúng tôi</li>
          <li>Câu hỏi thường gặp</li>
          <li>Điều khoản dịch vụ</li>
          <li>Chính sách quyền riêng tư</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-lg">
        <h2 className="font-bold">TÀI NGUYÊN</h2>
        <ul className="flex flex-col gap-2">
          <li>Blog</li>
          <li>Phát triển bền vững</li>
          <li>Về chúng tôi</li>
          <li>Pawparazzi</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-lg w-1/3">
        <h2 className="font-bold">BẢN TIN</h2>
        <p className="w-2/3">
          {
            'Đăng ký nhận thông tin cập nhật về sản phẩm, dịch vụ và sự kiện của "I and love and you"'
          }
        </p>
        <form action="">
          <div className="flex flex-col gap-4">
            <label className="block">Email của bạn</label>
            <input
              type="email"
              placeholder="Nhập email"
              className="w-2/3 p-2"
            />
            <button className="py-2 w-1/4 rounded-3xl text-white font-bold bg-transparent hover:bg-[#471860]">
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Footer;
