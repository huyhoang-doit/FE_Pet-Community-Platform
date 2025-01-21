import { useEffect, useState } from "react";
import Header from "./Header";
import SimpleSlider from "./Carousel";
// import { SimpleSlider } from "./Carousel";
// import { CenterMode, SimpleSlider } from "./Carousel";

function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentIndex(currentIndex === 1 ? 2 : 1);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  return (
    <div>
      {/* Discount */}
      <div
        className={`relative flex flex-row justify-center overflow-hidden text-xs text-center text-white font-bold bg-[#6e1d99] md:text-base`}
      >
        <div className="flex flex-col items-center justify-center w-full h-10 md:h-12">
          <div
            data-index={currentIndex}
            className={`h-full flex items-center px-8 absolute duration-1000 transition-all z-10 ${
              currentIndex === 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center">
              <p>Furry friends, endless joy!</p>
            </div>
          </div>
          <div
            data-index={currentIndex}
            className={`h-full flex items-center px-8 absolute duration-1000 transition-all z-10 ${
              currentIndex === 2 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center">
              <p>Unconditional love, one paw at a time!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <Header />
      </div>

      {/* Banner */}
      <div className="bg-[url('https://iandloveandyou.com/cdn/shop/files/Hero_Image-min.jpg?v=1710510387&width=2800')] w-full h-[711px] bg-cover">
        <div className="flex items-center justify-start h-full">
          <div className="w-1/2">
            <h2 className="text-white text-6xl font-bold mx-10 px-10">
              GOOD, CLEAN, FUNCTIONAL FOOD FOR CATS + DOGS
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#af1685] my-8 py-8">
        <div className="flex flex-col items-center justify-center text-white">
          <h2 className="text-3xl md:text-5xl font-semibold font-display text-[#f1b434]">
            FLAVOR-PACKED & WORRY-FREE
          </h2>
          <p className="w-1/2 text-center text-xl mt-4">
            We use nutrient-rich, easy-to-digest ingredients from reliable
            sourcing partners to craft meals and treats that are crazy delish.
            So you can fill their bowls with (only) the good stuff.
          </p>
        </div>
        <div>
          <ul className="flex flex-row justify-center mt-8 gap-7">
            <li className="w-40 h-40 bg-slate-100 text-center"></li>
            <li className="w-40 h-40 bg-slate-100 text-center">2</li>
            <li className="w-40 h-40 bg-slate-100 text-center">3</li>
          </ul>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-[#f1b434] text-center">
        <h2 className="text-2xl font-bold text-black pt-5">
          CUSTOMERS ARE SAYING
        </h2>
        <div className="w-2/3 mx-auto">
          <SimpleSlider />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
