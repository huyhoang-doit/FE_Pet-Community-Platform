import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="flex justify-evenly p-8 bg-[#6e1d99] text-white">
      <div className="flex flex-col gap-4 text-lg">
        <div>
          <h2 className="font-bold">FOLLOW US</h2>
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
        <h2 className="font-bold">HELP</h2>
        <ul className="flex flex-col gap-2">
          <li>Contact Us</li>
          <li>FAQs</li>
          <li>Return Policy</li>
          <li>Where to Buy</li>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-lg">
        <h2 className="font-bold">RESOURCES</h2>
        <ul className="flex flex-col gap-2">
          <li>Blog</li>
          <li>Sustainability</li>
          <li>About Us</li>
          <li>Pawparazzi</li>
        </ul>
      </div>
      <div className="flex flex-col gap-4 text-lg w-1/3">
        <h2 className="font-bold">NEWSLETTER</h2>
        <p className="w-2/3">
          {
            ' Sign up to receive updates about "I and love and you" products, services, and events'
          }
        </p>
        <form action="">
          <div className="flex flex-col gap-4">
            <label className="block">Your email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-2/3 p-2"
            />
            <button className="py-2 w-1/4 rounded-3xl text-white font-bold bg-transparent hover:bg-[#471860]">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Footer;
