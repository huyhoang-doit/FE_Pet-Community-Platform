import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { dogBreeds } from "./dobBreeds";
import { toast } from "sonner";
import { readFileAsDataURL } from "@/lib/utils";
import { submitPetAPI } from "@/apis/submitPet";

const petValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .max(32, "Tối đa 32 ký tự")
    .required("Vui lòng không để trống"),
  breed: Yup.string()
    .trim()
    .max(32, "Tối đa 32 ký tự")
    .required("Vui lòng không để trống"),
  age: Yup.number()
    .min(0, "Tuổi không hợp lệ")
    .required("Vui lòng không để trống"),
  health_status: Yup.string()
    .oneOf(["Healthy", "Sick", "Recovering", "Injured"], "Giá trị không hợp lệ")
    .required("Vui lòng không để trống"),
  description: Yup.string()
    .trim()
    .max(500, "Tối đa 500 ký tự")
    .required("Vui lòng không để trống"),
  image_url: Yup.mixed().required("Vui lòng không để trống"),
  size: Yup.string()
    .trim()
    .max(32, "Tối đa 32 ký tự")
    .required("Vui lòng không để trống"),
  coat: Yup.string()
    .trim()
    .max(32, "Tối đa 32 ký tự")
    .required("Vui lòng không để trống"),
  temperament: Yup.string()
    .trim()
    .max(32, "Tối đa 32 ký tự")
    .required("Vui lòng không để trống"),
  vaccinated: Yup.boolean().required("Vui lòng không để trống"),
});

const SubmitPet = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const submitData = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("breed", values.breed);
      formData.append("age", values.age);
      formData.append("description", values.description);
      formData.append("health_status", values.health_status);
      formData.append("vaccinated", values.vaccinated);
      formData.append("size", values.size);
      formData.append("coat", values.coat);
      formData.append("temperament", values.temperament);
      formData.append("image_url", image);
      await submitPetAPI(formData);
      toast.success("Thông tin thú cưng đã được gửi thành công!");
      resetForm();
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi thông tin thú cưng.");
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center my-8">
      <marquee
        className="text-2xl font-bold my-[2%] ml-[20%] z-[1000000] text-[#DA5BA9]"
        scrollamount="15"
      >
        Nhập thông tin chó cần gửi vào đây!
      </marquee>

      <Formik
        initialValues={{
          name: "",
          breed: "",
          age: "",
          description: "",
          health_status: "",
          vaccinated: null,
          size: "",
          coat: "",
          temperament: "",
          image_url: null,
        }}
        validationSchema={petValidationSchema}
        onSubmit={submitData}
      >
        {({ setFieldValue, isValid, dirty }) => (
          <Form className="w-full max-w-lg space-y-4">
            {step === 1 && (
              <div className="border border-gray-300 rounded-md p-8">
                <div className="py-2">
                  <Field
                    placeholder="Vui lòng nhập tên thú cưng"
                    name="name"
                    className=" w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="py-2">
                  <Field
                    as="select"
                    name="breed"
                    className=" w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  >
                    {dogBreeds.map((breed, index) => (
                      <option key={index} value={breed}>
                        {breed}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="breed"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="py-2">
                  <Field
                    placeholder="Vui lòng nhập tuổi"
                    type="number"
                    name="age"
                    className=" w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  />
                  <ErrorMessage
                    name="age"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="py-2">
                  <Field
                    placeholder="Vui lòng nhập mô tả"
                    as="textarea"
                    name="description"
                    className=" w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="py-2">
                  <Field
                    as="select"
                    name="health_status"
                    className=" w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  >
                    <option value="">Chọn tình trạng sức khỏe</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Sick">Sick</option>
                    <option value="Recovering">Recovering</option>
                    <option value="Injured">Injured</option>
                  </Field>
                  <ErrorMessage
                    name="health_status"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setStep(2)}
                  >
                    Tiếp theo
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="border border-gray-300 rounded-md p-8">
                <div className="py-2">
                  {imagePreview && (
                    <div className="w-full h-64 flex items-center justify-center py-6">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="object-cover h-full w-full rounded-md"
                      />
                    </div>
                  )}
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/png"
                    onChange={async (event) => {
                      await fileChangeHandler(event);
                      setFieldValue("image_url", event.target.files[0]);
                    }}
                    className=" w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  />
                </div>

                <div className="py-2">
                  <Field
                    as="select"
                    name="vaccinated"
                    className=" w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  >
                    <option value={null}>Đã tiêm chủng?</option>
                    <option value={true}>Có</option>
                    <option value={false}>Không</option>
                  </Field>
                  <ErrorMessage
                    name="vaccinated"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="py-2">
                  <Field
                    placeholder="Vui lòng nhập kích thước"
                    name="size"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  />
                  <ErrorMessage
                    name="size"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="py-2">
                  <Field
                    placeholder="Vui lòng nhập màu lông"
                    name="coat"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  />
                  <ErrorMessage
                    name="coat"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="py-2">
                  <Field
                    placeholder="Vui lòng nhập tính cách"
                    name="temperament"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.4)] shadow-md outline-none rounded-md border border-gray-200 focus:border-[#DA5BA9] focus:shadow-lg transition-all duration-300 ease-in-out"
                  />
                  <ErrorMessage
                    name="temperament"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-slate-400 text-white px-4 py-2 rounded hover:bg-slate-500"
                    onClick={() => setStep(1)}
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || !dirty}
                    onClick={() => {
                      if (!isValid)
                        toast.error(
                          "Vui lòng điền đầy đủ thông tin trước khi gửi!"
                        );
                    }}
                    className={`px-4 py-2 rounded ${
                      !isValid || !dirty
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                  >
                    Gửi
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
      <img
        className="fixed top-28 right-0 pointer-events-none z-50 w-1/4"
        src="https://cdn.prod.website-files.com/6139cf517cd6d26ff1548b86/63525e4544284383347d65d1_cat%20insurance%20(1).png"
        alt="a cat looking down"
        sizes="(max-width: 479px) 100vw, (max-width: 991px) 200px, (min-width: 991px) and (max-width: 1600px) 350px, 400px"
      />
    </div>
  );
};

export default SubmitPet;
