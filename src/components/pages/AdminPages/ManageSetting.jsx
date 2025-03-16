import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Upload } from "antd";
import Search from "antd/es/input/Search";
import {
  createClientSettingAPI,
  getClientSettingAPI,
  updateClientSettingAPI,
} from "@/apis/clientSetting";
import { PlusOutlined } from "@ant-design/icons";

function ManageSetting() {
  const [settings, setSettings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Replace with actual API call
        const response = await getClientSettingAPI();
        if (response?.status === 200) {
          setSettings(response.data);
        }
      } catch (error) {
        setSettings([]);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (values, isUpdate = false) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "image" && value?.length)
          formData.append("image", value[0].originFileObj);
        else if (value !== undefined) formData.append(key, value);
      });

      const res = isUpdate
        ? await updateClientSettingAPI(values._id, formData)
        : await createClientSettingAPI(formData);
      if (res?.status === (isUpdate ? 200 : 201)) {
        setSettings(
          isUpdate
            ? settings.map((s) => (s._id === values._id ? res.data : s))
            : [...settings, res.data]
        );
        message.success(
          `Setting ${isUpdate ? "updated" : "created"} successfully!`
        );
        isUpdate ? setIsUpdateModalVisible(false) : setIsModalVisible(false);
      }
    } catch {
      message.error(`Failed to ${isUpdate ? "update" : "create"} setting`);
    }
  };

  const renderModal = (
    title,
    visible,
    setVisible,
    formInstance,
    isUpdate = false
  ) => (
    <Modal
      title={title}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <Form
        form={formInstance}
        layout="vertical"
        onFinish={(values) => handleSubmit(values, isUpdate)}
      >
        {isUpdate && (
          <Form.Item name="_id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item name="name" label="Setting Key" rules={[{ required: true }]}>
          <Input disabled={isUpdate} />
        </Form.Item>
        <Form.Item name="value" label="Setting Value">
          <Input />
        </Form.Item>
        <Form.Item
          name="image"
          label="Upload Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <PlusOutlined />
            <div>Upload</div>
          </Upload>
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isUpdate ? "Update" : "Save"} Setting
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const columns = [
    {
      title: (
        <div className="flex items-center gap-10">
          Key
          <Search
            placeholder="Search settings..."
            onSearch={(value) => console.log(value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            className="mr-2"
            onClick={() => {
              updateForm.setFieldsValue({
                ...record,
                image: record.value?.startsWith("https://res.cloudinary")
                  ? [{ url: record.value }]
                  : [],
              });
              setIsUpdateModalVisible(true); // Show modal instead of submitting
            }}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Cài đặt cho Website</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={() => setIsModalVisible(true)}
        >
          Create Setting
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={settings}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: limit,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      {renderModal("Manage Setting", isModalVisible, setIsModalVisible, form)}
      {renderModal(
        "Update Setting",
        isUpdateModalVisible,
        setIsUpdateModalVisible,
        updateForm,
        true
      )}
    </div>
  );
}

export default ManageSetting;
