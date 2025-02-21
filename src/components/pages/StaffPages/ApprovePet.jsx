import { getPetNotApprovedAPI, approvePetAPI } from "@/apis/pet";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination, Select } from "antd";

const ApprovePet = () => {
  const [pets, setPets] = useState([]);
  const { Option } = Select;
  const [itemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPets = pets.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPetNotApprovedAPI();
        setPets(response.data.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchData();
  }, []);

  const handleApprove = async (petId) => {
    try {
      await approvePetAPI(petId);
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== petId));
    } catch (error) {
      console.error("Error approving pet:", error);
    }
  };

  const handleSortCategory = (value) => {
    if (value === "asc") {
      setPets((prevPets) =>
        [...prevPets].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      );
    } else if (value === "desc") {
      setPets((prevPets) =>
        [...prevPets].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      );
    }
  };

  console.log(pets);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl mb-4 dark:text-slate-300  transition-colors duration-500 ease-in-out">
          List Pets Need to Approve
        </h1>

        <div className="mb-4 flex justify-between">
          <Select
            defaultValue=""
            onChange={handleSortCategory}
            style={{ width: "200px" }}
          >
            <Option value="">No Sort</Option>
            <Option value="asc">Sort by Category (ASC)</Option>
            <Option value="desc">Sort by Category (DESC)</Option>
          </Select>
        </div>
      </div>

      {pets.length === 0 ? (
        <p className="text-gray-500">No pets waiting for approval.</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Pet Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Create At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPets.map((pet, index) => (
                <tr
                  key={pet._id}
                  className={
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-900"
                      : "bg-white dark:bg-gray-800"
                  }
                >
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {pet.name}
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {pet.breed}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    <img
                      src={pet.image_url[0]}
                      alt={pet.name}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                    {new Date(pet.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => handleApprove(pet._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                    >
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pets.length > itemsPerPage && (
        <div className="mt-4 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={pets.length}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ApprovePet;