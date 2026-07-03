import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineAdd } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../../../api/axiosInstance";
import { toast } from "react-toastify";

const NotificationSettingsForm = () => {
  const [shippingConfig, setShippingConfig] = useState({});
  const [addZones, setAddZones] = useState(false);
  const [addSpecialZones, setAddSpecialZones] = useState(false);
  const [newMetroCity, setNewMetroCity] = useState("");
  const [newSpecialRegion, setNewSpecialRegion] = useState("");
  const [loading, setLoading] = useState(false);

  const nagivate = useNavigate();

  const [formData, setFormData] = useState({
    charges: {
      withinCity: 0,
      withinState: 0,
      metroToMetro: 0,
      restOfIndia: 0,
      specialRegion: 0,
    },
    metroCities: [],
    specialStates: [],
    freeDeliveryAbove: 0,
    platformFee: 0,
    additionalCharges: 0,
  });

  const handleChargeChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      charges: {
        ...prev.charges,
        [key]: Number(value),
      },
    }));
  };

  const removeMetroCity = (city) => {
    setFormData((prev) => ({
      ...prev,
      metroCities: prev.metroCities.filter((c) => c !== city),
    }));
  };

  const removeSpecialRegion = (region) => {
    setFormData((prev) => ({
      ...prev,
      specialStates: prev.specialStates.filter((r) => r !== region),
    }));
  };

  const inputClass =
    "w-full h-[42px] rounded-[6px] border border-[#D1D5DB] px-3 text-[13px] text-[#222222] outline-none focus:border-[#2563EB] bg-white";

  // fetch shipping details
  const fetchShippingDetails = async () => {
    try {
      const res = await axiosInstance.get(
        "/dashboard/shipping/get-shipping-config-admin",
      );

      if (res?.data?.success === true) {
        setShippingConfig(res?.data?.data);
      }
    } catch (err) {
      console.error("Error fetching shipping config:", err);
      toast.error("Failed to fetch shipping config");
    }
  };

  useEffect(() => {
    fetchShippingDetails();
  }, []);

  useEffect(() => {
    if (shippingConfig) {
      setFormData({
        charges: shippingConfig.charges || {
          withinCity: 0,
          withinState: 0,
          metroToMetro: 0,
          restOfIndia: 0,
          specialRegion: 0,
        },
        metroCities: shippingConfig.metroCities || [],
        specialStates: shippingConfig.specialStates || [],
        freeDeliveryAbove: shippingConfig.freeDeliveryAbove || 0,
        platformFee: shippingConfig.platformFee || 0,
        additionalCharges: shippingConfig.additionalCharges || 0,
      });
    }
  }, [shippingConfig]);

  const editShipingData = [
    {
      key: "withinCity",
      title: "Within City (ZONE A)",
      des: "Applies when warehouse and delivery are in the same city",
      amount: formData?.charges?.withinCity || 0,
    },
    {
      key: "withinState",
      title: "Within State (ZONE B)",
      des: "Applies when the delivery is in the same state but different cities",
      amount: formData?.charges?.withinState || 0,
    },
    {
      key: "metroToMetro",
      title: "Metro to Metro (ZONE C)",
      des: "Applies when the delivery cities are metro cities",
      amount: formData?.charges?.metroToMetro || 0,
    },
    {
      key: "restOfIndia",
      title: "Rest of India (ZONE D)",
      des: "Applies to all other delivery locations not covered",
      amount: formData?.charges?.restOfIndia || 0,
    },
    {
      key: "specialRegion",
      title: "Special Region (ZONE E)",
      des: "Applies to North-East states, Jammu & Kashmir and special regions",
      amount: formData?.charges?.specialRegion || 0,
    },
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/dashboard/shipping/config", {
        charges: formData.charges,
        metroCities: formData.metroCities,
        specialStates: formData.specialStates,
        freeDeliveryAbove: formData.freeDeliveryAbove,
        platformFee: formData.platformFee,
        additionalCharges: formData.additionalCharges,
        isActive: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Saved successfully");
        fetchShippingDetails(); // Refresh data
        nagivate("/admin/settings/notification");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMetroCity = async () => {
    if (!newMetroCity.trim()) {
      toast.error("Please enter city name");
      return;
    }

    const updatedCities = [...formData.metroCities, newMetroCity.trim()];
    setFormData((prev) => ({
      ...prev,
      metroCities: updatedCities,
    }));
    setNewMetroCity("");
    setAddZones(false);

    // Auto-save after adding
    try {
      const res = await axiosInstance.post("/dashboard/shipping/config", {
        charges: formData.charges,
        metroCities: updatedCities,
        specialStates: formData.specialStates,
        freeDeliveryAbove: formData.freeDeliveryAbove,
        platformFee: formData.platformFee,
        additionalCharges: formData.additionalCharges,
        isActive: true,
      });
      if (res.data.success) {
        toast.success("Metro city added successfully");
        fetchShippingDetails();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add city");
    }
  };

  const handleAddSpecialRegion = async () => {
    if (!newSpecialRegion.trim()) {
      toast.error("Please enter region name");
      return;
    }

    const updatedRegions = [...formData.specialStates, newSpecialRegion.trim()];
    setFormData((prev) => ({
      ...prev,
      specialStates: updatedRegions,
    }));
    setNewSpecialRegion("");
    setAddSpecialZones(false);

    // Auto-save after adding
    try {
      const res = await axiosInstance.post("/dashboard/shipping/config", {
        charges: formData.charges,
        metroCities: formData.metroCities,
        specialStates: updatedRegions,
        freeDeliveryAbove: formData.freeDeliveryAbove,
        platformFee: formData.platformFee,
        additionalCharges: formData.additionalCharges,
        isActive: true,
      });
      if (res.data.success) {
        toast.success("Special region added successfully");
        fetchShippingDetails();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add region");
    }
  };

  const handleRemoveMetroCity = async (city) => {
    const updatedCities = formData.metroCities.filter((c) => c !== city);
    setFormData((prev) => ({
      ...prev,
      metroCities: updatedCities,
    }));

    // Auto-save after removal
    try {
      const res = await axiosInstance.post("/dashboard/shipping/config", {
        charges: formData.charges,
        metroCities: updatedCities,
        specialStates: formData.specialStates,
        freeDeliveryAbove: formData.freeDeliveryAbove,
        platformFee: formData.platformFee,
        additionalCharges: formData.additionalCharges,
        isActive: true,
      });
      if (res.data.success) {
        toast.success("City removed successfully");
        fetchShippingDetails();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove city");
    }
  };

  const handleRemoveSpecialRegion = async (region) => {
    const updatedRegions = formData.specialStates.filter((r) => r !== region);
    setFormData((prev) => ({
      ...prev,
      specialStates: updatedRegions,
    }));

    // Auto-save after removal
    try {
      const res = await axiosInstance.post("/dashboard/shipping/config", {
        charges: formData.charges,
        metroCities: formData.metroCities,
        specialStates: updatedRegions,
        freeDeliveryAbove: formData.freeDeliveryAbove,
        platformFee: formData.platformFee,
        additionalCharges: formData.additionalCharges,
        isActive: true,
      });
      if (res.data.success) {
        toast.success("Region removed successfully");
        fetchShippingDetails();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove region");
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#222222] leading-none">
            Shipping
          </h1>
          <p className="text-[13px] text-[#7B7B7B] mt-1">
            Controls how orders are shipped and delivered
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to={"/admin/settings/notification"}>
            <button className="border border-[#126B6D] text-[#126B6D] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]">
              Cancel
            </button>
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#126B6D] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <span className="text-[#1C1C1C] text-[16px] font-medium mb-4">
          Shipping Charges
        </span>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <div className="mt-4 rounded-lg p-2 bg-white">
          <div className="flex flex-col">
            <span className="text-[16px] text-[#1C1C1C] font-regular">
              Zone Based
            </span>
            <span className="text-[12px] text-[#686868] font-regular">
              Different zone range for calculating shipping cost.
            </span>
          </div>
          {editShipingData.map((item) => (
            <div
              key={item.key}
              className="flex justify-between items-center mt-3 border-b border-[#DEDEDE] px-2 py-2"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[#1C1C1C] text-[16px] font-regular">
                  {item.title}
                </span>
                <span className="text-[12px] text-[#686868] font-regular">
                  {item.des}
                </span>
              </div>
              <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
                <span className="text-[#1C1C1C] text-[16px] font-regular">
                  ₹
                </span>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleChargeChange(item.key, e.target.value)}
                  className="bg-transparent outline-none text-[#1C1C1C] text-[16px] font-regular w-24"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone Configuration */}
      <div className="mt-5">
        <span className="text-[#1C1C1C] text-[16px] font-medium">
          Zone Configuration
        </span>
        <div className="bg-white p-4 rounded-lg mt-3">
          <div className="flex justify-between items-center">
            <span className="text-[16px] text-[#1C1C1C] text-medium">
              Metro Cities
            </span>
            <button
              className="flex items-center px-4 py-2 bg-[#126B6D] text-white rounded-lg"
              onClick={() => setAddZones(true)}
            >
              <MdOutlineAdd size={20} />
              Add Metro Zones
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {formData?.metroCities?.map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#F0EEFF] px-4 py-2 flex items-center gap-2"
              >
                {item}{" "}
                <button
                  onClick={() => handleRemoveMetroCity(item)}
                  className="text-gray-900"
                >
                  <RxCross2 />
                </button>
              </span>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-[#1C1C1C] text-medium">
                Special Regions
              </span>
              <button
                className="flex items-center px-4 py-2 bg-[#126B6D] text-white rounded-lg"
                onClick={() => setAddSpecialZones(true)}
              >
                <MdOutlineAdd size={20} />
                Add Special Zones
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {formData?.specialStates?.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#F0EEFF] px-4 py-2 flex items-center gap-2"
                >
                  {item}{" "}
                  <button
                    onClick={() => handleRemoveSpecialRegion(item)}
                    className="text-gray-900"
                  >
                    <RxCross2 />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <span className="text-[16px] text-[#1C1C1C] text-medium">
            Other Details
          </span>
        </div>
        <div className="bg-white p-4 rounded-lg mt-3">
          <div className="flex justify-between items-center border-b border-[#DEDEDE] py-3 px-2">
            <div className="flex flex-col">
              <span className="text-[#1C1C1C] text-[16px] font-regular">
                Free Delivery Above
              </span>
              <span className="text-[#686868] text-[12px] font-regular">
                If the total cart value is above ₹
                {formData?.freeDeliveryAbove || 0}
              </span>
            </div>
            <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
              <input
                type="number"
                className="bg-[#F8FBFC] outline-none w-24"
                value={formData?.freeDeliveryAbove || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    freeDeliveryAbove: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-between items-center py-3 px-2">
            <div className="flex flex-col">
              <span className="text-[#1C1C1C] text-[16px] font-regular">
                Platform Fee
              </span>
              <span className="text-[#686868] text-[12px] font-regular">
                A small Fee Charged by the Platform
              </span>
            </div>
            <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
              <span className="text-[#1C1C1C] text-[16px] font-regular">₹</span>
              <input
                type="number"
                className="bg-[#F8FBFC] outline-none w-24"
                value={formData?.platformFee || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    platformFee: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Metro City Modal */}
      {addZones && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
          onClick={() => setAddZones(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg relative p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-8 items-center">
              <div>
                <span className="text-[#1C1C1C] font-normal text-[18px]">
                  Add New Metro City
                </span>
              </div>
            </div>
            <div className="flex flex-col mt-3 gap-1">
              <span className="text-[#1C1C1C] text-[14px]">City Name</span>
              <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter city Name"
                  value={newMetroCity}
                  onChange={(e) => setNewMetroCity(e.target.value)}
                  className="outline-none border-none bg-[#F8FBFC] px-2 py-1 rounded text-[#1C1C1C] text-[16px] w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 items-center mt-3">
              <button
                className="border border-[#126B6D] text-[#126B6D] bg-white text-[12px] font-medium px-2.5 py-2 rounded-[4px]"
                onClick={() => {
                  setAddZones(false);
                  setNewMetroCity("");
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMetroCity}
                className="bg-[#126B6D] text-white text-[12px] font-medium px-2.5 py-2 rounded-[4px]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Special Region Modal */}
      {addSpecialZones && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
          onClick={() => setAddSpecialZones(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg relative p-4 sm:p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-8 items-center">
              <div>
                <span className="text-[#1C1C1C] font-normal text-[18px]">
                  Add Special Region
                </span>
              </div>
            </div>
            <div className="flex flex-col mt-3 gap-1">
              <span className="text-[#1C1C1C] text-[14px]">
                Special Region Name
              </span>
              <div className="p-2 bg-[#F8FBFC] border border-[#DEDEDE] rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter Region Name"
                  value={newSpecialRegion}
                  onChange={(e) => setNewSpecialRegion(e.target.value)}
                  className="outline-none border-none bg-[#F8FBFC] px-2 py-1 rounded text-[#1C1C1C] text-[16px] w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 items-center mt-3">
              <button
                className="border border-[#126B6D] text-[#126B6D] bg-white text-[12px] font-medium px-2.5 py-2 rounded-[4px]"
                onClick={() => {
                  setAddSpecialZones(false);
                  setNewSpecialRegion("");
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSpecialRegion}
                className="bg-[#126B6D] text-white text-[12px] font-medium px-2.5 py-2 rounded-[4px]"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettingsForm;
