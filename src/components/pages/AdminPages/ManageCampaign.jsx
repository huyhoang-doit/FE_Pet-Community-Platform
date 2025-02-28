import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Upload,
} from "antd";
import Search from "antd/es/input/Search";
import {
  createCampaignAPI,
  deleteCampaignAPI,
  fetchCampaignsAPI,
} from "@/apis/campaign";
import { formatVND } from "@/utils/formatVND";
import { formatDate } from "@/utils/formatDateTime";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const ManageCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [limit] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getAllCampaign = async (page = 1, search = "") => {
    try {
      const { data } = await fetchCampaignsAPI(page, search);
      if (data?.data) {
        setCampaigns(data.data.results);
      }
    } catch (error) {
      setCampaigns([]);
      setTotalResults(0);
    }
  };

  useEffect(() => {
    getAllCampaign(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    console.log(id);

    try {
      const response = await deleteCampaignAPI(id);
      if (response?.status === 200) {
        message.success(`Campaign with ID ${id} has been banned!`);
        getAllCampaign(currentPage);
      } else {
        message.error("Failed to ban the user. Please try again.");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      message.error("An error occurred. Please try again later.");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("startDate", values.startDate.toISOString());
      formData.append("endDate", values.endDate.toISOString());
      formData.append("targetAmount", values.targetAmount);
      formData.append("image", values.image.file.originFileObj);

      const response = await createCampaignAPI(formData);

      if (response.status === 201) {
        message.success("Campaign created successfully!");
        handleModalCancel();
        getAllCampaign(currentPage);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      message.error("Failed to create campaign. Please try again.");
    }
  };

  const columns = [
    {
      title: (
        <div className="flex items-center gap-10">
          Title
          <Search
            placeholder="Search campaign..."
            onSearch={(value) => getAllCampaign(1, value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <img width={200} src={image} />,
    },
    {
      title: "Current Amount",
      dataIndex: "currentAmount",
      key: "currentAmount",
      render: (currentAmount) => formatVND(currentAmount),
    },
    {
      title: "Target Amount",
      dataIndex: "targetAmount",
      key: "targetAmount",
      render: (targetAmount) => formatVND(targetAmount),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => formatDate(startDate),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => formatDate(endDate),
    },
    {
      title: "Status",
      dataIndex: "startDate",
      key: "status",
      render: (_, record) => {
        const today = dayjs();
        const startDate = dayjs(record.startDate);
        const endDate = dayjs(record.endDate);

        let statusText = "";
        let color = "default";

        if (today.isBefore(startDate) && record.isActive) {
          statusText = "Chưa diễn ra";
          color = "blue";
        } else if (today.isAfter(endDate)) {
          statusText = "Đã kết thúc";
          color = "gray";
        } else if (!record.isActive) {
          statusText = "Đã xoá";
          color = "red";
        } else {
          statusText = "Đang diễn ra";
          color = "green";
        }

        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.isActive ? (
          <Popconfirm
            title="Are you sure to stop this campaign?"
            onConfirm={() => handleDelete(record?._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        ) : (
          <Button type="primary" danger disabled>
            Delete
          </Button>
        ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Campaign Management</h1>
        <Button
          type="primary"
          className="mb-4"
          onClick={() => setIsModalVisible(true)}
        >
          Create Campaign
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={campaigns}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: limit,
          total: totalResults,
          onChange: handlePageChange,
        }}
      />
      <Modal
        title="Create New Campaign"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleModalSubmit}>
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please input campaign title!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please input campaign description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="targetAmount"
            label="Target Amount"
            rules={[{ required: true, message: "Please input target amount!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Campaign Image"
            rules={[{ required: true, message: "Please upload an image!" }]}
          >
            <Upload maxCount={1} listType="picture-card">
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Campaign
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCampaign;
