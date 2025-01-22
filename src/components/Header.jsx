import { Link, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import { FaCartShopping, FaHeart } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
function Header() {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  let decoded;
  if (token) {
    decoded = jwtDecode(token);
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };
  return (
    <header className="flex justify-between items-center h-20 bg-white px-10">
      <div id="logo" className="w-16">
        <Link to="/">
          <svg
            id="Icons"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <defs>
              <style
                dangerouslySetInnerHTML={{
                  __html:
                    ".cls-5{fill:#b76049}.cls-7{fill:#c2aacf}.cls-8{fill:#decee5}.cls-9{fill:#f4e6f4}",
                }}
              />
            </defs>
            <circle cx={256} cy={256} r="255.98" style={{ fill: "#fa4654" }} />
            <path
              d="M0 255.76A255.63 255.63 0 0 1 103.44 50.44c113.54-84.25 273.87-60.52 358.12 53a254.76 254.76 0 0 1 49.93 136 76.89 76.89 0 0 0-14.24 6.88c-23.84 14.74-42 41.9-69.91 44.44-19.15 1.75-37.29-9.24-51.1-22.62s-24.87-29.51-39.4-42.12a112.53 112.53 0 0 0-157.7 10c-14.17 15.89-26.53 37.44-47.68 40-28.75 3.44-51.22-31.63-80-28.95-9.3.87-17.72 5.66-26.73 8a54.5 54.5 0 0 1-24.73.69z"
              style={{ fill: "#e52e44" }}
            />
            <path
              d="M295.18 434.38a36.28 36.28 0 0 1-31.55 18.33h-15.72a36.3 36.3 0 0 1-36.1-40.15l15.72-147.43H284l15.72 147.43a36.1 36.1 0 0 1-4.54 21.82z"
              style={{ fill: "#8c4735" }}
            />
            <path
              d="M295.18 434.38a36.43 36.43 0 0 1-7.15.94l-15.71.5a36.31 36.31 0 0 1-37.37-39l9.8-131.71H284l15.72 147.43a36.1 36.1 0 0 1-4.54 21.84z"
              style={{ fill: "#a05740" }}
            />
            <ellipse
              className="cls-5"
              cx="270.51"
              cy="307.08"
              rx="12.45"
              ry="26.38"
              transform="rotate(-7.35 270.441 306.981)"
            />
            <ellipse
              className="cls-5"
              cx="277.03"
              cy="357.69"
              rx="9.17"
              ry="19.43"
              transform="rotate(-7.35 276.962 357.584)"
            />
            <path
              d="M300.16 256.58a8.55 8.55 0 0 1-8.54 8.55h-71.69a8.55 8.55 0 1 1 0-17.09h71.69a8.54 8.54 0 0 1 8.54 8.54z"
              style={{ fill: "#a583bb" }}
            />
            <path
              className="cls-7"
              d="M300.16 256.58a8.55 8.55 0 0 1-8.54 8.55h-56.37a8.55 8.55 0 1 1 0-17.09h56.37a8.54 8.54 0 0 1 8.54 8.54z"
            />
            <ellipse
              className="cls-8"
              cx="263.91"
              cy="255.36"
              rx="13.26"
              ry="4.67"
            />
            <ellipse
              className="cls-8"
              cx="289.33"
              cy="255.36"
              rx="8.06"
              ry="2.84"
            />
            <path
              className="cls-7"
              d="M303.89 53H197.32a29.14 29.14 0 0 0-29.14 29.14v101.9a29.16 29.16 0 0 0 8.3 20.37L212 240.74a24.21 24.21 0 0 0 17.33 7.3h42.18a24.23 24.23 0 0 0 17.24-7.21l35.92-36.37A29.14 29.14 0 0 0 333 184V82.17A29.15 29.15 0 0 0 303.89 53zm2.67 121a10.27 10.27 0 0 1-10.28 10.27h-16.37A10.27 10.27 0 0 1 269.63 174a10.28 10.28 0 0 0-10.28-10.28h-18.12A10.28 10.28 0 0 0 231 174a10.27 10.27 0 0 1-10.28 10.27H204.3A10.27 10.27 0 0 1 194 174V87.05a9 9 0 0 1 9-9h24a9 9 0 0 1 6.57 2.84l10.09 10.73a9 9 0 0 0 7.84 2.75v.09h9.52V80.51c1.67-1.59 10.14-2.49 12.46-2.49h24a9 9 0 0 1 9 9z"
            />
            <path
              className="cls-8"
              d="M314.68 53H208.11A29.15 29.15 0 0 0 179 82.17v101.9a29.16 29.16 0 0 0 8.3 20.37l35.48 36.3a24.22 24.22 0 0 0 17.33 7.3h42.18a24.23 24.23 0 0 0 17.24-7.21l35.92-36.37a29.14 29.14 0 0 0 8.37-20.46V82.17A29.14 29.14 0 0 0 314.68 53zm2.66 121a10.27 10.27 0 0 1-10.28 10.27h-16.37A10.27 10.27 0 0 1 280.41 174a10.28 10.28 0 0 0-10.28-10.28H252A10.28 10.28 0 0 0 241.73 174a10.27 10.27 0 0 1-10.28 10.27h-16.37A10.27 10.27 0 0 1 204.8 174V87.05a9 9 0 0 1 9-9h24a9.06 9.06 0 0 1 6.58 2.84l10.12 10.7a9 9 0 0 0 13.14 0l10.1-10.73a9 9 0 0 1 6.57-2.86h24a9 9 0 0 1 9 9z"
            />
            <ellipse
              className="cls-9"
              cx="330.58"
              cy="98.34"
              rx="10.97"
              ry="23.24"
            />
            <ellipse
              className="cls-9"
              cx="330.58"
              cy="143.3"
              rx="8.08"
              ry="17.12"
            />
            <ellipse
              className="cls-9"
              cx="212.97"
              cy="65.02"
              rx="18.95"
              ry="8.94"
            />
            <rect
              className="cls-7"
              x="234.33"
              y="196.57"
              width="53.48"
              height="34.64"
              rx="8.5"
            />
          </svg>
        </Link>
      </div>
      <div className="flex gap-12 h-full">
        <Navbar />
      </div>
      <div className="flex gap-10 items-center">
        {!token || token === null ? (
          <div className="relative group py-7">
            <NavLink to="/login">Signin</NavLink>
            {" / "}
            <NavLink to="/signup">Signup</NavLink>
          </div>
        ) : (
          <div className="relative group py-7">
            <FaUser className="cursor-pointer text-xl" />
            <div className="absolute top-[4.85rem] border right-[-2.5rem] bg-white p-2  opacity-0 invisible transform translate-y-4 transition-all duration-150 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <NavLink
                to={`/profile/${decoded.username}`}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </NavLink>
              <NavLink
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </NavLink>
            </div>
          </div>
        )}

        <div className="relative">
          <Link to="/wishlist">
            <FaHeart className="cursor-pointer text-xl" />
            <p className="absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-full">
              0
            </p>
          </Link>
        </div>
        <div className="relative">
          <Link to="/cart">
            <FaCartShopping className="cursor-pointer text-xl" />
            <p className="absolute top-[-0.5rem] right-[-0.5rem] bg-red-600 text-white w-4 h-4 flex items-center justify-center rounded-full">
              0
            </p>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
