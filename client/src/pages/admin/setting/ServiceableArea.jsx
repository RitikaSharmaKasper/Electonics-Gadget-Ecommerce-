import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Edit2,
  NotepadTextDashed,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import axiosInstance from "../../../api/axiosInstance";
import { toast } from "react-toastify";
import { RiFileExcel2Line } from "react-icons/ri";
// import templateFile from "../../../../public/templates/serviceability_bulk_import_dummy.xlsx";

const ServiceableArea = () => {
  const [type, setType] = useState("pin-code");
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const handleEditOpen = (item) => {
    setEditData({ ...item });
    setEditModal(true);
  };
  const isValid =
    type === "pin-code" ? /^\d{6}$/.test(value) : /^\d{2,4}$/.test(value);

  const handleAdd = async () => {
    if (!isValid) {
      toast.error(
        type === "pin-code"
          ? "Please enter valid 6-digit pin-code"
          : "Please enter valid prefix",
      );
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post(
        "/dashboard/serviceability/create-serviceability",
        {
          type: type === "pin-code" ? "exact" : "prefix",
          value,
          isServiceable: true,
        },
      );

      toast.success(
        type === "pin-code"
          ? "Pin-code added successfully"
          : "Prefix added successfully",
      );

      setValue("");
      setPage(1);

      // getServiceability();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to add serviceability",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAreas = useMemo(() => {
    let result = [...areas];

    if (search.trim()) {
      result = result.filter((item) =>
        item.code.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (statusFilter !== "Status") {
      result = result.filter((item) => item.status === statusFilter);
    }

    return result;
  }, [areas, search, statusFilter]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/dashboard/serviceability/delete/${id}`);

      toast.success("Serviceability deleted successfully");

      setAreas((prev) => prev.filter((item) => item.id !== id));

      // optional refresh
      await getServiceability();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete serviceability",
      );
    }
  };

  // const toggleStatus = (id) => {
  //   setAreas((prev) =>
  //     prev.map((item) =>
  //       item.id === id
  //         ? {
  //             ...item,
  //             status: item.status === "Active" ? "Inactive" : "Active",
  //           }
  //         : item,
  //     ),
  //   );
  // };

  const handleUpdate = async () => {
    try {
      const activeValue = editData.status === "Active";

      await axiosInstance.patch(`/dashboard/serviceability/${editData.id}`, {
        type: editData.type === "Pin-code" ? "exact" : "prefix",
        value: editData.code,

        // send both because backend may use either one
        isActive: activeValue,
        isServiceable: activeValue,
      });

      toast.success("Serviceability updated successfully");

      setEditModal(false);
      setEditData(null);

      await getServiceability();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update serviceability",
      );
    }
  };

  // const getServiceability = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await axiosInstance.get("/dashboard/serviceability", {
  //       params: {
  //         page,
  //         limit,
  //       },
  //     });

  //     const list = res?.data?.data || [];

  //     // console.log(list);

  //     const formatted = list.map((item) => ({
  //       id: item._id,
  //       type: item.type === "prefix" ? "Prefix" : "Pin-code",
  //       code: item.value || "",
  //       status:
  //         item.isServiceable === false || item.isActive === false
  //           ? "Inactive"
  //           : "Active",
  //     }));

  //     setAreas(formatted);
  //     setTotalItems(res?.data?.pagination?.total || formatted.length);
  //     setTotalPages(res?.data?.pagination?.pages || 1);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to fetch data");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getServiceability = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/dashboard/serviceability", {
        params: {
          page,
          limit,
        },
      });

      const list = res?.data?.data || [];

      const formatted = list.map((item) => ({
        id: item._id,
        type: item.type === "prefix" ? "Prefix" : "Pin-code",
        code: item.value || "",
        status:
          item.isServiceable === false || item.isActive === false
            ? "Inactive"
            : "Active",
      }));

      setAreas(formatted);

      setTotalItems(res?.data?.pagination?.total || 0);

      // FIX
      setTotalPages(res?.data?.pagination?.totalPages || 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServiceability();
  }, [page]);

  // bulk import function
  const uploadBulk = async (e) => {
    try {
      const file = e.target.files[0];

      const form = new FormData();

      form.append("file", file);

      await axiosInstance.post(
        "/dashboard/serviceability/bulk-create-serviceability",
        form,
      );

      toast.success("Imported");

      getServiceability();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/templates/serviceability_bulk_import_dummy.xlsx";
    link.download = "serviceability_bulk_import_dummy.xlsx";
    link.click();
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F8F9]">
      <div className="mb-7">
        <h1 className="text-[20px] font-semibold text-[#1C1C1C]">
          Serviceable Area
        </h1>
        <p className="text-[#686868] text-[14px]">
          Controls which pin-codes you want your orders to delivered
        </p>
      </div>

      <div className="bg-white border border-[#DADADA] rounded-2xl p-5 mb-7">
        <h2 className="text-[18px] font-semibold text-[#1C1C1C] mb-6">
          Add Pin-Code/Prefix
        </h2>

        <div className="flex items-center gap-8 mb-4">
          <label className="flex items-center gap-3 text-[#1800AC] text-[14px] font-medium cursor-pointer">
            <input
              type="radio"
              checked={type === "pin-code"}
              onChange={() => {
                setType("pin-code");
                setValue("");
              }}
              className="w-4 h-4 accent-[#1800AC]"
            />
            Pin-Code
          </label>

          <label className="flex items-center gap-3 text-[#1800AC] text-[14px] font-medium cursor-pointer">
            <input
              type="radio"
              checked={type === "prefix"}
              onChange={() => {
                setType("prefix");
                setValue("");
              }}
              className="w-4 h-4 accent-[#1800AC]"
            />
            Prefix
          </label>
        </div>

        <input
          type="text"
          value={value}
          maxLength={type === "pin-code" ? 6 : 4}
          onChange={(e) => setValue(e.target.value.replace(/\D/g, ""))}
          placeholder={
            type === "pin-code"
              ? "Enter 6-digit pin-code (e.g., 560034)"
              : "Enter 3-digit prefix (e.g., 560)"
          }
          className="w-full h-[45px] bg-[#F8FBFC] border border-[#DADADA] rounded-lg px-4 text-[14px] outline-none focus:border-[#1800AC]"
        />

        <p className="text-[#686868] text-[14px] mt-2">
          {type === "pin-code"
            ? "*Add specific delivery areas pin-code"
            : "*Applies delivery rules to all pin-codes starting with this prefix."}
        </p>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleAdd}
            disabled={!isValid}
            className={`flex items-center gap-2 px-5 py-2 rounded-md text-white text-[15px] font-medium ${
              isValid
                ? "bg-[#1C3753] hover:bg-[#10263b]"
                : "bg-[#D9D9D9] cursor-not-allowed"
            }`}
          >
            <Plus size={18} />
            {type === "pin-code" ? "Add Pin-code" : "Add Prefix"}
          </button>

          {/* bulk import btn  */}
          <input
            type="file"
            accept=".xlsx"
            hidden
            id="bulk"
            onChange={uploadBulk}
          />

          <label
            htmlFor="bulk"
            className="
px-5
py-2
bg-[#1800AC]
text-white
rounded
cursor-pointer
flex items-center gap-2
"
          >
            Bulk Import
            <RiFileExcel2Line size={20} />
          </label>

          {/* downlode dummy excel file */}
          <button
            onClick={handleDownload}
            className="
px-5
py-2
border
border-[#1800AC]
bg-[#1800AC]
text-white
rounded-md
flex items-center gap-2
"
          >
            Download Template
            <NotepadTextDashed size={20} />
          </button>
        </div>
      </div>

      <h2 className="text-[16px] font-semibold mb-4">Pin-codes</h2>

      <div className="bg-white rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="relative w-[220px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#686868]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Pin-code"
              className="w-full h-[38px] border border-[#DADADA] rounded-md pl-9 pr-3 text-sm outline-none"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setStatusOpen((prev) => !prev)}
              className="w-[120px] h-[38px] border border-[#DADADA] rounded-md bg-white px-3 flex items-center justify-between text-sm"
            >
              {statusFilter}
              <ChevronDown size={16} />
            </button>

            {statusOpen && (
              <div className="absolute right-0 mt-2 w-[150px] bg-white border border-[#DADADA] rounded-lg shadow-md z-20 overflow-hidden">
                {["Status", "Active", "Inactive"].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setStatusFilter(item);
                      setStatusOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
          <table className="w-full text-sm text-center">
            <thead className="bg-[#F1F5F9]">
              <tr>
                <th className="py-4 px-4 font-medium">Type</th>
                <th className="py-4 px-4 font-medium">Pin-code</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAreas.map((item) => (
                <tr key={item.id} className="border-t border-[#E5E7EB]">
                  <td className="py-4 px-4">{item.type}</td>
                  <td className="py-4 px-4">{item.code}</td>
                  <td className="py-4 px-4">
                    <button
                      // onClick={() => toggleStatus(item.id)}
                      className={`min-w-[80px] px-3 py-1 rounded-md text-xs font-medium ${
                        item.status === "Active"
                          ? "bg-[#DFF4DD] text-[#00A63E]"
                          : "bg-[#FFE3E3] text-[#E53935]"
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-5">
                      <button
                        onClick={() => handleEditOpen(item)}
                        className="text-[#1C1C1C]"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAreas.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-[#686868]">
                    No pin-codes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-xs text-[#686868]">
          <span>
            Showing {areas.length ? (page - 1) * limit + 1 : 0}-
            {Math.min(page * limit, totalItems)} of {totalItems} results
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8 rounded-md bg-[#1800AC] text-white disabled:opacity-50"
            >
              ‹
            </button>

            <span className="px-3 py-2 rounded-md border border-[#E5E7EB]">
              Page {String(page).padStart(2, "0")} of{" "}
              {String(totalPages).padStart(2, "0")}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="w-8 h-8 rounded-md bg-[#1800AC] text-white disabled:opacity-50"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {editModal && editData && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-[520px] rounded-2xl p-6">
            <h2 className="text-[20px] font-semibold mb-6">
              Edit {editData.type}
            </h2>

            <p className="text-[16px] mb-3">{editData.type} Status</p>

            <div className="flex items-center gap-10 mb-6">
              {["Active", "Inactive"].map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-3 text-[#1800AC] text-[16px] cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={editData.status === status}
                    onChange={() =>
                      setEditData((prev) => ({
                        ...prev,
                        status,
                      }))
                    }
                    className="w-5 h-5 accent-[#1800AC]"
                  />
                  {status}
                </label>
              ))}
            </div>

            <label className="block text-[16px] mb-2">{editData.type}</label>

            <input
              type="text"
              value={editData.code}
              maxLength={editData.type === "Pin-code" ? 6 : 3}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  code: e.target.value.replace(/\D/g, ""),
                }))
              }
              className="w-full h-[52px] bg-[#F8FBFC] border border-[#DADADA] rounded-lg px-4 text-[16px] outline-none focus:border-[#1800AC]"
            />

            <div className="flex justify-end gap-5 mt-8">
              <button
                onClick={() => {
                  setEditModal(false);
                  setEditData(null);
                }}
                className="w-[150px] h-[48px] border border-[#1800AC] text-[#1800AC] rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="w-[180px] h-[48px] bg-[#1800AC] text-white rounded-lg"
              >
                Update {editData.type}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceableArea;
