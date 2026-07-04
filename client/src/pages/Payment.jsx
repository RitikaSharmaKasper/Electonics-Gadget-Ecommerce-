import React, { useEffect, useState } from "react";
import PriceDetails from "../components/PriceDetails";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import paytm from "../assets/paytm.svg";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EmptyState from "../components/EmptyState";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { placeOrder } from "../redux/cart/orderSlice";
import { clearCart, resetBuyNow } from "../redux/cart/cartSlice";
import {
  Banknote,
  ChevronLeft,
  PackageCheck,
  Truck,
  Loader2,
  QrCode,
} from "lucide-react";
import QRCode from "qrcode";
// rezorpay
// import Razorpay from "../assets/IconsUsed/Razorpay.png";
// import { loadRazorpay } from "../hooks/loadRazorpay";

function Payment() {
  const {
    cartItems = [],
    totalPrice,
    totalItems,
    totalDiscount,
    buyNowMode,
  } = useSelector((s) => s.cart || {});

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [selected, setSelected] = useState("Razorpay");
  const [showStripe, setShowStripe] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  // qr code state
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [selected, setSelected] = useState("UPI");
  // qrcode generation
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const companyData = {
    companyName: "Divinex",
    upiId: "sango17-1@oksbi",
  };

  // add by aman dhiman
  const isBuyNowMode = location.state?.mode === "buy-now";
  const buyNowItem = location.state?.buyNowItem;

  const buyNowItems = buyNowItem ? [buyNowItem] : [];

  // const searchParams = new URLSearchParams(location.search);
  // const isBuyNowMode = searchParams.get("type") === "buy-now";

  // const buyNowItem = isBuyNowMode
  //   ? JSON.parse(localStorage.getItem("buyNowItem") || "null")
  //   : null;

  // const buyNowItems = buyNowItem ? [buyNowItem] : [];

  const reduxSelectedAddress = useSelector((s) => s.address.selectedAddress);

  const selectedAddress =
    location.state?.selectedAddress || reduxSelectedAddress;

  const [checkoutSummary, setCheckoutSummary] = useState(null);

  const roundedAmount = Math.round(checkoutSummary?.total || 0);

  useEffect(() => {
    if (companyData?.upiId && roundedAmount > 0) {
      const upiString = `upi://pay?pa=${companyData.upiId}&pn=${encodeURIComponent(
        companyData.companyName,
      )}&am=${roundedAmount}&cu=INR`;

      QRCode.toDataURL(upiString)
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.log(err));
    }
  }, [roundedAmount]);

  // reword points and config from api
  // loding api data
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [appliedPoints, setAppliedPoints] = useState(0);

  const [availablePoints, setAvailablePoints] = useState(0);
  const [purchasePoints, setPurchasePoints] = useState(0);

  const [Points, setPoints] = useState(0);

  const [redeamPoints, setRedeamPoints] = useState(0);
  const [rewardConfig, setRewardConfig] = useState(null);

  const [paymentCartItems, setPaymentCartItems] = useState([]);
  const [paymentCartLoading, setPaymentCartLoading] = useState(true);

  const [DiscountCoupon, setDiscountCoupon] = useState([]);
  const [DiscountCouponeLoading, setDiscountCouponeLoading] = useState(false);

  // coupon apply and add āpi

  const [couponCodeSet, setCouponCodeSet] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");

  // in this louder in api data comming in coupon in next data
  const [couponPage, setCouponPage] = useState(1);
  const [couponHasMore, setCouponHasMore] = useState(true);
  const [couponLoading, setCouponLoading] = useState(false);

  const fetchPaymentCart = async () => {
    try {
      setPaymentCartLoading(true);

      const res = await axiosInstance.get("/cart");
      const cartData = res.data?.data;

      setPaymentCartItems(cartData?.items || []);
    } catch (error) {
      console.error("Payment cart fetch error:", error);
      setPaymentCartItems([]);
    } finally {
      setPaymentCartLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchPaymentCart();
  // }, []);

  useEffect(() => {
    if (isBuyNowMode) {
      setPaymentCartLoading(false);
      return;
    }

    fetchPaymentCart();
  }, [isBuyNowMode]);

  // const finalCartItems = isBuyNowMode
  //   ? buyNowItems
  //   : cartItems && cartItems.length > 0
  //     ? cartItems
  //     : paymentCartItems;

  const finalCartItems = isBuyNowMode ? buyNowItems : paymentCartItems;

  // summery api call to get the latest pricing details based on selected address and applied points. This is called on initial load and also whenever user applies reward points to get updated summary with discounts and taxes.

  const fetchCheckoutSummary = async (points = 0, code = couponCodeSet) => {
    try {
      if (!selectedAddress) return;

      setSummaryLoading(true);

      const payload = {
        mode: isBuyNowMode ? "buy-now" : "cart",
        shippingAddress: selectedAddress,
        appliedPoints: points,
        couponCode: code,
      };

      if (isBuyNowMode && buyNowItem) {
        payload.buyNowItem = buyNowItem;
      }

      const res = await axiosInstance.post("/order/checkout-summary", payload);

      setCheckoutSummary(res.data?.data || null);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to load summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  console.log(checkoutSummary)

  // useEffect(() => {
  //   if (!isBuyNowMode && selectedAddress) {
  //     fetchCheckoutSummary(appliedPoints);
  //   }
  // }, [selectedAddress, isBuyNowMode]);

  useEffect(() => {
    if (selectedAddress) {
      fetchCheckoutSummary(appliedPoints);
    }
  }, [selectedAddress, appliedPoints]);

  // console.log(checkoutSummary);

  // points
  const fetchAvailablePoints = async () => {
    try {
      const res = await axiosInstance.get("/order/available-points");
      // console.log(res.data)

      setAvailablePoints(res.data?.data?.availablePoints || 0);
      setPoints(res.data?.data?.reward?.pointValue || 0);

      setPurchasePoints(res.data?.data?.reward?.earn?.minOrderValue || null);
      setRewardConfig(res.data?.data?.reward?.earn?.minOrderValue || null);
      setRedeamPoints(res.data?.data?.reward?.minOrderValueForRedeem || null);
    } catch (error) {
      console.error("Points fetch error:", error);
    }
  };

  // useEffect(() => {
  //   if (!isBuyNowMode) {
  //     fetchAvailablePoints();
  //   }
  // }, [isBuyNowMode]);

  useEffect(() => {
    fetchAvailablePoints();
  }, []);

  const handleApplyPoints = async (points) => {
    setAppliedPoints(points);

    await fetchCheckoutSummary(points);
  };

  function generateOrderId() {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `#ORD-${datePart}-${randomPart}`;
  }

  const handlePayment = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address first");
      return null;
    }

    if (paymentCartLoading) {
      toast.error("No items found in cart to place order");
      return null;
    }

    const orderId = generateOrderId();
    const orderDate = new Date().toISOString();
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const items = finalCartItems.map((item) => ({
      productId: item.id || item.uuid,
      name: item.title || "Untitled Product",
      quantity: item.quantity || 1,
      price: item.basePrice ?? item.price ?? 0,
      img: item.image || "/default.jpg",
    }));

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const userId = "USR-1001"; // TODO: fetch from user slice

    return {
      orderId,
      userId,
      orderDate,
      items,
      totalAmount: total,
      paymentMethod: selected,
      paymentStatus: selected === "cod" ? "Pending" : "Paid",
      deliveryAddress: selectedAddress,
      deliveryDate: deliveryDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      orderStatus: "Processing",
      trackingId: `TRK${Math.random().toString().slice(2, 12)}IN`,
    };
  };

  useEffect(() => {
    if (selected === "card") {
      axios
        .post("http://localhost:5000/create-payment-intent", {
          amount: Math.round(totalPrice),
        })
        .then((res) => setClientSecret(res.data.clientSecret))
        .catch((err) => console.log(err));
    }
  }, [selected, totalPrice]);

  const processOrder = (orderDetails) => {
    dispatch(placeOrder(orderDetails));
    dispatch(clearCart());

    if (buyNowMode) dispatch(resetBuyNow());

    toast.success("Order placed successfully!");
    navigate("/confirm-order", { state: orderDetails });
  };

  // Payment Verification Modal Component
  const PaymentVerificationModal = () => {
    if (!isVerifyingPayment) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl min-w-[300px]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#1800AC]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <PackageCheck className="w-6 h-6 text-[#1800AC] animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-[#7A1F2B] font-stack-sans">
            Verifying Payment
          </h3>
          <p className="text-gray-600 text-center">
            Please wait while we verify your payment...
          </p>
          <div className="flex gap-1 mt-2">
            <div
              className="w-2 h-2 bg-[#7A1F2B] rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#7A1F2B] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#7A1F2B] rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // test mode
  // const handleRazorpayPayment = async (orderDetails) => {
  //   try {
  //     const isLoaded = await loadRazorpay();

  //     if (!isLoaded) {
  //       toast.error("Razorpay SDK failed to load");
  //       return;
  //     }

  //     // const orderPayload = isBuyNowMode
  //     //   ? {
  //     //       paymentMethod: "razorpay",
  //     //       shippingAddress: selectedAddress,
  //     //       appliedPoints: 0,
  //     //       buyNow: true,
  //     //       items: buyNowItems.map((item) => ({
  //     //         productId: item.productId,
  //     //         variantId: item.variantId,
  //     //         quantity: item.quantity || 1,
  //     //       })),
  //     //     }
  //     //   : {
  //     //       paymentMethod: "razorpay",
  //     //       shippingAddress: selectedAddress,
  //     //       appliedPoints: appliedPoints || 0,
  //     //     };

  //     const orderPayload = {
  //       paymentMethod: "razorpay",

  //       shippingAddress: selectedAddress,

  //       appliedPoints: appliedPoints || 0,

  //       mode: isBuyNowMode ? "buy-now" : "cart",
  //     };

  //     if (isBuyNowMode && buyNowItem) {
  //       orderPayload.buyNowItem = buyNowItem;
  //     }

  //     const { data } = await axiosInstance.post("/order", orderPayload);

  //     const razorpayOrder = data?.data?.razorpay;

  //     if (!razorpayOrder?.rzOrderId) {
  //       toast.error("Failed to create Razorpay order");
  //       return;
  //     }

  //     const options = {
  //       key: razorpayOrder.key,
  //       amount: razorpayOrder.amount,
  //       currency: razorpayOrder.currency,
  //       name: "Divinex",
  //       description: "Order Payment",
  //       order_id: razorpayOrder.rzOrderId,
  //       handler: async function (response) {
  //         // Start showing verification modal
  //         setIsVerifyingPayment(true);

  //         try {
  //           const verifyRes = await axiosInstance.post(
  //             "/order/verify-payment",
  //             {
  //               razorpayOrderId: response.razorpay_order_id,
  //               razorpayPaymentId: response.razorpay_payment_id,
  //               razorpaySignature: response.razorpay_signature,
  //             },
  //           );

  //           if (verifyRes.data.success) {
  //             const confirmedOrder = verifyRes.data.data;
  //             toast.success("Payment verified successfully!");

  //             // Close verification modal after short delay
  //             setTimeout(() => {
  //               setIsVerifyingPayment(false);
  //               processOrder({
  //                 ...confirmedOrder,
  //                 backendOrderId: data?.data?.orderId,
  //                 paymentStatus: "Paid",
  //                 razorpay_order_id: response.razorpay_order_id,
  //                 razorpay_payment_id: response.razorpay_payment_id,
  //               });
  //             }, 1000);
  //           } else {
  //             setIsVerifyingPayment(false);
  //             toast.error("Payment verification failed");
  //           }
  //         } catch (error) {
  //           setIsVerifyingPayment(false);
  //           console.error(error);
  //           toast.error(
  //             error?.response?.data?.message || "Payment verification failed",
  //           );
  //         }
  //       },
  //       prefill: {
  //         name: selectedAddress?.fullName || "",
  //         email: selectedAddress?.email || "",
  //         contact: selectedAddress?.phone || "",
  //       },
  //       theme: {
  //         color: "#1C3753",
  //       },
  //       modal: {
  //         ondismiss: function () {
  //           toast.info("Payment cancelled");
  //         },
  //       },
  //     };

  //     const razor = new window.Razorpay(options);

  //     razor.on("payment.failed", async function (response) {
  //       try {
  //         await axiosInstance.post("/order/payment-failed", {
  //           razorpayPaymentId: response.error?.metadata?.payment_id || null,
  //           razorpayOrderId: response.error?.metadata?.order_id,
  //           error: response.error,
  //         });

  //         toast.error(
  //           response.error?.description || "Payment failed. Please retry.",
  //         );
  //       } catch (err) {
  //         console.error("Payment failed API error:", err);
  //         toast.error("Payment failed, but could not update server.");
  //       }
  //     });
  //     razor.open();
  //   } catch (error) {
  //     console.error("Razorpay payment error:", error);
  //     toast.error(
  //       error?.response?.data?.message || "Unable to start Razorpay payment",
  //     );
  //   }
  // };

  // old
  // const handlePlaceOrder = async () => {
  //   const orderDetails = handlePayment();
  //   if (!orderDetails) return;

  //   await handleRazorpayPayment(orderDetails);
  // };

  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.error("Please select a delivery address first");
        return;
      }

      if (!paymentScreenshot) {
        toast.error("Please upload payment screenshot");
        return;
      }

      setPlacingOrder(true);

      const shippingAddress = {
        fullName: selectedAddress.fullName,
        email: selectedAddress.email,
        phone: selectedAddress.phone,
        address: selectedAddress.address,
        country: selectedAddress.country,
        state: selectedAddress.state,
        city: selectedAddress.city,
        pinCode: selectedAddress.pinCode,
      };

      const formData = new FormData();

      // formData.append("paymentMethod", "upi_qr");
      formData.append("shippingAddress", JSON.stringify(shippingAddress));
      if (appliedCoupon) {
        formData.append("couponCode", appliedCoupon);
      }
      formData.append("appliedPoints", appliedPoints || 0);
      formData.append("mode", isBuyNowMode ? "buy-now" : "cart");
      formData.append("payment-proof", paymentScreenshot);

      if (isBuyNowMode && buyNowItem) {
        formData.append("buyNowItem", JSON.stringify(buyNowItem));
      }

      const { data } = await axiosInstance.post(
        "/order/upload-payment-proof",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      dispatch(clearCart());
      if (buyNowMode) dispatch(resetBuyNow());

      toast.success("Order placed. Payment confirmation pending.");

      navigate("/confirm-order", {
        state: {
          ...data?.data,
          paymentMethod: "UPI QR",
          paymentStatus: "Pending",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // discount coupon

  const handleDiscountCoupon = async (pageNumber = 1) => {
    try {
      setCouponLoading(true);
      // setDiscountCouponeLoading(true);
      const res = await axiosInstance.get(
        `/dashboard/coupon?page=${pageNumber}&limit=10`,
      );
      const newCoupons = res.data?.data || [];
      setDiscountCoupon((prev) => {
        const oldCoupons = prev?.data || [];

        return {
          ...res.data,
          data: pageNumber === 1 ? newCoupons : [...oldCoupons, ...newCoupons],
        };
      });

      setCouponHasMore(pageNumber < res.data?.pagination?.totalPages);
    } catch (error) {
      console.log(`DiscountError:${error}`);
    } finally {
      setCouponLoading(false);
    }
  };

  useEffect(() => {
    handleDiscountCoupon(1);
  }, []);

  // console.log(DiscountCoupon);

  // coupon apply api in fetchCheckoutSummary

  const handleApplyCoupon = async (code) => {
    if (!code?.trim()) {
      toast.error("Please enter or selected coupon code");
      return;
    }
    try {
      const finalCode = code.trim().toUpperCase();
      await fetchCheckoutSummary(appliedPoints, finalCode);
      // setCouponCodeSet(finalCode);

      setAppliedCoupon(finalCode);
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };

  // remove the coupon api data in fetch the data
  const handleRemoveCoupon = async () => {
    setAppliedCoupon("");
    setCouponCodeSet("");
    await fetchCheckoutSummary(appliedPoints, "");
  };

  if (paymentCartLoading) {
    return (
      <>
        <Navbar />
        <EmptyState
          heading="No Items for Checkout"
          description="Looks like your cart is empty. Add items to your cart to proceed to
            checkout."
          icon={Truck}
          ctaLabel="Continue Shopping"
          ctaLink="/products"
        />

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PaymentVerificationModal />
      <section className="lg:px-20 md:px-[60px] px-0 lg:py-4 bg-gray-50 mt-24">
        <div className="flex flex-col lg:flex-row justify-between md:gap-6">
          <div className="p-4 md:p-6 md:shadow-sm bg-white md:rounded-md w-full lg:w-2/3">
            <div className="text-lg sm:text-xl flex gap-2 items-center font-light text-[#7A1F2B] font-stack-sans mb-2">
              <Link to={isBuyNowMode ? "/home" : "/bag"}>
                <ChevronLeft className="w-8 h-8" />
              </Link>
              <span className="text-[#7A1F2B] font-stack-sans">
                Payment Options
              </span>
            </div>

            {selectedAddress ? (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="font-medium text-[#7A1F2B] font-stack-sans">
                  {selectedAddress.fullName}{" "}
                  {selectedAddress.addressType && (
                    <span className="bg-blue-100 text-[#7A1F2B] text-xs px-2 py-0.5 rounded-md border-[#52151d] border">
                      {selectedAddress.addressType}
                    </span>
                  )}
                </p>
                <p className="text-gray-600 text-sm">{selectedAddress.email}</p>
                <p className="text-gray-600">
                  {selectedAddress.address},{selectedAddress.country},{" "}
                  {selectedAddress.street}, {selectedAddress.city},{" "}
                  {selectedAddress.state} - {selectedAddress.pinCode}
                </p>
                <button
                  onClick={() =>
                    navigate("/checkout/delivery", {
                      state: isBuyNowMode
                        ? {
                            mode: "buy-now",
                            buyNowItem,
                          }
                        : {},
                    })
                  }
                  className="mt-3 text-sm text-[#006EE1] hover:underline font-stack-sans"
                >
                  Change Address
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                <p>No delivery address selected.</p>
                <button
                  onClick={() =>
                    navigate(
                      isBuyNowMode
                        ? "/checkout/delivery?type=buy-now"
                        : "/checkout/delivery",
                    )
                  }
                  className="mt-2 px-4 py-2 bg-[#7A1F2B]text-white rounded-md text-sm"
                >
                  Add Address
                </button>
              </div>
            )}

            <div className="w-full bg-white rounded-lg flex flex-col gap-4 mt-6">
              {[
                // {
                //   key: "Razorpay",
                //   label: "Razorpay",
                //   icon: Razorpay,
                //   type: "image",
                // },
                {
                  key: "UPI",
                  label: "UPI QR Payment",
                  icon: QrCode,
                  type: "icon",
                },
              ].map((option) => {
                const Icon = option.icon;

                return (
                  <div
                    key={option.key}
                    onClick={() => setSelected(option.key)}
                    className={`p-4 flex gap-4 items-center border-2 rounded-lg cursor-pointer transition-colors ${
                      selected === option.key
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-gray-200 hover:border-blue-500/70 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                        selected === option.key
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${
                          selected === option.key
                            ? "bg-blue-500"
                            : "bg-transparent"
                        }`}
                      />
                    </span>

                    <span className="flex items-center justify-center w-6 h-6">
                      {option.type === "image" ? (
                        <img
                          src={option.icon}
                          alt={option.label}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <Icon className="w-6 h-6 text-gray-700" />
                      )}
                    </span>

                    <p className="text-gray-700">{option.label}</p>
                  </div>
                );
              })}
            </div>

            {selected === "UPI" && qrCodeUrl && (
              <div className="mt-6 border rounded-xl p-6 flex flex-col items-center bg-white">
                <h2 className="text-lg font-semibold mb-4 text-[#1800AC]">
                  Scan & Pay via UPI
                </h2>

                <img
                  src={qrCodeUrl}
                  alt="UPI QR"
                  className="w-64 h-64 object-contain border rounded-lg p-2"
                />

                <p className="mt-4 text-sm text-gray-600">
                  UPI ID:
                  <span className="font-medium text-black ml-1">
                    {companyData.upiId}
                  </span>
                </p>

                <p className="text-xl font-semibold mt-2">₹ {roundedAmount}</p>

                <div className="mt-6 w-full flex flex-col items-center gap-4">
                  <label className="w-full max-w-sm border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#1800AC]">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                    />

                    <span className="text-sm text-gray-600">
                      {paymentScreenshot
                        ? paymentScreenshot.name
                        : "Upload payment screenshot"}
                    </span>
                  </label>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={!paymentScreenshot || placingOrder}
                    className={`mt-2 px-6 py-3 rounded-lg font-medium text-white ${
                      !paymentScreenshot || placingOrder
                        ? "bg-gray-400 cursor-not-allowed"
                        : "  bg-[#7A1F2B] hover:bg-[#0f0075]"
                    }`}
                  >
                    {placingOrder
                      ? "Placing Order..."
                      : "Submit Payment Screenshot"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <PriceDetails
            totalItems={
              checkoutSummary?.totalItems ||
              finalCartItems?.length ||
              totalItems
            }
            sellingPrice={checkoutSummary?.mrpTotal || 0}
            totalPrice={checkoutSummary?.total || 0}
            totalDiscount={checkoutSummary?.totalDiscount || 0}
            totalGST={checkoutSummary?.totalGST || 0}
            product={finalCartItems}
            step="payment"
            handlePlaceOrder={handlePlaceOrder}
            buyNowMode={isBuyNowMode}
            deliveryCharge={checkoutSummary?.shippingCharge || 0}
            PlatformFee={checkoutSummary?.platformFee || 0}
            // points
            availablePoints={availablePoints}
            purchasePoints={purchasePoints}
            Points={Points}
            redeamPoint={redeamPoints}
            rewardConfig={rewardConfig}
            onApplyPoints={handleApplyPoints}
            appliedPoints={checkoutSummary?.discount || 0}
            // coupon
            couponCodeSet={couponCodeSet}
            setCouponCodeSet={setCouponCodeSet}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            couponDiscount={checkoutSummary?.couponDiscount || 0}
            // pagination loader in next data coupon
            DiscountCoupon={DiscountCoupon}
            loadMoreCoupons={() => {
              if (!couponLoading && couponHasMore) {
                const nextPage = couponPage + 1;
                setCouponPage(nextPage);
                handleDiscountCoupon(nextPage);
              }
            }}
            couponLoading={couponLoading}
            couponHasMore={couponHasMore}
            // upi set
            showPlaceOrder={selected === "UPI"}
            selected={selected}
            isVerifyingPayment={isVerifyingPayment}
            // cart
            cart={checkoutSummary}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Payment;
