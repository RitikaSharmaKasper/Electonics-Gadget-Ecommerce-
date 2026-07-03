import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

const GeneralSettings = () => {
  const [shippingConfig, setShippingConfig] = useState({});

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
    }
  };

  useEffect(() => {
    fetchShippingDetails();
  }, []);

  const shippingData = [
    {
      title: "Within City (ZONE A)",
      des: "Applies when warehouse and delivery are in the same city",
      amount: shippingConfig?.charges?.withinCity || 0,
    },
    {
      title: "Within State (ZONE B)",
      des: "Applies when the delivery is in the same state but different cities",
      amount: shippingConfig?.charges?.withinState || 0,
    },
    {
      title: "Metro to Metro (ZONE C)",
      des: "Applies when the delivery cities are metro cities",
      amount: shippingConfig?.charges?.metroToMetro || 0,
    },
    {
      title: "Rest of India (ZONE D)",
      des: "Applies to all other delivery locations not covered",
      amount: shippingConfig?.charges?.restOfIndia || 0,
    },
    {
      title: "Special Region (ZONE E)",
      des: "Applies to North-East states, Jammu & Kashmir and special regions",
      amount: shippingConfig?.charges?.specialRegion || 0,
    },
  ];

  return (
    <div className="w-full bg-[#F4F6F8] p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-[30px] font-semibold text-[#222222] leading-none">
            Shipping
          </h1>
          <p className="text-[14px] text-[#7A7A7A] mt-1">
            Controls how orders are shipped and delivered
          </p>
        </div>

        <Link to={"/admin/settings/notification-form"}>
          {" "}
          <button className="bg-[#126B6D] text-white text-[13px] font-medium px-4 py-2 rounded-[6px]">
            Edit
          </button>
        </Link>
      </div>

      {/* Section Title */}
      <h2 className="text-[18px] font-medium text-[#222222] mb-3">
        Shipping Charges
      </h2>

      <div className="mt-4 rounded-lg p-4 bg-white ">
        <div className="flex flex-col">
          <span className="text-[16px] text-[#1C1C1C] font-regular">
            Zone Based
          </span>
          <span className="text-[12px] text-[#686868] font-regular">
            Different zone range for calculating shipping cost.
          </span>
        </div>
        {shippingData.map((item) => (
          <div
            key={item.title}
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
            <div>
              <span className="font-medium text-[#1C1C1C] text-[18px]">
                ₹ {item.amount}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* <==================-------------- Zone Configration -----------------=================> */}
      <div className="mt-5">
        <span className="text-[16px] text-[#1C1C1C] text-medium">
          Zone Configuration
        </span>
        <div className="bg-white p-4 rounded-lg mt-3">
          <span className="text-[16px] text-[#1C1C1C] text-medium">
            Metro Cities
          </span>

          <div className="mt-4 flex flex-wrap gap-2">
            {shippingConfig?.metroCities?.map((item) => (
              <span key={item} className="rounded-full bg-[#F0EEFF] px-4 py-2">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <span className="text-[16px] text-[#1C1C1C] text-medium">
              Special Regions
            </span>
            <div className="mt-4 flex flex-wrap gap-2">
              {shippingConfig?.specialStates?.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[#F0EEFF] px-4 py-2"
                >
                  {item}
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
                {shippingConfig?.freeDeliveryAbove || 0}
              </span>
            </div>
            <div>
              <span className="text-[#1C1C1C] text-[18px] font-medium">
                ₹{shippingConfig?.freeDeliveryAbove || 0}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 px-2">
            <div className="flex flex-col">
              <span className="text-[#1C1C1C] text-[16px] font-regular">
                Platform Fee
              </span>
              <span className="text-[#686868] text-[12px] font-regular">
                A samll Fee Charged by the Platform
              </span>
            </div>
            <div>
              <span className="text-[#1C1C1C] text-[18px] font-medium">
                ₹ {shippingConfig?.platformFee || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
