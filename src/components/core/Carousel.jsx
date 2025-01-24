import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SimpleSlider() {
  const data = [
    {
      image:
        "https://iandloveandyou.com/cdn/shop/files/Princess.jpg?v=1655484313&width=400",
      name: "John Doe",
      content: "This is the content for John Doe.",
    },
    {
      image:
        "https://iandloveandyou.com/cdn/shop/files/Princess.jpg?v=1655484313&width=400",
      name: "Jane Smith",
      content: "This is the content for Jane Smith.",
    },
    {
      image:
        "https://iandloveandyou.com/cdn/shop/files/Princess.jpg?v=1655484313&width=400",
      name: "Michael Brown",
      content: "This is the content for Michael Brown.",
    },
    {
      image:
        "https://iandloveandyou.com/cdn/shop/files/Princess.jpg?v=1655484313&width=400",
      name: "Emily Davis",
      content: "This is the content for Chris Wilson.",
    },
  ];

  const NextArrow = (props) => {
    const { onClick } = props; // Ensure onClick is destructured
    return (
      <div
        className="absolute top-1/2 -right-16 z-10 transform -translate-y-1/2 bg-white text-blue-500 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
        onClick={onClick}
      >
        <FaAngleRight />
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props; // Ensure onClick is destructured
    return (
      <div
        className="absolute top-1/2 -left-16 z-10 transform -translate-y-1/2 bg-white text-blue-500  w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
        onClick={onClick}
      >
        <FaAngleLeft />
      </div>
    );
  };

  NextArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  PrevArrow.propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay(); // Force autoplay
    }
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow onClick={() => sliderRef.current.slickNext()} />,
    prevArrow: <PrevArrow onClick={() => sliderRef.current.slickPrev()} />,
  };

  return (
    <div className="py-8">
      <Slider {...settings} ref={sliderRef}>
        {data.map((item) => (
          <div key={item.name} className="px-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-700">{item.content}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SimpleSlider;
