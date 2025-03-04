/* eslint-disable react/prop-types */
import { Modal, Form, Select, Input, Button, DatePicker } from "antd";
import { useState, useEffect } from "react";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const PeriodicCheckModal = ({ open, setOpen, form, onSubmit, currentUser }) => {
  const [formInstance] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      formInstance.resetFields();
      formInstance.setFieldsValue({
        checkDate: moment(),
        status: "Good",
      });
    }
  }, [open, formInstance]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const checkData = {
        adoptionFormId: form._id,
        checkDate: values.checkDate.toISOString(),
        status: values.status,
        notes: values.notes || "",
        checkedBy: currentUser._id, // Assuming currentUser is passed with _id
      };
      await onSubmit(checkData);
      setOpen(false);
    } catch (error) {
      console.error("Error submitting periodic check:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`Kiểm tra định kỳ (${form?.periodicChecks.length + 1}/3)`}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <div className="space-y-4">
        <p>Số lần kiểm tra hiện tại: {form?.periodicChecks.length}</p>
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
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
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

          <Form.Item name="notes" label="Ghi chú">
            <TextArea
              rows={4}
              placeholder="Ghi chú về tình trạng thú cưng..."
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setOpen(false)} disabled={loading}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Gửi
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default PeriodicCheckModal;
