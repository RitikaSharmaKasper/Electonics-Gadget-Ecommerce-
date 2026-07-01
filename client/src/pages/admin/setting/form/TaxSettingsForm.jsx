import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaxSettingsForm = () => {
  const [loading, setLoading] = useState(false);

  // const [warehouseData, setWarehouseData] = useState({
  //   warehouseName: "Main Warehouse",
  //   phoneNumber: "+91 5256826823",
  //   emailAddress: "info.lazercut@example.com",
  //   address: "Shop No.61, Huda market, Sec 46",
  //   pincode: "122002",
  //   landmark: "Near Axis Bank",
  //   city: "Gurugram",
  //   state: "Haryana",
  // });

  const [warehouseData, setWarehouseData] = useState({
    warehouseName: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    pincode: "",
    landmark: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const res = await axiosInstance.get(
          "/dashboard/warehouse/get-warehouse",
        );

        const w = res.data?.warehouse;

        console.log("FULL RESPONSE:", res.data);

        if (w) {
          setWarehouseData({
            warehouseName: w.name || "",
            phoneNumber: w.phone ? `+91 ${w.phone}` : "",
            emailAddress: w.email || "",
            address: w.address?.addressLine1 || "",
            pincode: w.address?.pinCode || "",
            landmark: w.address?.Landmark || "",
            city: w.address?.city || "",
            state: w.address?.state || "",
          });
        }
      } catch (err) {
        console.error("Fetch warehouse error:", err);
      }
    };

    fetchWarehouse();
  }, []);

  const handleSave = async () => {
    // VALIDATIONS
    if (!warehouseData.warehouseName.trim()) {
      return toast.error("Warehouse name is required");
    }

    const cleanPhone = warehouseData.phoneNumber.replace(/\D/g, "").slice(-10);

    if (!cleanPhone) {
      return toast.error("Phone number is required");
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return toast.error("Enter valid 10-digit phone number");
    }

    if (!warehouseData.emailAddress.trim()) {
      return toast.error("Email address is required");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(warehouseData.emailAddress)) {
      return toast.error("Enter valid email address");
    }

    if (!warehouseData.address.trim()) {
      return toast.error("Address is required");
    }

    if (!warehouseData.pincode.trim()) {
      return toast.error("Pincode is required");
    }

    if (!/^\d{6}$/.test(warehouseData.pincode)) {
      return toast.error("Enter valid 6-digit pincode");
    }

    if (!warehouseData.city.trim()) {
      return toast.error("City is required");
    }

    if (!warehouseData.state.trim()) {
      return toast.error("State is required");
    }

    // PAYLOAD
    const payload = {
      name: warehouseData.warehouseName,
      phone: cleanPhone,
      email: warehouseData.emailAddress,
      address: {
        addressLine1: warehouseData.address,
        pinCode: Number(warehouseData.pincode),
        Landmark: warehouseData.landmark,
        city: warehouseData.city,
        state: warehouseData.state,
        country: "India",
      },
    };

    console.log("Payload:", payload);

    try {
      setLoading(true);

      const savePromise = axiosInstance.post("/dashboard/warehouse", payload);

      await toast.promise(savePromise, {
        pending: "Saving warehouse...",
        success: {
          render({ data }) {
            return data?.data?.message || "Warehouse saved successfully";
          },
        },
        error: {
          render({ data }) {
            return data?.response?.data?.message || "Something went wrong";
          },
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const [warehouseData, setWarehouseData] = useState({
  //   warehouseName: "Main Warehouse",
  //   phoneNumber: "+91 5256826823",
  //   emailAddress: "info.lazercut@example.com",
  //   address: "Shop No.61, Huda market, Sec 46",
  //   pincode: "122002",
  //   landmark: "Near Axis Bank",
  //   city: "Gurugram",
  //   state: "Haryana",
  // });

  const handleChange = (field, value) => {
    setWarehouseData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const inputClass =
    "w-full h-[42px] rounded-[6px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 text-[13px] text-[#222222] outline-none focus:border-[#2563EB]";

  const textareaClass =
    "w-full rounded-[6px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 py-3 text-[13px] text-[#222222] outline-none resize-none focus:border-[#2563EB]";

  return (
    <div className="w-full bg-[#F8FAFC] p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#222222] leading-none">
            Warehouse Details
          </h1>
          <p className="text-[13px] text-[#7B7B7B] mt-1">
            Defines the location from where orders are packed and shipped
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={"/admin/settings/taxes"}>
            <button className="border border-[#1F3B5B] text-[#1F3B5B] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Warehouse Details */}
      <div className="mb-4">
        <h2 className="text-[16px] font-medium text-[#222222] mb-3">
          Warehouse Details
        </h2>

        <div className="bg-white rounded-[12px] border border-[#EEF2F6] overflow-hidden">
          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[230px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Warehouse Name
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Internal reference name for this warehouse.
              </p>
            </div>

            <div className="w-full max-w-[300px]">
              <input
                type="text"
                value={warehouseData.warehouseName}
                onChange={(e) => handleChange("warehouseName", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-start justify-between gap-6 px-4 py-4 border-b border-[#E5E7EB]">
            <div className="min-w-[230px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Phone Number
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Used by courier partners during pickup and delivery.
              </p>
            </div>

            <div className="w-full max-w-[300px]">
              <input
                type="number"
                value={warehouseData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-start justify-between gap-6 px-4 py-4">
            <div className="min-w-[230px]">
              <h3 className="text-[14px] font-medium text-[#222222]">
                Email Address
              </h3>
              <p className="text-[11px] text-[#8A8A8A] mt-1">
                Used for shipment-related communication.
              </p>
            </div>

            <div className="w-full max-w-[300px]">
              <input
                type="email"
                value={warehouseData.emailAddress}
                onChange={(e) => handleChange("emailAddress", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Location */}
      <div>
        <h2 className="text-[16px] font-medium text-[#222222] mb-3">
          Warehouse Location
        </h2>

        <div className="bg-white rounded-[12px] border border-[#EEF2F6] p-4">
          <div className="border border-[#E5E7EB] rounded-[10px] overflow-hidden">
            <div className="px-4 py-3">
              {/* <button className="text-[#2563EB] text-[13px] font-medium">
                Edit Address
              </button> */}
            </div>

            <div className="px-4 pb-4">
              <div className="mb-4">
                <label className="block text-[12px] text-[#374151] mb-1">
                  Address (Flat no.,Street, and Area)
                </label>
                <textarea
                  rows={2}
                  value={warehouseData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={textareaClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[12px] text-[#374151] mb-1">
                    Pin-code
                  </label>
                  <input
                    type="text"
                    value={warehouseData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-[#374151] mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={warehouseData.landmark}
                    onChange={(e) => handleChange("landmark", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-[12px] text-[#374151] mb-1">
                    City/District/Town
                  </label>
                  <input
                    type="text"
                    value={warehouseData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-[12px] text-[#374151] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={warehouseData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* <button className="text-[13px] text-[#1F3B5B] font-medium">
                Close
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSettingsForm;
