import { Button, Pagination, Select, Modal, Timeline, Tag, Descriptions, Alert } from "antd";
import { useEffect, useState } from "react";
import ViewAdoptionFormModal from "./ViewAdoptionFormModal";
import PeriodicCheckModal from "./PeriodicCheckModal";
import { toast } from "sonner";
import { fetchAllAdoptionFormsAPI } from "@/apis/post";
import { useSelector } from "react-redux";
import moment from "moment";
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, HeartFilled, WarningOutlined } from "@ant-design/icons";

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
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-pink-200">
        <Descriptions
          title={
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold text-amber-800">Chi tiết kiểm tra</span>
              <Tag icon={status?.icon} color={status?.color}>
                {status?.text}
              </Tag>
            </div>
          }
          bordered
          column={1}
          className="w-full border-pink-200"
        >
          <Descriptions.Item label={<span className="text-pink-700">Ngày kiểm tra</span>}>
            {moment(check.checkDate).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="text-pink-700">Người kiểm tra</span>}>
            {check.checkedBy?.username || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label={<span className="text-pink-700">Ghi chú</span>}>
            {check.notes || 'Không có ghi chú'}
          </Descriptions.Item>
        </Descriptions>

        {check.image_url && (
          <div className="mt-4">
            <p className="font-medium mb-2 text-pink-700">Hình ảnh kiểm tra:</p>
            <div className="relative group">
              <img 
                src={check.image_url} 
                alt="Check result" 
                className="w-full max-w-lg rounded-lg cursor-pointer transition-transform hover:scale-105 border border-pink-200"
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
    <div className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border-2 border-pink-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold text-amber-800">
              Quản lý đơn nhận nuôi
            </h1>
          </div>
          <Select
            defaultValue=""
            onChange={handleSortCategory}
            style={{ width: "250px" }}
            className="border-pink-200"
          >
            <Option value="">Không sắp xếp</Option>
            <Option value="createdAt_asc">Ngày tạo (Tăng dần)</Option>
            <Option value="createdAt_desc">Ngày tạo (Giảm dần)</Option>
            <Option value="status_pending">Chỉ hiện Đang chờ</Option>
            <Option value="status_approved">Chỉ hiện Đã duyệt</Option>
            <Option value="status_rejected">Chỉ hiện Đã từ chối</Option>
          </Select>
        </div>

        <div className="bg-pink-50 p-4 mb-6 rounded-lg border border-pink-100">
          <div className="flex items-center gap-2 text-pink-700">
            <ExclamationCircleOutlined />
            <span>
              Tổng số đơn: <strong>{totalResults}</strong> | Trang hiện
              tại: <strong>{currentPage}</strong>
            </span>
          </div>
        </div>

        {forms.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Không có đơn nhận nuôi nào</p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white border border-pink-200 rounded-md pet-friendly-table">
              <thead>
                <tr>
                  {[
                    "#",
                    "Tên người nhận",
                    "Email",
                    "Số điện thoại",
                    "Trạng thái",
                    "Thú cưng",
                    "Ngày tạo",
                    "Hành động",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-pink-700 uppercase border-b border-pink-200 border-r"
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
                    className={index % 2 === 0 ? "bg-pink-50/30" : "bg-white"}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {form.adopter.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {form.adopter.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {form.adopter.phone}
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-pink-100 border-r">
                      <Tag
                        color={
                          form.status === "Pending"
                            ? "yellow"
                            : form.status === "Approved"
                            ? "green"
                            : "red"
                        }
                      >
                        {form.status === "Pending"
                          ? "Đang chờ"
                          : form.status === "Approved"
                          ? "Đã duyệt"
                          : "Đã từ chối"}
                      </Tag>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {form.pet?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      {moment(form.createdAt).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b border-pink-100 border-r">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleViewClick(form)}
                          className="border-pink-500 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white hover:border-pink-600"
                        >
                          Xem
                        </Button>
                        {form.status === "Approved" && (
                          <>
                            {isCheckNeeded(form) ? (
                              <Button
                                onClick={() => handleCheckClick(form)}
                                className="border-red-500 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 animate-pulse shadow-md"
                                icon={<WarningOutlined />}
                              >
                                <span className="font-bold">Cần kiểm tra ngay!</span>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleCheckClick(form)}
                                className="border-amber-500 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white hover:border-amber-600"
                                disabled={form.periodicChecks.length >= 3}
                              >
                                Kiểm tra định kỳ {form.periodicChecks.length >= 3 && "(Đã đủ)"}
                              </Button>
                            )}
                            {form.periodicChecks?.length > 0 && (
                              <Button
                                onClick={() => handleViewResults(form)}
                                className="border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                              >
                                Xem kết quả ({form.periodicChecks.length}/3)
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={totalResults}
            onChange={handlePageChange}
            className="custom-pagination"
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
            <div className="flex items-center gap-2 text-amber-800">
              <HeartFilled style={{ color: "#f472b6" }} />
              <span className="font-semibold">Lịch sử kiểm tra định kỳ</span>
            </div>
          }
          open={viewResultsModalOpen}
          onCancel={() => setViewResultsModalOpen(false)}
          footer={null}
          width={800}
          className="periodic-check-history-modal"
        >
          <div className="p-4 bg-pink-50/50 rounded-lg border border-pink-100 mb-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">Thông tin thú cưng</h3>
            <div className="grid grid-cols-2 gap-2">
              <p><span className="font-medium text-pink-700">Tên:</span> {selectedForm?.pet?.name}</p>
              <p><span className="font-medium text-pink-700">Loài:</span> {selectedForm?.pet?.breed}</p>
              <p><span className="font-medium text-pink-700">Người nhận nuôi:</span> {selectedForm?.adopter?.name}</p>
              <p><span className="font-medium text-pink-700">Ngày nhận nuôi:</span> {selectedForm?.createdAt ? moment(selectedForm.createdAt).format('DD/MM/YYYY') : 'N/A'}</p>
            </div>
            
            {selectedForm?.next_check_date && isCheckNeeded(selectedForm) && (
              <Alert
                message="Cần kiểm tra ngay!"
                description={`Đã đến hoặc quá thời hạn kiểm tra định kỳ (${moment(selectedForm.next_check_date).format('DD/MM/YYYY')})`}
                type="error"
                showIcon
                className="mt-4"
                action={
                  <Button 
                    size="small" 
                    danger 
                    onClick={() => {
                      setViewResultsModalOpen(false);
                      setSelectedForm(selectedForm);
                      setCheckModalOpen(true);
                    }}
                  >
                    Kiểm tra ngay
                  </Button>
                }
              />
            )}
          </div>

          <div className="space-y-6">
            {selectedChecks.length > 0 ? (
              selectedChecks.map((check, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-pink-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-amber-800">
                      Kiểm tra #{index + 1}
                    </h3>
                    <Tag 
                      color={
                        check.status === 'Good' 
                          ? 'success' 
                          : check.status === 'Needs Attention'
                          ? 'warning'
                          : 'error'
                      }
                      icon={
                        check.status === 'Good' 
                          ? <CheckCircleOutlined /> 
                          : check.status === 'Needs Attention'
                          ? <ExclamationCircleOutlined />
                          : <CloseCircleOutlined />
                      }
                    >
                      {check.status === 'Good' 
                        ? 'Tốt' 
                        : check.status === 'Needs Attention'
                        ? 'Cần chú ý'
                        : 'Nghiêm trọng'}
                    </Tag>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2"><span className="font-medium text-pink-700">Ngày kiểm tra:</span> {moment(check.checkDate).format('DD/MM/YYYY')}</p>
                      <p className="mb-2"><span className="font-medium text-pink-700">Người kiểm tra:</span> {check.checkedBy?.username || 'N/A'}</p>
                      <p className="mb-2"><span className="font-medium text-pink-700">Ghi chú:</span> {check.notes}</p>
                    </div>
                    
                    {check.image_url && (
                      <div>
                        <p className="font-medium mb-2 text-pink-700">Hình ảnh:</p>
                        <img 
                          src={check.image_url} 
                          alt="Check result" 
                          className="w-full max-w-xs rounded-lg cursor-pointer hover:opacity-90 border border-pink-200"
                          onClick={() => window.open(check.image_url, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">Chưa có kiểm tra định kỳ nào</p>
            )}
          </div>
        </Modal>
      </div>

      <style jsx global>{`
        .pet-friendly-table .ant-table-thead > tr > th {
          background-color: #fdf3f8;
          border-bottom: 2px solid #fecdd3;
        }

        .ant-table-wrapper .ant-table-pagination.ant-pagination {
          margin: 16px 0;
        }

        .custom-pagination .ant-pagination-item-active {
          background-color: #fdf3f8;
          border-color: #f472b6;
        }

        .ant-pagination-item:hover {
          border-color: #f472b6;
        }
        
        .ant-select-selector {
          border-color: #f9a8d4 !important;
        }
        
        .ant-select:hover .ant-select-selector {
          border-color: #f472b6 !important;
        }
        
        .periodic-check-history-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        
        .periodic-check-history-modal .ant-modal-header {
          background-color: #fdf2f8;
          border-bottom: 1px solid #fbcfe8;
          padding: 16px 24px;
        }
        
        .periodic-check-history-modal .ant-modal-title {
          color: #9d174d;
        }
        
        .periodic-check-history-modal .ant-modal-close {
          color: #be185d;
        }
        
        .periodic-check-history-modal .ant-descriptions-bordered .ant-descriptions-item-label {
          background-color: #fdf2f8;
        }
        
        .periodic-check-history-modal .ant-descriptions-bordered .ant-descriptions-view {
          border-color: #fbcfe8;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default ManageAdoptionForms;