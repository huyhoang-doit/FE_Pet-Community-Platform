import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { dogBreeds } from "@/components/submitPet/dobBreeds";
import { updatePetAPI } from "@/apis/pet";
import { toast } from "sonner";

const EditPetModal = ({ visible, pet, onClose, onUpdate }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(pet.image_url[0]);
  const [status, setStatus] = useState("");

  const petValidationSchema = Yup.object().shape({
    name: Yup.string().required("Vui lòng nhập tên thú cưng"),
    breed: Yup.string().required("Vui lòng chọn giống"),
    age: Yup.number().required("Vui lòng nhập tuổi"),
    description: Yup.string().required("Vui lòng nhập mô tả"),
    health_status: Yup.string().required("Vui lòng chọn tình trạng sức khỏe"),
    vaccinated: Yup.boolean()
      .nullable()
      .required("Vui lòng chọn tình trạng tiêm chủng"),
    size: Yup.string().required("Vui lòng nhập kích thước"),
    coat: Yup.string().required("Vui lòng nhập màu lông"),
    temperament: Yup.string().required("Vui lòng nhập tính cách"),
    image_url: Yup.mixed().nullable(),
  });

  const fileChangeHandler = (event, setFieldValue, status) => {
    setStatus(status);
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(newImages[0]);

      setFieldValue("image_url", newImages);
    }
  };

  const submitData = async (values) => {
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
      formData.append("status", status);

      if (
        values.image_url &&
        Array.isArray(values.image_url) &&
        values.image_url.length > 0
      ) {
        values.image_url.forEach((image) => {
          console.log("Appending file:", image);
          formData.append("image_url", image);
        });
      } else {
        if (values.currentImageUrl) {
          formData.append("image_url", values.currentImageUrl);
        }
      }

      setLoading(true);
      const updatedPet = await updatePetAPI(pet._id, formData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      onUpdate(updatedPet);
      onClose();
    } catch (error) {
      setLoading(false);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin thú cưng!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thú cưng"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#DA5BA9] rounded-full animate-spin"></div>
            <p className="text-lg font-semibold mt-4">Đang cập nhật...</p>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center my-8">
        <Formik
          initialValues={{
            name: pet.name,
            breed: pet.breed,
            age: pet.age,
            description: pet.description,
            health_status: pet.health_status,
            vaccinated: pet.vaccinated,
            size: pet.size,
            coat: pet.coat,
            temperament: pet.temperament,
            image_url: pet.image_url[0],
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
                  <div className="w-full bg-card backdrop-blur-md h-64 rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center relative">
                    {imagePreview ? (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <motion.img
                          src={imagePreview}
                          alt="preview"
                          className="object-cover h-full w-full rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition"
                          onClick={() => setImagePreview(null)}
                        >
                          <MdDelete className="text-lg" />
                        </button>
                        <div className="mt-2">
                          <label
                            htmlFor="upload-image"
                            className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-md shadow-md hover:bg-gredd-600 transition hover:cursor-pointer"
                          >
                            Thêm ảnh
                          </label>
                          <input
                            id="upload-image"
                            type="file"
                            name="upload-image"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              fileChangeHandler(e, setFieldValue, "add_image")
                            }
                            className="w-0 h-0"
                          />
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="upload-image"
                        className="flex flex-col items-center justify-center h-full w-full cursor-pointer"
                      >
                        <p className="font-bold text-4xl">
                          <FaCloudUploadAlt className="-rotate-0" />
                        </p>
                        <p className="text-lg text-textColor">
                          Nhấn để tải ảnh lên
                        </p>
                        <input
                          id="upload-image"
                          type="file"
                          name="upload-image"
                          accept="image/*"
                          multiple
                          onChange={(e) =>
                            fileChangeHandler(
                              e,
                              setFieldValue,
                              "upload_new_image"
                            )
                          }
                          className="w-0 h-0"
                        />
                      </label>
                    )}
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
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed shake"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default EditPetModal;
