import { useState } from "react";
import { MapPin, Truck } from "lucide-react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";

function ProductInfoPincode() {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null); // success | fail
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePincode = (value) => {
    const regex = /^[1-9][0-9]{5}$/;
    return regex.test(value);
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPincode(value);
    setStatus(null);
    setMessage("");

    if (value.length === 0) {
      setError("");
    } else if (!validatePincode(value)) {
      setError("Enter a valid 6-digit PIN code");
    } else {
      setError("");
    }
  };

  const handleCheck = async () => {
    if (!validatePincode(pincode)) {
      setError("Enter a valid 6-digit PIN code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/dashboard/serviceability/check", {
        pincode,
      });

      const isServiceable = res.data.data.isServiceable;

      if (isServiceable) {
        setStatus("success");
        setMessage(`Delivery available to ${pincode}`);

        // ✅ Store in localStorage
        localStorage.setItem(
          "deliveryInfo",
          JSON.stringify({
            pincode,
            isServiceable: true,
          }),
        );
      } else {
        setStatus("fail");
        setMessage("Sorry, we don’t deliver to this location yet");

        // ✅ Store fail also
        localStorage.setItem(
          "deliveryInfo",
          JSON.stringify({
            pincode,
            isServiceable: false,
          }),
        );
      }
    } catch (err) {
      setStatus("fail");
      setMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Input + Button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-md px-3 py-2 w-full bg-white">
          <input
            type="text"
            placeholder="Enter Pin-code"
            value={pincode}
            onChange={handleChange}
            maxLength={6}
            className="flex-1 outline-none text-sm"
          />
          <MapPin size={16} className="text-gray-500" />
        </div>

        <button
          onClick={handleCheck}
          disabled={!validatePincode(pincode) || loading}
          className={`px-5 py-2 rounded-md font-medium text-sm transition flex items-center justify-center ${
            validatePincode(pincode)
              ? "bg-[#1C146B] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Check"
          )}
        </button>
      </div>

      {/* Validation Error */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* ✅ Success / ❌ Fail Message */}
      {status === "success" && (
        <p className="text-green-600 text-sm mt-2">
          Delivery available to {pincode}
        </p>
      )}

      {status === "fail" && (
        <p className="text-red-500 text-sm mt-2">{message}</p>
      )}

      {/* Info */}
      <p className="text-blue-500 text-sm mt-3 flex items-center gap-1">
        <Truck className="w-5 h-5" />
        Free Shipping on orders above Rs. 1,999
      </p>
    </div>
  );
}

export default ProductInfoPincode;
