import { Input, Modal, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-autoplay.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgRotate from "lightgallery/plugins/rotate";
import lgShare from "lightgallery/plugins/share";
import lgAutoplay from "lightgallery/plugins/autoplay";
import { useFormik } from "formik";
import { deletePetAPI, getPetApprovedAPI } from "@/apis/pet";
import { Button } from "@/components/ui/button";
import EditPetModal from "./EditPetModal";
import CreateAdoptPostModal from "./CreateAdoptPostModal";

const ManagePet = () => {
  const [pets, setPets] = useState([]);
  const { Option } = Select;
  const [itemsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredPets, setFilteredPets] = useState(pets);
  const [editingPet, setEditingPet] = useState(null);

  const [petCreatePost, setPetCreatePost] = useState(null);
  const [openCreatePost, setOpenCreatePost] = useState(false);

  const { Search } = Input;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPetApprovedAPI();
        setPets(response.data.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchData();
  }, [editingPet]);

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
  const handleSearch = (value) => {
    if (!value) {
      setFilteredPets(pets);
      return;
    }

    const newFilteredPets = pets.filter((pet) =>
      pet.breed.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPets(newFilteredPets);
  };

  useEffect(() => {
    setFilteredPets(pets);
  }, [pets]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold text-xl mb-4 dark:text-slate-300">
          Manage Pets In System
        </h1>
        <Search
          placeholder="Search by breed..."
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
          className="ml-4"
        />
        <Select
          defaultValue=""
          onChange={handleSortCategory}
          style={{ width: "200px" }}
        >
          <Option value="">No Sort</Option>
          <Option value="asc">Sort by Date (ASC)</Option>
          <Option value="desc">Sort by Date (DESC)</Option>
        </Select>
      </div>
      {pets.length === 0 ? (
        <p className="text-gray-500">No pets waiting for approval.</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Pet Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Healthy Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Vaccinated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPets
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((pet, index) => (
                  <tr
                    key={pet._id}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 dark:bg-gray-900"
                        : "bg-white dark:bg-gray-800"
                    }
                  >
                    <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {pet.name}
                    </td>
                    <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {pet.breed}
                    </td>
                    <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      <span
                        className={`${
                          pet.health_status === "Healthy"
                            ? "text-green-500 font-bold"
                            : pet.health_status === "Sick"
                            ? "text-red-500 font-bold"
                            : pet.health_status === "Injured"
                            ? "text-orange-500 font-bold"
                            : pet.health_status === "Recovering"
                            ? "text-blue-500 font-bold"
                            : "text-gray-700 dark:text-gray-300 font-bold"
                        }`}
                      >
                        {pet.health_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {pet.vaccinated ? "True" : "False"}
                    </td>

                    <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      <LightGallery
                        speed={500}
                        plugins={[
                          lgThumbnail,
                          lgZoom,
                          lgRotate,
                          lgShare,
                          lgAutoplay,
                        ]}
                      >
                        <a href={pet.image_url[0]}>
                          <img
                            src={pet.image_url[0]}
                            alt="Pet-0"
                            className="h-12 w-12 object-cover rounded-md cursor-pointer mx-1"
                          />
                        </a>
                        {pet.image_url.slice(1).map((image, idx) => (
                          <a
                            href={image}
                            key={idx + 1}
                            style={{ display: "none" }}
                          >
                            <img
                              src={image}
                              alt={`Pet-${idx + 1}`}
                              className="h-12 w-12 object-cover rounded-md cursor-pointer mx-1"
                            />
                          </a>
                        ))}
                      </LightGallery>
                    </td>
                    <td className="px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {new Date(pet.createdAt).toLocaleDateString("vi-VN")}
                      {console.log(
                        "🚀 ~ ManagePet ~ pet.isAddPost:",
                        pet.isAddPost
                      )}
                    </td>
                    <td className="flex gap-4 px-6 py-4 capitalize text-sm text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 border-r">
                      <Button
                        onClick={() => setEditingPet(pet)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Edit
                      </Button>
                      {!pet.isAddPost ? (
                        <Button
                          onClick={() => {
                            setOpenCreatePost(true);
                            setPetCreatePost(pet);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                          Create post
                        </Button>
                      ) : null}
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
          total={pets.length}
          onChange={setCurrentPage}
        />
      </div>
      {editingPet && (
        <EditPetModal
          visible={!!editingPet}
          pet={editingPet}
          onClose={() => setEditingPet(null)}
          onUpdate={() =>
            setPets((prev) =>
              prev.map((p) =>
                p._id === editingPet._id ? { ...p, ...editingPet } : p
              )
            )
          }
        />
      )}
      <CreateAdoptPostModal
        open={openCreatePost}
        setOpen={setOpenCreatePost}
        pet={petCreatePost}
      />
    </div>
  );
};

export default ManagePet;
