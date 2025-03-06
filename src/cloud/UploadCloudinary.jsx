import { useState } from "react";

const ImageUpload = ({ onAnalysisResult }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [infor, setInfor] = useState(null);

  const uploadImage = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "cr2sv2gr");
    data.append("cloud_name", "djfpcyyfe");
    data.append("folder", "Cloudinary-React");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/djfpcyyfe/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json();
      // setUrl(res.public_id);
      console.log(res);
      await detectImage(res?.secure_url);

      // onUpload(res.url);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result);
    };
  };

  const handleResetClick = () => {
    setPreview(null);
    setImage(null);
  };

  // Search

  const detectImage = async (imageUrl) => {
    try {
      const response = await fetch("http://localhost:8080/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const result = await response.json();
      setInfor(result?.detected_objects);
      onAnalysisResult(result?.detected_objects);

      // Xử lý kết quả trả về từ API tại đây nếu cần thiết
    } catch (error) {
      console.error("Error detecting image: ", error);
    }
  };

  return (
    <div className=" sm:px-8 md:px-16 sm:py-8">
      <div className="container mx-auto max-w-screen-lg">
        <header className="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
          <p className="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">
            <span>Click on Upload a File</span>&nbsp;
          </p>
          <input
            id="hidden-input"
            type="file"
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />
          <label htmlFor="hidden-input" className="cursor-pointer">
            <div className="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
              Upload a file
            </div>
          </label>

          <div className="flex justify-center items-center mt-5 mx-3 max-w-xs">
            {preview && <img src={preview} alt="preview" className="w-full" />}
          </div>
        </header>
        <div className="flex justify-end pb-8 pt-6 gap-4">
          <button
            onClick={uploadImage}
            className="rounded-sm px-3 py-1 bg-blue-700 hover:bg-blue-500 text-white focus:shadow-outline focus:outline-none disabled:cursor-not-allowed"
            disabled={!image}
          >
            Upload now
          </button>
          <button
            onClick={handleResetClick}
            className="rounded-sm px-3 py-1 bg-red-700 hover:bg-red-500 text-white focus:shadow-outline focus:outline-none"
          >
            Reset
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-4 h-6 w-6"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <>{/* <div>Tải lên thành công</div> */}</>
        )}
      </div>

      <>
        {infor && (
          <div className="flex flex-wrap mt-4">
            <div className="w-full md:w-1/2">
              <img
                src={infor?.image}
                alt="A dog raising its paw"
                className="w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-wrap">
              <div className="w-full md:w-1/2 p-4 bg-orange-500 text-white">
                <h2 className="font-bold text-lg">Giới thiệu</h2>
                <p className="mt-2">Thuộc dòng: {infor?.name}</p>
                <p>Tuổi thọ: {infor?.life_span} năm</p>
                <p>
                  Kích thước:{" "}
                  {infor?.size === 1
                    ? "Nhỏ"
                    : infor?.size === 2
                    ? "Trung bình"
                    : "Lớn"}
                </p>
                <a href="#" className="mt-4 inline-block underline">
                  View More
                </a>
              </div>
              <div className="w-full md:w-1/2 p-4">
                <h2 className="font-bold text-lg">Tính Cách</h2>
                <p className="mt-2">{infor?.temperament}</p>
                <a href="#" className="mt-4 inline-block underline">
                  View More
                </a>
              </div>
              <div className="w-full md:w-1/2 p-4">
                <h2 className="font-bold text-lg">Chăm Sóc</h2>
                <p className="mt-2">{infor?.take_care}</p>
                <a href="#" className="mt-4 inline-block underline">
                  View More
                </a>
              </div>
              <div className="w-full md:w-1/2 p-4 bg-cyan-500 text-white">
                <h2 className="font-bold text-lg">Bệnh Thường Gặp</h2>
                <p className="mt-2">{infor?.sick}</p>
                <a href="#" className="mt-4 inline-block underline">
                  View More
                </a>
              </div>
            </div>
            <div className="mt-4">
              <h1 className="font-semibold">Thông Tin Thêm</h1>
              <p>{infor?.des}</p>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default ImageUpload;
