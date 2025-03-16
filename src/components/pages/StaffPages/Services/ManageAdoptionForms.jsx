import { Button, Pagination, Select, Modal, Timeline, Tag, Descriptions } from "antd";
import { useEffect, useState } from "react";
import ViewAdoptionFormModal from "./ViewAdoptionFormModal";
import PeriodicCheckModal from "./PeriodicCheckModal";
import { toast } from "sonner";
import { fetchAllAdoptionFormsAPI } from "@/apis/post";
import { useSelector } from "react-redux";
import moment from "moment";
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const ManageAdoptionForms = () => {
  const [forms, setForms] = useState([]);
  const {user} = useSelector((store) => store.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusSort, setStatusSort] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 4;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  const fetchForms = async () => {
    try {
      const response = await fetchAllAdoptionFormsAPI(
        currentPage,
        itemsPerPage,
        sortBy,
        statusSort
      );
      const { results, totalResults } = response.data.data;
      setForms(results);
      setTotalResults(totalResults);
    } catch (error) {
      console.error("Error fetching adoption forms:", error);
    }
  };

  useEffect(() => {
    fetchForms();
  }, [currentPage, statusSort, sortBy]);

  const handleSortCategory = (value) => {
    switch (value) {
      case "createdAt_asc":
        setSortBy("createdAt:asc");
        break;
      case "createdAt_desc":
        setSortBy("createdAt:desc");
        break;
      case "status_pending":
        setStatusSort("Pending");
        break;
      case "status_approved":
        setStatusSort("Approved");
        break;
      case "status_rejected":
        setStatusSort("Rejected");
        break;
      default:
        setSortBy("createdAt:desc");
        setStatusSort(null);
        break;
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewClick = (form) => {
    setSelectedForm(form);
    setViewModalOpen(true);
  };

  const handleCheckClick = (form) => {
    setSelectedForm(form);
    setCheckModalOpen(true);
  };

  const handlePeriodicCheck = async (checkData) => {
    try {
      fetchForms()
        setCheckModalOpen(false);
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding periodic check!"
      );
    }
  };

  const handleStatusUpdate = (formId, newStatus) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form._id === formId ? { ...form, status: newStatus } : form
      )
    );
    setViewModalOpen(false);
    fetchForms(); 
  };

  const isCheckNeeded = (form) => {
    if (!form.next_check_date) return false;
    const now = moment();
    const checkDate = moment(form.next_check_date);
    return now.isSameOrAfter(checkDate, 'day');
  };

  const [viewResultsModalOpen, setViewResultsModalOpen] = useState(false);
  const [selectedChecks, setSelectedChecks] = useState([]);

  const handleViewResults = (form) => {
    setSelectedForm(form);
    setSelectedChecks(form.periodicChecks || []);
    setViewResultsModalOpen(true);
  };

  const renderCheckStatus = (check) => {
    const statusConfig = {
      'Good': {
        color: 'success',
        icon: <CheckCircleOutlined />,
        text: 'Tốt'
      },
      'Needs Attention': {
        color: 'warning',
        icon: <ExclamationCircleOutlined />,
        text: 'Cần chú ý'
      },
      'Critical': {
        color: 'error',
        icon: <CloseCircleOutlined />,
        text: 'Nghiêm trọng'
      }
    };

    const status = statusConfig[check.status];

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
        <Descriptions
          title={
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold">Chi tiết kiểm tra</span>
              <Tag icon={status?.icon} color={status?.color}>
                {status?.text}
              </Tag>
            </div>
          }
          bordered
          column={1}
          className="w-full"
        >
          <Descriptions.Item label="Ngày kiểm tra">
            {moment(check.checkDate).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Người kiểm tra">
            {check.checkedBy?.username || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            {check.notes || 'Không có ghi chú'}
          </Descriptions.Item>
        </Descriptions>

        {check.image_url && (
          <div className="mt-4">
            <p className="font-medium mb-2">Hình ảnh kiểm tra:</p>
            <div className="relative group">
              <img 
                src={check.image_url} 
                alt="Check result" 
                className="w-full max-w-lg rounded-lg cursor-pointer transition-transform hover:scale-105"
                onClick={() => window.open(check.image_url, '_blank')}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded-lg flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100">Nhấn để xem ảnh đầy đủ</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl mb-4 dark:text-slate-300">
          Quản lý đơn nhận nuôi
        </h1>
        <Select
          defaultValue=""
          onChange={handleSortCategory}
          style={{ width: "250px" }}
        >
          <Option value="">Không sắp xếp</Option>
          <Option value="createdAt_asc">Ngày tạo (Tăng dần)</Option>
          <Option value="createdAt_desc">Ngày tạo (Giảm dần)</Option>
          <Option value="status_pending">Chỉ hiện Đang chờ</Option>
          <Option value="status_approved">Chỉ hiện Đã duyệt</Option>
          <Option value="status_rejected">Chỉ hiện Đã từ chối</Option>
        </Select>
      </div>

      {forms.length === 0 ? (
        <p className="text-gray-500">Không có đơn nhận nuôi nào</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <thead>
              <tr>
                {[
                  "#",
                  "Adopter Name",
                  "Email",
                  "Phone",
                  "Status",
                  "Pet",
                  "Created At",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forms.map((form, index) => (
                <tr
                  key={form._id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  }
                >
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {form.adopter.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {form.adopter.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {form.adopter.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    <span
                      className={`font-bold ${
                        form.status === "Pending"
                          ? "text-yellow-500"
                          : form.status === "Approved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {form.status === "Pending"
                        ? "Đang chờ"
                        : form.status === "Approved"
                        ? "Đã duyệt"
                        : "Đã từ chối"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {form.pet?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {form.createdAt
                      ? new Date(form.createdAt).toLocaleDateString("vi-VN")
                      : "Không rõ"}
                  </td>
                  <td className="flex gap-2 px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 border-r">
                    {["Pending", "Rejected"].includes(form.status) ? (
                      <Button
                        onClick={() => handleViewClick(form)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      >
                        Xem đơn
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleCheckClick(form)}
                          className={`${
                            isCheckNeeded(form) 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-purple-500 hover:bg-purple-600'
                          } text-white px-4 py-2 rounded-md`}
                          disabled={form.periodicChecks.length >= 3}
                        >
                          {isCheckNeeded(form) ? 'Cần kiểm tra!' : 'Kiểm tra'} ({form.periodicChecks.length}/3)
                        </Button>
                        {form.periodicChecks.length > 0 && (
                          <Button
                            onClick={() => handleViewResults(form)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          >
                            Xem kết quả
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalResults}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {viewModalOpen && (
        <ViewAdoptionFormModal
          open={viewModalOpen}
          setOpen={setViewModalOpen}
          form={selectedForm}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
      {checkModalOpen && (
        <PeriodicCheckModal
          open={checkModalOpen}
          setOpen={setCheckModalOpen}
          form={selectedForm}
          onSubmit={handlePeriodicCheck}
          currentUser={user}
        />
      )}

      <Modal
        title={
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold">Lịch sử kiểm tra định kỳ</span>
              <Tag color="processing">{selectedForm?.pet?.name || 'N/A'}</Tag>
            </div>
          </div>
        }
        open={viewResultsModalOpen}
        onCancel={() => setViewResultsModalOpen(false)}
        footer={null}
        width={800}
        className="periodic-check-modal"
      >
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
          {selectedChecks.length > 0 ? (
            <div className="space-y-6">
              {selectedChecks.map((check, index) => (
                <div key={check._id || index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">Đợt kiểm tra #{index + 1}</h3>
                      <Tag 
                        icon={
                          check.status === 'Good' ? <CheckCircleOutlined /> :
                          check.status === 'Needs Attention' ? <ExclamationCircleOutlined /> :
                          <CloseCircleOutlined />
                        }
                        color={
                          check.status === 'Good' ? 'success' :
                          check.status === 'Needs Attention' ? 'warning' :
                          'error'
                        }
                      >
                        {check.status === 'Good' ? 'Tốt' :
                         check.status === 'Needs Attention' ? 'Cần chú ý' :
                         'Nghiêm trọng'}
                      </Tag>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Descriptions column={1} className="w-full">
                      <Descriptions.Item label={<span className="font-medium">Ngày kiểm tra</span>}>
                        {moment(check.checkDate).format('DD/MM/YYYY HH:mm')}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span className="font-medium">Người kiểm tra</span>}>
                        {check.checkedBy?.username || 'N/A'}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span className="font-medium">Ghi chú</span>}>
                        {check.notes || 'Không có ghi chú'}
                      </Descriptions.Item>
                    </Descriptions>

                    {check.image_url && (
                      <div className="mt-4">
                        <p className="font-medium mb-2">Hình ảnh kiểm tra:</p>
                        <div className="relative group">
                          <img 
                            src={check.image_url} 
                            alt="Check result" 
                            className="w-full max-w-lg rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
                            onClick={() => window.open(check.image_url, '_blank')}
                          />
                          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                              Nhấn để xem ảnh đầy đủ
                            </span>
                          </div> */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có kết quả kiểm tra nào</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ManageAdoptionForms;