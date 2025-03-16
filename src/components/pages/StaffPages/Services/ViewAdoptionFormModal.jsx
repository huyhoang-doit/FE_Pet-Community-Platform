/* eslint-disable react/prop-types */
import { Modal, Descriptions, Divider, Image, Tag, Select, Button } from "antd";
import { useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import { updateAdoptionFormStatusAPI } from "@/apis/post";

const { Option } = Select;

const ViewAdoptionFormModal = ({ open, setOpen, form, onStatusUpdate }) => {
  if (!form) return null;

  const {
    adopter,
    adoptionPost,
    pet,
    user,
    message,
    status,
    periodicChecks,
    createdAt,
  } = form;

  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState(status);

  const handleStatusChange = (value) => {
    setNewStatus(value);
  };

  const handleSaveStatus = async () => {
    try {
      const response = await updateAdoptionFormStatusAPI(form._id, newStatus);
      if (response.status === 200) {
        toast.success("Cập nhật trạng thái đơn nhận nuôi thành công");
        setIsEditing(false);
        if (onStatusUpdate) {
          onStatusUpdate(form._id, newStatus); // Notify parent to refresh data
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi cập nhật trạng thái!"
      );
    }
  };

  return (
    <Modal
      title="Chi tiết đơn nhận nuôi"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={800}
    >
      <div className="space-y-6">
        {/* Adopter Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Thông tin người nhận nuôi
          </h3>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Họ tên">{adopter.name}</Descriptions.Item>
            <Descriptions.Item label="Email">{adopter.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {adopter.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {`${adopter.address.detail}, ${adopter.address.ward}, ${adopter.address.district}, ${adopter.address.province}`}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Pet Information */}
        <Divider />
        <div>
          <h3 className="text-lg font-semibold mb-2">Thông tin thú cưng</h3>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tên">{pet.name}</Descriptions.Item>
            <Descriptions.Item label="Giống">{pet.breed}</Descriptions.Item>
            <Descriptions.Item label="Tuổi">{pet.age} tuổi</Descriptions.Item>
            <Descriptions.Item label="Tình trạng sức khỏe">
              {pet.health_status}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {pet.description}
            </Descriptions.Item>
            <Descriptions.Item label="Hình ảnh">
              {pet.image_url?.[0]?.[0] ? (
                <Image
                  src={pet.image_url[0][0]}
                  alt={pet.name}
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              ) : (
                "Không có ảnh"
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Adoption Post Information */}
        <Divider />
        <div>
          <h3 className="text-lg font-semibold mb-2">Thông tin bài đăng</h3>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tiêu đề">
              {adoptionPost.caption}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái nhận nuôi">
              <Tag
                color={
                  adoptionPost.adopt_status === "Available"
                    ? "green"
                    : adoptionPost.adopt_status === "Pending"
                    ? "yellow"
                    : "blue"
                }
              >
                {adoptionPost.adopt_status === "Available"
                  ? "Chưa nhận nuôi"
                  : adoptionPost.adopt_status === "Pending"
                  ? "Đã liên hệ"
                  : "Đã nhận nuôi"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Địa điểm">
              {adoptionPost.location}
            </Descriptions.Item>
            <Descriptions.Item label="Hình ảnh bài đăng">
              {adoptionPost.image?.[0] ? (
                <Image
                  src={adoptionPost.image[0]}
                  alt="Adoption Post"
                  width={100}
                  height={100}
                  className="object-cover rounded"
                />
              ) : (
                "Không có ảnh"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đăng">
              {moment(adoptionPost.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Form Information */}
        <Divider />
        <div>
          <h3 className="text-lg font-semibold mb-2">Thông tin đơn</h3>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Người gửi đơn">
              {user.username}
            </Descriptions.Item>
            <Descriptions.Item label="Thông điệp">
              {message || "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Select
                    value={newStatus}
                    onChange={handleStatusChange}
                    style={{ width: 120 }}
                  >
                    <Option value="Pending">Đang chờ</Option>
                    <Option value="Approved">Đã duyệt</Option>
                    <Option value="Rejected">Đã từ chối</Option>
                  </Select>
                  <Button
                    type="primary"
                    onClick={handleSaveStatus}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Lưu
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Hủy</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Tag
                    color={
                      status === "Pending"
                        ? "yellow"
                        : status === "Approved"
                        ? "green"
                        : "red"
                    }
                  >
                    {status === "Pending"
                      ? "Đang chờ"
                      : status === "Approved"
                      ? "Đã duyệt"
                      : "Đã từ chối"}
                  </Tag>
                  {status !== "Rejected" && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {moment(createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Số lần kiểm tra định kỳ">
              {periodicChecks.length}/3
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default ViewAdoptionFormModal;