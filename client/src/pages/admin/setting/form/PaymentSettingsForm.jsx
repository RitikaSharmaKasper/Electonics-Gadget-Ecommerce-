// import React, { useState, useEffect } from "react";
// import { Eye, EyeOff, Plus } from "lucide-react";
// import axiosInstance from "../../../../api/axiosInstance";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const PaymentSettingsForm = () => {
//   const navigate = useNavigate();
//   const [showRazorpayKey, setShowRazorpayKey] = useState(false);
//   const [showStripeKey, setShowStripeKey] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   const [gatewayData, setGatewayData] = useState({
//     keyId: "",
//     keySecret: "",
//   });

//   useEffect(() => {
//     const fetchGateway = async () => {
//       try {
//         setFetchLoading(true);
//         const res = await axiosInstance.get(
//           "/dashboard/paymentConfig/get-payment-gateway",
//         );

//         if (res.data?.success) {
//           const data = res.data.data;
//           setGatewayData({
//             keyId: data.credentials?.keyId || "",
//             keySecret: data.credentials?.keySecret || "",
//           });
//         }
//       } catch (err) {
//         console.error(err);
//         if (err?.response?.status !== 404) {
//           toast.error("Failed to fetch payment gateway data");
//         }
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     fetchGateway();
//   }, []);

//   const handleChange = (field, value) => {
//     setGatewayData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSave = async () => {
//     if (!gatewayData.keyId || !gatewayData.keySecret) {
//       toast.error("Key ID and Secret Key are required");
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axiosInstance.post(
//         "/dashboard/paymentConfig/add-payment-gateway",
//         {
//           provider: "razorpay",
//           keyId: gatewayData.keyId,
//           keySecret: gatewayData.keySecret,
//           webhookSecret: null,
//           extraConfig: {},
//         },
//       );

//       if (response.data?.success) {
//         toast.success(
//           response.data.message || "Payment gateway saved successfully",
//         );
//         // Refresh data after save
//         const res = await axiosInstance.get(
//           "/dashboard/paymentConfig/get-payment-gateway",
//         );
//         if (res.data?.success) {
//           const data = res.data.data;
//           setGatewayData({
//             keyId: data.credentials?.keyId || "",
//             keySecret: data.credentials?.keySecret || "",
//           });
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(
//         err?.response?.data?.message || "Failed to save payment gateway",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate("/admin/settings/payment");
//   };

//   const inputClass =
//     "h-[38px] rounded-[6px] border border-[#D1D5DB] bg-[#F9FAFB] px-3 text-[13px] text-[#222222] outline-none focus:border-[#2563EB]";

//   return (
//     <div className="w-full bg-[#F8FAFC] p-4">
//       {/* Header */}
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h1 className="text-[28px] font-semibold text-[#222222] leading-none">
//             Payments
//           </h1>
//           <p className="text-[13px] text-[#7B7B7B] mt-1">
//             Controls how payments are accepted, settled, and recorded
//           </p>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={handleCancel}
//             className="border border-[#1F3B5B] text-[#1F3B5B] bg-white text-[12px] font-medium px-3 py-1.5 rounded-[4px]"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={loading || fetchLoading}
//             className="bg-[#1F3B5B] text-white text-[12px] font-medium px-3 py-1.5 rounded-[4px] disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </div>

//       {/* Payment Gateway Header */}
//       <div className=" mb-3">
//         <h2 className="text-[16px] font-medium text-[#222222]">
//           Payment Gateway
//         </h2>
//         <p className="text-red-600 text-sm mt-1">
//           *Please enter valid payment gateway credentials to enable payment
//           processing. Do not share your Key ID or Secret Key with anyone to
//           prevent unauthorized access or data breaches.
//         </p>
//       </div>

//       {/* Razorpay Card */}
//       <div className="bg-white rounded-[12px] p-4 mb-3 border border-[#EEF2F6]">
//         <div className="flex items-start justify-between mb-4">
//           <h3 className="text-[18px] font-medium text-[#222222]">Razorpay</h3>

//           <div className="flex items-center gap-2">
//             <span className="flex items-center gap-1.5 bg-[#E7F8EC] text-[#16A34A] text-[12px] font-medium px-2.5 py-1 rounded-[6px]">
//               <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
//               {fetchLoading
//                 ? "Loading..."
//                 : gatewayData.keyId
//                   ? "Connected"
//                   : "Not Configured"}
//             </span>
//           </div>
//         </div>

//         <div className="space-y-3">
//           <div className="flex items-start justify-between gap-4">
//             <div>
//               <h4 className="text-[14px] font-medium text-[#222222]">Key ID</h4>
//             </div>
//             <div className="w-[250px]">
//               <input
//                 type="text"
//                 value={gatewayData.keyId}
//                 onChange={(e) => handleChange("keyId", e.target.value)}
//                 className={`${inputClass} w-full`}
//                 placeholder="Enter Razorpay Key ID"
//               />
//             </div>
//           </div>

//           <div className="flex items-start justify-between gap-4">
//             <div>
//               <h4 className="text-[14px] font-medium text-[#222222]">
//                 Secret Key
//               </h4>
//             </div>

//             <div className="flex items-center gap-2 w-[250px]">
//               <input
//                 type="text"
//                 value={gatewayData.keySecret}
//                 onChange={(e) => handleChange("keySecret", e.target.value)}
//                 className={`${inputClass} w-full`}
//                 placeholder="Enter Razorpay Secret Key"
//               />
//               {/* <button onClick={() => setShowRazorpayKey((prev) => !prev)}>
//                 {showRazorpayKey ? <Eye size={16} /> : <EyeOff size={16} />}
//               </button> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSettingsForm;
