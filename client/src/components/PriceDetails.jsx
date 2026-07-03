import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Info,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { IoCloseCircleOutline } from "react-icons/io5";
import React, { useState } from "react";
import { formatPrice } from "../utils/homePageUtils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function PriceDetails({
  totalItems,
  totalPrice,
  totalDiscount,
  product,
  hasOutOfStock,
  sellingPrice,
  totalGST,
  step = "cart",
  canProceed = true,
  handlePlaceOrder,
  buyNowMode,
  goToPayment,
  deliveryCharge = 60,
  deliveryLimit = 2000,
  PlatformFee,
  // points
  purchasePoints,
  Points,
  redeamPoint,
  availablePoints,

  rewardConfig,
  onApplyPoints,
  appliedPoints,
  // coupon
  // DiscountCoupon,
  couponCodeSet,
  setCouponCodeSet,
  onApplyCoupon,
  onRemoveCoupon,
  couponDiscount,
  appliedCoupon,
  // coupon data upcoming
  DiscountCoupon,
  loadMoreCoupons,
  couponLoading,
  couponHasMore,
  selected,
  // cart
  cart,
}) {
  const [showPrice, setShowPrice] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const safeTotalPrice = Number(sellingPrice) || 0;
  const safeTotalDiscount = Number(totalDiscount) || 0;
  const safePlatformFee = Number(PlatformFee) || 0;

  const finalAmount = safeTotalPrice - safeTotalDiscount;

  const isFreeDelivery = Number(deliveryCharge) === 0;

  const [showCoupon, setShowCoupon] = useState(false);

  const isBuyNow =
    new URLSearchParams(window.location.search).get("type") === "buy-now";

  // ////////////////demo

  const [showCouponList, setShowCouponList] = useState(false);
  // const [couponCode, setCouponCode] = useState("");
  const availableCoupons = DiscountCoupon?.data || [];

  // console.log(availableCoupons);

  const activeCoupons = availableCoupons.filter(
    (coupon) => coupon.isEligible === true,
  );

  const otherCoupons = availableCoupons.filter(
    (coupon) => coupon.isEligible === false,
  );

  return (
    <div className="w-full lg:w-1/3">
      <div className="bg-white md:rounded-lg shadow-sm p-4 md:p-6 sticky top-20 font-inter">
        <>
          <div className="flex justify-between items-center ">
            <h2 className="text-base md:text-lg lg:text-xl font-playpen-sans text-[#126B6D]">
              Cart Items
               {/* ({cart?.totalQuantity || 0}) */}
            </h2> 
            <button
              onClick={() => setShowCart(!showCart)}
              className="p-2 rounded-lg transition-colors"
              aria-expanded={showCart}
            >
              <ChevronDown
                className={`transform transition-transform duration-300 ${
                  showCart ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>

          <motion.div
            initial={false}
            animate={{
              height: showCart ? "auto" : 0,
              opacity: showCart ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden flex-col space-y-2 mb-2"
          >
            {cart?.items?.length > 0 ? (
              <>
                {cart.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 rounded-lg border border-[#F1F1F1] p-2"
                  >
                    {/* Image */}
                    <div className="w-[50px] h-[50px] rounded-lg overflow-hidden bg-[#F8F8F8] shrink-0">
                      <img
                        src={item.image?.url}
                        alt={item.image?.altText}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div>
                          <p className="text-[12px] font-semibold font-playpen-sans text-[#126B6D] line-clamp-1">
                            {item.productTitle}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-1">
                            {!!item.variantName && (
                              <span className="text-[10px] bg-[#F4F4F4] px-1 py-1 rounded">
                                {item.variantName}
                              </span>
                            )}

                            {!!item.variantAttributes?.weight &&
                              item.variantAttributes.weight !== "null" && (
                                <span className="text-[11px] bg-[#F4F4F4] px-2 py-1 rounded">
                                  {item.variantAttributes.weight}
                                </span>
                              )}
                          </div>

                          <p className="text-[10px] text-gray-500 mt-1">
                            SKU: {item.variantSkuId}
                          </p>

                          {/* <p className="text-[10px] text-gray-500">
                            Qty: {item.quantity}
                          </p> */}
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="block text-[14px] font-semibold">
                            {formatPrice(item.itemTotal)}
                          </span>

                          {item.mrp > item.sellingPrice && (
                            <>
                              <span className="text-xs line-through text-gray-400">
                                {formatPrice(item.mrp)}
                              </span>

                              {/* <p className="text-[#00A63E] text-xs font-medium">
                                Save ₹{Math.round(item.discount)}
                              </p> */}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              "No items in cart please add items."
            )}
          </motion.div>
        </>

        <>
          <div className="flex justify-between items-center">
            <p className="text-base md:text-lg lg:text-xl font-playpen-sans text-[#126B6D]">
              Price Summary
            </p>
            <button
              onClick={() => setShowPrice(!showPrice)}
              className="p-2 rounded-lg transition-colors"
              aria-expanded={showPrice}
            >
              <ChevronDown
                className={`transform transition-transform duration-300 ${
                  showPrice ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
          </div>

          <div className="text-sm sm:text-base">
            <motion.div
              initial={false}
              animate={{
                height: showPrice ? "auto" : 0,
                opacity: showPrice ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-4 bg-[#F8F8F8] rounded-lg px-2 py-1">
                <div className="flex justify-between border-t border-gray-200 pt-4 mt-4">
                  <span className="text-gray-600 font-medium">
                    MRP Price ({totalItems} {totalItems > 1 ? "items" : "item"})
                  </span>
                  <span className="font-medium">
                    {formatPrice(safeTotalPrice)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#00A63E] font-medium">Discount</span>
                  <span className="text-green-600 font-medium">
                    - {formatPrice(totalDiscount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Delivery Charges
                  </span>

                  <span
                    className={`font-medium ${
                      isFreeDelivery ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    {isFreeDelivery ? (
                      <span className="flex items-center gap-1">
                        <BadgeCheck className="w-4 h-4" /> FREE
                      </span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>

                {/* <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">
                    Platform Fee
                  </span>
                  {safePlatformFee ? (
                    <span className="font-medium">
                      {formatPrice(safePlatformFee)}
                    </span>
                  ) : (
                    "0"
                  )}
                </div> */}

                {step === "payment" && !isBuyNow && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Platform Fee
                      </span>
                      <span className="font-medium">
                        ₹{PlatformFee.toFixed(2)}
                      </span>
                    </div>

                    {/* <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Delivery Charges
                      </span>

                      <span
                        className={`font-medium ${
                          isFreeDelivery ? "text-green-600" : "text-gray-800"
                        }`}
                      >
                        {isFreeDelivery ? (
                          <span className="flex items-center gap-1">
                            <BadgeCheck className="w-4 h-4" /> FREE
                          </span>
                        ) : (
                          formatPrice(deliveryCharge)
                        )}
                      </span>
                    </div> */}

                    {step === "payment" && Number(appliedPoints) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#00A63E] font-medium">
                          Reward Points Applied
                        </span>
                        <span className="text-green-600 font-medium">
                          - {formatPrice(appliedPoints)}
                        </span>
                      </div>
                    )}
                    {step === "payment" && Number(couponDiscount) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[#00A63E] font-medium">
                          Coupon Discount
                        </span>
                        <span className="text-green-600 font-medium">
                          - {formatPrice(couponDiscount)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between text-base sm:text-lg font-semibold text-gray-900">
              <span>Total Amount</span>
              <span>{totalPrice}</span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-[#F8F8F8] rounded-lg flex items-start gap-2">
            <Info className="text-[#126B6D] mt-0.5 flex-shrink-0" size={16} />
            <div>
              <p className="text-[#126B6D] font-medium text-sm sm:text-base">
                You're saving ₹{safeTotalDiscount.toLocaleString("en-IN")} on
                this order!
              </p>
              {!isFreeDelivery && (
                <p className="text-green-600 text-xs sm:text-sm mt-1">
                  Free delivery on orders above ₹{deliveryLimit}
                </p>
              )}
            </div>
          </div>

          {/* <=============------------ Apply Coupon ------------=============> */}
          {step === "payment" && !isBuyNow && (
            <div className="mt-5 rounded-xl border border-[#E6E6E6] bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <BadgeCheck className="w-6 h-6 text-[#126B6D]" />
                  </div>

                  <div className="flex flex-col">
                    {Number(appliedPoints) > 0 ? (
                      <>
                        <span className="text-[16px] font-semibold text-[#1C1C1C]">
                          Use Points. Pay Less.
                        </span>
                        <span className="text-[13px] text-[#00A63E] font-medium">
                          You saved additional {formatPrice(appliedPoints)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[16px] font-semibold text-[#1C1C1C]">
                          Apply Reward Points
                        </span>
                        <span className="text-[13px] text-gray-500">
                          Available points: {availablePoints || 0}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {Number(appliedPoints) > 0 ? (
                  <button
                    type="button"
                    onClick={() => onApplyPoints(0)} // 🔥 REMOVE
                    className="min-w-[100px] rounded-lg border border-[#126B6D] px-4 py-2 text-[14px] font-medium text-[#126B6D] hover:bg-[#F7F5FF]"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCoupon(true)} // 🔥 OPEN POPUP
                    className="min-w-[100px] rounded-lg border border-[#126B6D] px-4 py-2 text-[14px] font-medium text-[#126B6D] hover:bg-[#F7F5FF]"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          )}

          {/* <=============------------ Discount Coupon ------------=============> */}
          {step === "payment" && !isBuyNow && (
            <div className="mt-5 rounded-xl border border-[#E6E6E6] bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Tag className="w-6 h-6 text-[#126B6D]" />
                  </div>

                  <div className="flex flex-col ">
                    <span className="text-[16px] font-semibold text-[#126B6D]">
                      Apply Coupon
                    </span>
                    <span className="text-[13px] text-gray-500">
                      Save more with available discount coupons
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  value={couponCodeSet}
                  onChange={(e) =>
                    setCouponCodeSet(e.target.value.toUpperCase())
                  }
                  placeholder="Enter coupon code"
                  className="w-full flex-1 rounded-lg border border-[#E6E6E6] px-3 py-2 text-[14px] outline-none"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={onRemoveCoupon}
                    className="w-full sm:w-auto rounded-lg border border-red-500 px-5 py-2 text-[14px] font-medium text-red-500"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onApplyCoupon(couponCodeSet)}
                    className="w-full sm:w-auto rounded-lg bg-[#126B6D] px-5 py-2 text-[14px] font-medium text-white"
                  >
                    Apply
                  </button>
                )}
              </div>

              <div
                className="mt-3 flex max-h-[320px] flex-col gap-2 overflow-y-auto pr-1"
                onScroll={(e) => {
                  const { scrollTop, scrollHeight, clientHeight } =
                    e.currentTarget;

                  if (
                    scrollTop + clientHeight >= scrollHeight - 20 &&
                    couponHasMore &&
                    !couponLoading
                  ) {
                    loadMoreCoupons();
                  }
                }}
              >
                {activeCoupons.map((coupon) => (
                  <div
                    key={coupon._id || coupon.code}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-[#E6E6E6] bg-white p-3"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-[14px] font-semibold text-[#1C1C1C]">
                        {coupon.code}
                      </p>

                      <p className="break-words text-[12px] text-gray-500">
                        {coupon.discountPercentage}% off up to ₹
                        {coupon.maxDiscountAmount}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCouponCodeSet(coupon.code)}
                      className="w-full sm:w-auto rounded-lg border border-[#126B6D] px-4 py-2 text-[13px] font-medium text-[#126B6D]"
                    >
                      Use
                    </button>
                  </div>
                ))}
                {couponLoading && (
                  <p className="py-2 text-center text-xs text-gray-500">
                    Loading more coupons...
                  </p>
                )}
              </div>

              {otherCoupons.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowCouponList((prev) => !prev)}
                    className="mt-3 text-[14px] font-medium text-[#126B6D]"
                  >
                    {showCouponList ? "Hide coupons" : "Show more coupons"}
                  </button>

                  {showCouponList && (
                    <div
                      className="mt-3 flex max-h-[320px] flex-col gap-2 overflow-y-auto pr-1"
                      onScroll={(e) => {
                        const { scrollTop, scrollHeight, clientHeight } =
                          e.currentTarget;

                        if (
                          scrollTop + clientHeight >= scrollHeight - 20 &&
                          couponHasMore &&
                          !couponLoading
                        ) {
                          loadMoreCoupons();
                        }
                      }}
                    >
                      {otherCoupons.map((coupon) => (
                        <div
                          key={coupon.code}
                          className={`flex items-center justify-between rounded-lg border border-[#E6E6E6] p-3 ${coupon.isEligible === false ? `bg-gray-100 opacity-70 cursor-not-allowed` : `bg-white text-gray-600`}`}
                        >
                          <div className="min-w-0">
                            <p className="break-words text-[14px] font-semibold text-[#1C1C1C]">
                              {coupon.description}
                            </p>
                            {coupon.desc && (
                              <p className="break-words text-[12px] text-gray-500">
                                {coupon.desc}
                              </p>
                            )}
                            <p className="break-words text-[12px] text-gray-500">
                              {coupon.discountPercentage}% off up to ₹
                              {coupon.maxDiscountAmount}
                            </p>
                            <p className="mt-1 w-fit rounded bg-[#F7F5FF] px-2 py-1 text-[12px] font-semibold text-[#126B6D]">
                              {coupon.code}
                            </p>
                          </div>

                          <div
                            className={`flex flex-col items-end gap-2 ${coupon.isActive === false ? `cursor-not-allowed` : ` block`}`}
                          >
                            <button
                              type="button"
                              disabled={`${coupon.isEligible === false}`}
                              className={`rounded-lg border border-[#126B6D] px-4 py-2 text-xs font-medium text-[#126B6D] ${coupon.isEligible === false ? `cursor-not-allowed` : ` block`}`}
                            >
                              Not applicable
                            </button>
                            <span className="break-words mt-1 text-xs text-red-600">
                              *
                              {coupon?.isEligible === false
                                ? `${coupon?.ineligibilityReasons?.[0] || "Not applicable"}`
                                : `  Not applicable`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Payment Security */}
          <div className="mt-2 pt-4 border-t border-gray-200 flex items-center justify-between gap-2 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-gray-400" size={16} />
              <span>100% secure payments</span>
            </div>
            <div className="my-2">
              {step === "cart" &&
                (hasOutOfStock ? (
                  <p className="text-red-600 text-sm font-medium">
                    Remove or save out-of-stock items to continue checkout
                  </p>
                ) : (
                  <Link
                    to="/checkout/delivery"
                    className="bg-[#126B6D] rounded-lg text-white md:px-8 md:py-3 px-4 py-2 font-medium transition-colors flex items-center gap-2 text-[14px]"
                  >
                    Proceed to Checkout
                  </Link>
                ))}

              {step === "delivery" && canProceed && (
                <button
                  onClick={goToPayment}
                  className="bg-[#126B6D] rounded-lg hover:bg-black text-white md:px-8 md:py-3 px-4 py-2 text-base font-medium transition-colors flex items-center gap-2"
                >
                  Proceed to Checkout
                </button>
              )}

              {step === "payment" && selected === "Razorpay" && (
                <button
                  onClick={handlePlaceOrder}
                  className="bg-[#126B6D] rounded-lg text-white md:px-8 md:py-3 px-4 py-2 text-base font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {buyNowMode ? "Buy Now & Pay" : "Place Order"}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </>
      </div>

      {/* <=============------------ show popUp Coupon ------------=============> */}

      {step === "payment" && !isBuyNow && showCoupon && (
        <>
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                // setShowCard(false);
                setShowCoupon(false);
              }
            }}
          >
            <div
              className="bg-white rounded-xl shadow-lg relative p-4 sm:p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between w-full gap-5">
                <span className="text-[18px] text-[#126B6D] font-semibold">
                  Apply Coupon
                </span>
                <button
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="text-xl"
                >
                  <IoCloseCircleOutline size={28} />
                </button>
              </div>

              <div className="mt-4 bg-gradient-to-r from-[#88D3D5]/50 to-[#6CB7B9]/20  p-3 border-b-dashed border-[#727681] rounded-xl">
                <div className="flex justify-between p-2 gap-8 items-center">
                  <div>
                    <span className="text-[#0E101A] text-[16px] font-medium">
                      Earn points on Every {purchasePoints} Purchase
                    </span>
                    <div>
                      <span>Available points: {availablePoints}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onApplyPoints(availablePoints);
                      setShowCoupon(false);
                    }}
                    className="bg-[#126B6D] text-white px-4 py-2 rounded-md font-medium"
                  >
                    Apply
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {/* <span className="text-[#727681] text-[14px] font-medium">
                    Get points for every ₹500+ purchase.
                  </span> */}
                  <span className="text-[#727681] text-[14px] font-medium">
                    Redemption Rules
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#FFFFFF] to-[#B2FF00]/20 p-3 border-t-dashed border-[#727681] rounded-xl">
                <div className="flex flex-col gap-2">
                  <span className="text-[#0E101A] text-[14px] font-medium">
                    • 1 point = ₹{Points} value during redemption
                  </span>

                  <span className="text-[#0E101A] text-[14px] font-medium">
                    • Minimum invoice value required for redemption: ₹
                    {redeamPoint}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PriceDetails;
