import { Button, Pagination, Select } from "antd";
import { useEffect, useState } from "react";

import ViewAdoptionFormModal from "./ViewAdoptionFormModal";
import PeriodicCheckModal from "./PeriodicCheckModal";
import { toast } from "sonner";
import { fetchAllAdoptionFormsAPI } from "@/apis/post";
import { useSelector } from "react-redux";

const { Option } = Select;

const ManageAdoptionForms = () => {
  const [forms, setForms] = useState([]);
  const user = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusSort, setStatusSort] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt:desc");
  const [totalResults, setTotalResults] = useState(0);
  const itemsPerPage = 4;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
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
      // const { data } = await addPeriodicCheckAPI(selectedForm._id, checkData);
      // if (data.status === 200) {
      //   toast.success("Periodic check added successfully");
      //   setForms((prevForms) =>
      //     prevForms.map((f) =>
      //       f._id === selectedForm._id
      //         ? { ...f, periodicChecks: data.data.periodicChecks }
      //         : f
      //     )
      //   );
      //   setCheckModalOpen(false);
      // }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error adding periodic check!"
      );
    }
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
                      <Button
                        onClick={() => handleCheckClick(form)}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                        disabled={form.periodicChecks.length >= 3}
                      >
                        Kiểm tra ({form.periodicChecks.length}/3)
                      </Button>
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
    </div>
  );
};

export default ManageAdoptionForms;
