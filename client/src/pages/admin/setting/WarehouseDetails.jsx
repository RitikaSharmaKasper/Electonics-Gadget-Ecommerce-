import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { Link } from "react-router-dom";

function WarehouseDetails() {
  const [warehouseData, setWarehouseData] = useState(null);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const res = await axiosInstance.get(
          "/dashboard/warehouse/get-warehouse",
        );

        console.log("WAREHOUSE RESPONSE:", res.data);

        setWarehouseData(res.data?.warehouse);
      } catch (error) {
        console.log("Warehouse fetch error:", error);
      }
    };

    fetchWarehouse();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-[20px] mb-3">Warehouse Details</h1>
          <span className="text-[#686868] text-[14px]">
            Defines the location from where orders are packed and shipped
          </span>
        </div>
        <div>
          <Link
            to={"/admin/settings/tax-form"}
            className="inline-flex items-center bg-[#126B6D] text-white gap-2 rounded-md border px-5 py-1.5 text-sm"
          >
            Edit
          </Link>
        </div>
      </div>
      <h1 className="font-semibold text-[16px] mb-3 mt-4">Warehouse Details</h1>
      <div className="bg-[#FFFFFF] p-4 rounded-lg space-y-5">
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Warehouse Name</h1>
            <span className="text-[#686868] text-[14px]">
              Internal reference name for this warehouse.
            </span>
          </div>
          <div>{warehouseData?.name || "-"}</div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Phone Number</h1>
            <span className="text-[#686868] text-[14px]">
              Used by courier partners during pickup and delivery.
            </span>
          </div>
          <div>{warehouseData?.phone ? `+91 ${warehouseData.phone}` : "-"}</div>
        </div>
        <div className="flex items-start justify-between  border-b">
          <div>
            <h1>Email Address</h1>
            <span className="text-[#686868] text-[14px]">CIN number</span>
          </div>
          <div>{warehouseData?.email || "-"}</div>
        </div>
      </div>
      <h1 className="font-semibold mt-4">Warehouse Location</h1>
      <div className="bg-[#FFFFFF] p-4 rounded-lg mt-2">
        <div className="border p-3 rounded-lg">
          <p className="font-semibold">
            {warehouseData?.address?.addressLine1},{" "}
            {warehouseData?.address?.Landmark}, {warehouseData?.address?.city},{" "}
            {warehouseData?.address?.state}, {warehouseData?.address?.pinCode},{" "}
            {warehouseData?.address?.country}
          </p>
        </div>
      </div>
    </>
  );
}

export default WarehouseDetails;
