/* eslint-disable react/prop-types */
import { Modal, Form, Select, Input, Button, DatePicker, Upload, Alert } from "antd";
import { useState, useEffect } from "react";
import moment from "moment";
import { addPeriodicCheckAPI } from "@/apis/post";
import { toast } from "sonner";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const PeriodicCheckModal = ({ open, setOpen, form, onSubmit, currentUser }) => {
  const [formInstance] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]); // Lưu danh sách file upload

  const isCheckNeeded = () => {
    if (!form.next_check_date) return false;
    const now = moment();
    const checkDate = moment(form.next_check_date);
    return now.isSameOrAfter(checkDate, "day");
  };

  // Reset form khi modal mở/đóng
  useEffect(() => {
    if (open) {
      formInstance.resetFields();
      formInstance.setFieldsValue({
        checkDate: moment(),
        status: "Good",
      });
      setFileList([]); // Reset file list khi mở modal
    }
  }, [open, formInstance]);

  const handleSubmit = async (values) => {
    try {
      // Validate nếu check được phép
      if (!isCheckNeeded() && form.next_check_date) {
        toast.error("Chưa đến thời gian kiểm tra tiếp theo!");
        return;
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("adoptionFormId", form._id);
      formData.append("checkDate", values.checkDate.toISOString());
      formData.append("status", values.status);
      formData.append("notes", values.notes);
      formData.append("checkedBy", currentUser.id);

      // Thêm file vào formData nếu có
      if (fileList.length > 0) {
        formData.append("image_url", fileList[0].originFileObj);
      }

      console.log("Form Data before sending:", {
        adoptionFormId: form._id,
        checkDate: values.checkDate.toISOString(),
        status: values.status,
        notes: values.notes,
        checkedBy: currentUser.id,
        hasImage: fileList.length > 0,
      });

      const { data } = await addPeriodicCheckAPI(form._id, formData);
      if (data.status === 200) {
        toast.success("Periodic check added successfully");
        await onSubmit(data.data);
        setOpen(false);
      }
    } catch (error) {
      console.error("Error submitting periodic check:", error);
      toast.error(error.response?.data?.message || "Failed to add periodic check");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi file thay đổi
  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const isCheckButtonDisabled = () => {
    if (!form.next_check_date) return false;
    const now = moment();
    const nextCheck = moment(form.next_check_date);
    return now.isBefore(nextCheck);
  };

  return (
    <Modal
      title={`Kiểm tra định kỳ (${form?.periodicChecks.length + 1}/3)`}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <div className="space-y-4">
        <div className="mb-4">
          <p>Số lần kiểm tra hiện tại: {form?.periodicChecks.length}</p>
          {form.next_check_date && (
            <>
              <p className="mt-2">
                Đợt kiểm tra tiếp theo: {moment(form.next_check_date).format("DD/MM/YYYY")}
              </p>
              {isCheckNeeded() && (
                <Alert
                  message="Cần kiểm tra ngay!"
                  description="Đã đến hoặc quá thời hạn kiểm tra định kỳ"
                  type="error"
                  showIcon
                  className="mt-2"
                />
              )}
            </>
          )}
        </div>

        <Form
          form={formInstance}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            checkDate: moment(),
            status: "Good",
          }}
        >
          <Form.Item
            name="checkDate"
            label="Ngày kiểm tra"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ngày kiểm tra",
              },
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              className="w-full"
              disabledDate={(current) => current && current > moment().endOf("day")}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái",
              },
            ]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="Good">Tốt</Option>
              <Option value="Needs Attention">Cần chú ý</Option>
              <Option value="Critical">Nghiêm trọng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ghi chú về tình trạng thú cưng",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Ghi chú về tình trạng thú cưng..." />
          </Form.Item>

          {/* Form.Item cho upload file */}
          <Form.Item
            name="image_url"
            label="Hình ảnh kiểm tra"
            valuePropName="fileList" // Liên kết với fileList của Upload
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e.fileList)} // Xử lý giá trị trả về từ Upload
            rules={[
              {
                validator(_, value) {
                  if (!value || value.length === 0) {
                    return Promise.reject(new Error("Vui lòng tải lên hình ảnh kiểm tra"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              beforeUpload={() => false} // Ngăn upload tự động
              onChange={handleImageChange}
              maxCount={1}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpen(false)} disabled={loading}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                danger={isCheckNeeded()}
                disabled={isCheckButtonDisabled()}
              >
                {isCheckNeeded() ? "Kiểm tra ngay!" : "Gửi"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default PeriodicCheckModal;