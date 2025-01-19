import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function SimpleSlider() {
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 -right-16 z-10 transform -translate-y-1/2 bg-white text-blue-500 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
      onClick={onClick}
    >
      <FaAngleRight />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 -left-16 z-10 transform -translate-y-1/2 bg-white text-blue-500  w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
      onClick={onClick}
    >
      <FaAngleLeft />
    </div>
  );

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
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Slider>
    </div>
  );
}

export default SimpleSlider;
