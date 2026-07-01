// import { Eye, EyeOff } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axiosInstance from "../../../api/axiosInstance";
// import { toast } from "react-toastify";

// const Toggle = ({ checked, onChange }) => (
//   <label className="inline-flex items-center cursor-pointer">
//     <input
//       type="checkbox"
//       className="sr-only"
//       checked={checked}
//       onChange={onChange}
//     />
//     <div className="w-10 h-5 bg-gray-200 rounded-full relative transition">
//       <div
//         className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition ${
//           checked ? "translate-x-5 bg-amber-500" : ""
//         }`}
//       />
//     </div>
//   </label>
// );

// function PaymentSettings() {
//   const [form, setForm] = useState({
//     onlinePayments: false,
//     razorpay: false,
//     creditCard: false,
//     emi: false,
//     cod: false,
//   });

//   const [loading, setLoading] = useState(true);
//   const [paymentData, setPaymentData] = useState(null);
//   const [toogleBtn, setToogleBtn] = useState(false);
//   const [toogleBtn2, setToogleBtn2] = useState(false);

//   const update = (k) => setForm((f) => ({ ...f, [k]: !f[k] }));

//   // Fetch payment gateway data
//   const fetchPaymentGateway = async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get(
//         "/dashboard/paymentConfig/get-payment-gateway",
//       );

//       if (response.data?.success) {
//         setPaymentData(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching payment gateway:", error);
//       toast.error(
//         error?.response?.data?.message ||
//           "Failed to fetch payment gateway data",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPaymentGateway();
//   }, []);

//   // Mask key for display
//   const maskKey = (key) => {
//     if (!key) return "********";
//     if (key.length <= 8) return "********";
//     return key.slice(0, 4) + "********" + key.slice(-4);
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-semibold text-[20px] mb-3">Payments</h1>
//           <span className="text-[#686868] text-[14px]">
//             Controls how payments are accepted, settled, and recorded
//           </span>
//         </div>
//         <div>
//           <Link
//             to={"/admin/settings/payment-form"}
//             className="inline-flex items-center bg-[#1C3753] text-white gap-2 rounded-md border px-5 py-1.5 text-sm hover:text-gray-50"
//           >
//             Edit
//           </Link>
//         </div>
//       </div>
//       <h1 className="font-semibold text-[16px] mb-3 mt-4">Payment Gateway</h1>
//       <div className="bg-white p-4 rounded-lg space-y-5">
//         <div className="flex items-start justify-between">
//           {/* Left Section */}
//           <div className="flex flex-col space-y-2">
//             <h1 className="text-[18px] font-semibold">
//               {loading
//                 ? "Loading..."
//                 : paymentData?.provider === "razorpay"
//                   ? "Razorpay"
//                   : paymentData?.provider || "Razorpay"}
//             </h1>

//             <div className="flex flex-col text-[14px] text-[#686868]">
//               <span>Key ID</span>
//               <span>Secret Key</span>
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="flex flex-col space-y-3 items-end">
//             {/* Connected Status */}
//             <div className="px-3 py-1 bg-[#E0F4DE] text-[#00A63E] flex items-center gap-2 rounded-lg text-sm">
//               <span className="text-[18px]">●</span>
//               <span>Connected</span>
//             </div>

//             {/* Key ID */}
//             <div className="flex items-center gap-3">
//               <span className="text-[14px] font-medium">
//                 {loading
//                   ? "Loading..."
//                   : toogleBtn
//                     ? paymentData?.credentials?.keyId || "Not available"
//                     : maskKey(paymentData?.credentials?.keyId) || "********"}
//               </span>

//               <button onClick={() => setToogleBtn((prev) => !prev)}>
//                 {toogleBtn ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>

//             {/* Secret Key */}
//             <div className="flex items-center gap-3">
//               <span className="text-[14px] font-medium">
//                 {loading
//                   ? "Loading..."
//                   : toogleBtn2
//                     ? paymentData?.credentials?.keySecret || "Not available"
//                     : maskKey(paymentData?.credentials?.keySecret) ||
//                       "********"}
//               </span>

//               <button onClick={() => setToogleBtn2((prev) => !prev)}>
//                 {toogleBtn2 ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default PaymentSettings;
