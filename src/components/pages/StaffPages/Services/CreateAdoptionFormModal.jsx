/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, PawPrint } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllUsersAPI } from "@/apis/user";
import { addAdoptionForm } from "@/apis/post";

const CreateAdoptionFormModal = ({ open, setOpen, post, onSubmit }) => {
  const [adopterName, setAdopterName] = useState("");
  const [adopterEmail, setAdopterEmail] = useState("");
  const [adopterPhone, setAdopterPhone] = useState("");
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (open) {
      fetchProvinces();
      setSelectedUser(null);
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [open]);

  const fetchProvinces = async () => {
    try {
      setLoadingAddress(true);
      const response = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await response.json();
      setProvinces(data);
    } catch (error) {
      toast.error("Không thể tải danh sách tỉnh/thành phố");
    } finally {
      setLoadingAddress(false);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      setLoadingAddress(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceId}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts);
      setDistrictCode("");
      setWards([]);
      setWardCode("");
    } catch (error) {
      toast.error("Không thể tải danh sách quận/huyện");
    } finally {
      setLoadingAddress(false);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      setLoadingAddress(true);
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtId}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards);
      setWardCode("");
    } catch (error) {
      toast.error("Không thể tải danh sách phường/xã");
    } finally {
      setLoadingAddress(false);
    }
  };

  const debouncedSearchUsers = useCallback(
    debounce(async (query) => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await getAllUsersAPI(1, 5, query);
        setSearchResults(response.data.data.results);
      } catch (error) {
        toast.error("Không thể tìm kiếm người dùng");
      }
    }, 500),
    []
  );

  const handleSearchUsers = (query) => {
    debouncedSearchUsers(query);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setAdopterName(user.username);
    setAdopterEmail(user.email);
    setAdopterPhone(user.phoneNumber || "");
    setAddress(user.address || "");
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Vui lòng chọn một người dùng trước khi gửi form");
      return;
    }

    // Map codes to names
    const provinceName =
      provinces.find((p) => p.code.toString() === provinceCode)?.name || "";
    const districtName =
      districts.find((d) => d.code.toString() === districtCode)?.name || "";
    const wardName =
      wards.find((w) => w.code.toString() === wardCode)?.name || "";

    if (!provinceName || !districtName || !wardName) {
      toast.error(
        "Vui lòng chọn đầy đủ tỉnh/thành phố, quận/huyện và phường/xã"
      );
      return;
    }

    const formData = {
      adoptionPost: post._id,
      pet: post.pet._id || post.pet, // Handle both cases where pet might be an object or ID
      user: selectedUser.id,
      adopter: {
        name: adopterName,
        email: adopterEmail,
        phone: adopterPhone,
        address: {
          province: provinceName, // Save name instead of code
          district: districtName, // Save name instead of code
          ward: wardName, // Save name instead of code
          detail: address,
        },
      },
      message,
    };

    try {
      setLoading(true);
      const { data } = await addAdoptionForm(formData);
      if (data.status === 201) {
        toast.success(data.message || "Form đã được gửi thành công!");
        setOpen(false);
        // Reset form
        setAdopterName("");
        setAdopterEmail("");
        setAdopterPhone("");
        setMessage("");
        setAddress("");
        setProvinceCode("");
        setDistrictCode("");
        setWardCode("");
        setSelectedUser(null);
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="text-center flex items-center justify-center gap-2 sticky top-0 bg-white z-10 pb-4">
          <PawPrint className="w-8 h-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Tạo form gửi người nhận nuôi
            </h2>
            <p className="text-sm text-gray-500">Bài đăng: {post.caption}</p>
          </div>
        </DialogHeader>

        {/* Pet Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Thông tin thú cưng
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Tên thú cưng:</span>{" "}
              {post.pet?.name || "Không rõ"}
            </p>
            <p>
              <span className="font-semibold">Loài:</span>{" "}
              {post.pet?.species || post.pet?.breed || "Không rõ"}
            </p>
            <p>
              <span className="font-semibold">Tuổi:</span>{" "}
              {post.pet?.age || "Không rõ"}
            </p>
            <p>
              <span className="font-semibold">Giới tính:</span>{" "}
              {post.pet?.gender || "Không rõ"}
            </p>
          </div>
          {post.image?.length > 0 && (
            <img
              src={post.image[0]}
              alt={post.pet?.name || "Pet"}
              className="mt-2 w-24 h-24 object-cover rounded-md"
            />
          )}
        </div>

        {/* User Search */}
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-1">
            Tìm kiếm người dùng
          </Label>
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearchUsers(e.target.value);
            }}
            placeholder="Nhập tên tài khoản tiếp nhận"
            className="w-full border-gray-200 bg-gray-50 text-gray-800"
          />
          {searchResults?.length > 0 && (
            <ul className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {user.username} ({user.email})
                </li>
              ))}
            </ul>
          )}
          {selectedUser && (
            <p className="mt-2 text-sm text-gray-600">
              Đã chọn:{" "}
              <span className="font-semibold">{selectedUser.username}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="adopterName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên người nhận nuôi
            </Label>
            <Input
              id="adopterName"
              value={adopterName}
              onChange={(e) => setAdopterName(e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-gray-800"
              placeholder="Nhập tên người nhận nuôi"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="adopterEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </Label>
            <Input
              id="adopterEmail"
              type="email"
              value={adopterEmail}
              onChange={(e) => setAdopterEmail(e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-gray-800"
              placeholder="Nhập email"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="adopterPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại
            </Label>
            <Input
              id="adopterPhone"
              type="tel"
              value={adopterPhone}
              onChange={(e) => setAdopterPhone(e.target.value)}
              className="w-full border-gray-200 bg-gray-50 text-gray-800"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>
          <div className="space-y-4">
            <Label className="block text-sm font-medium text-gray-700">
              Địa chỉ
            </Label>
            <div>
              <Select
                value={provinceCode}
                onValueChange={(value) => {
                  setProvinceCode(value);
                  fetchDistricts(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((prov) => (
                    <SelectItem key={prov.code} value={prov.code.toString()}>
                      {prov.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={districtCode}
                onValueChange={(value) => {
                  setDistrictCode(value);
                  fetchWards(value);
                }}
                disabled={!provinceCode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((dist) => (
                    <SelectItem key={dist.code} value={dist.code.toString()}>
                      {dist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={wardCode}
                onValueChange={setWardCode}
                disabled={!districtCode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((w) => (
                    <SelectItem key={w.code} value={w.code.toString()}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border-gray-200 bg-gray-50 text-gray-800"
                placeholder="Số nhà, tên đường"
                required
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tin nhắn
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px] resize-none border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400"
              placeholder="Nhập tin nhắn hoặc điều khoản nhận nuôi"
            />
          </div>
          <div className="flex justify-end gap-3 sticky bottom-0 bg-white pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || loadingAddress}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md py-2 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi form"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdoptionFormModal;
