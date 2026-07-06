import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  Globe,
  House,
  Info,
  LayoutDashboard,
  Lightbulb,
  Percent,
  Repeat,
  Settings,
  Tag,
  Ticket,
  TicketPercent,
  Wallet,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance.js";
import { toast } from "react-toastify";

const CoupenForm = () => {
  const navigate = useNavigate();
  const { couponId } = useParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setformData] = useState({
    code: "",
    discountPercentage: "",
    maxDiscountAmount: "",
    minimumCartValue: "",
    usageLimit: "",
    perUserLimit: "",
    isActive: true,
    isPublic: false,
    description: "",
    applicableCategories: [],
    applicableProducts: [],
    appliesTo: "all",
  });

  // run the function
  useEffect(() => {
    getCategories();
    getProducts();
    if (couponId) {
      getCouponById();
    }
  }, [couponId]);

  const getCategories = async () => {
    try {
      const res = await axiosInstance.get(
        "/category/admin/all-categories?page=1&limit=100",
      );

      console.log("Category API:", res.data);

      setCategories(res.data.category || []);
    } catch (error) {
      console.log("Category API Error:", error);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axiosInstance.get(
        "/product/admin/get-all-products?page=1&limit=100",
      );

      console.log("Product API:", res.data);

      const productData =
        res.data?.products ||
        res.data?.data ||
        res.data?.result ||
        res.data ||
        [];

      setProducts(Array.isArray(productData) ? productData : []);
    } catch (error) {
      console.log("Product API Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setformData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const filteredProducts = products.filter((product) =>
    (product.name || product.productName || product.title || "")
      .toLowerCase()
      .includes(productSearch.toLowerCase()),
  );

  // validation add
  const validateForm = () => {
    if (!formData.code.trim()) {
      alert("Coupon code is required");
      return false;
    }

    if (!formData.discountPercentage) {
      alert("Discount percentage is required");
      return false;
    }

    if (
      Number(formData.discountPercentage) <= 0 ||
      Number(formData.discountPercentage) > 100
    ) {
      alert("Discount percentage must be between 1 and 100");
      return false;
    }

    if (!formData.maxDiscountAmount) {
      alert("Maximum discount amount is required");
      return false;
    }

    if (!formData.minimumCartValue) {
      alert("Minimum cart value is required");
      return false;
    }

    if (!formData.usageLimit) {
      alert("Usage limit is required");
      return false;
    }

    if (!formData.perUserLimit) {
      alert("Per user limit is required");
      return false;
    }

    if (
      formData.appliesTo === "category" &&
      formData.applicableCategories.length === 0
    ) {
      alert("Please select at least one category");
      return false;
    }

    if (
      formData.appliesTo === "product" &&
      formData.applicableProducts.length === 0
    ) {
      alert("Please select at least one product");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        code: formData.code.trim().toUpperCase(),
        discountPercentage: Number(formData.discountPercentage),
        maxDiscountAmount: Number(formData.maxDiscountAmount),
        minimumCartValue: Number(formData.minimumCartValue),
        usageLimit: Number(formData.usageLimit),
        perUserLimit: Number(formData.perUserLimit),
        isActive: formData.isActive,
        isPublic: formData.isPublic,
        description: formData.description,
        appliesTo: formData.appliesTo,
        applicableCategories:
          formData.appliesTo === "category"
            ? formData.applicableCategories
            : [],
        applicableProducts:
          formData.appliesTo === "product" ? formData.applicableProducts : [],
      };

      let res;

      if (couponId) {
        res = await axiosInstance.put(
          `/dashboard/coupon/update-coupon/${couponId}`,
          payload,
        );
      } else {
        res = await axiosInstance.post(
          "/dashboard/coupon/create-coupon",
          payload,
        );
      }

      toast.success(
        res.data?.message ||
          (couponId
            ? "Coupon updated successfully"
            : "Coupon created successfully"),
      );

      navigate("/admin/ManageCoupons");
    } catch (error) {
      const apiErrors = error.response?.data?.errors;

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.error(apiErrors[0].msg);
      } else {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Something went wrong",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMultiSelect = (e, fieldName) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setformData((prev) => ({
      ...prev,
      [fieldName]: selectedValues,
    }));
  };

  const handleCancel = () => {
    setformData({
      code: "",
      discountPercentage: "",
      maxDiscountAmount: "",
      minimumCartValue: "",
      usageLimit: "",
      perUserLimit: "",
      isActive: true,
      isPublic: false,
      description: "",
      applicableCategories: [],
      applicableProducts: [],
      appliesTo: "all",
    });

    navigate("/admin/ManageCoupons");
  };

  // Create getCouponById
  const getCouponById = async () => {
    try {
      const res = await axiosInstance.get(`/dashboard/coupon/${couponId}`);

      const coupon = res.data.data;

      setformData({
        code: coupon.code || "",
        discountPercentage: coupon.discountPercentage || "",
        maxDiscountAmount: coupon.maxDiscountAmount || "",
        minimumCartValue: coupon.minimumCartValue || "",
        usageLimit: coupon.usageLimit || "",
        perUserLimit: coupon.perUserLimit || "",
        isActive: coupon.isActive,
        isPublic: coupon.isPublic,
        description: coupon.description || "",
        appliesTo: coupon.appliesTo || "all",
        applicableCategories: coupon.applicableCategories || [],
        applicableProducts: coupon.applicableProducts || [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="p-4 sm:p-6 bg-[#F6F8F9] min-h-screen">
        <main className="">
          {/* PAGE TITLE */}
          <div className="flex mb-4 justify-between items-start">
            <div className="flex items-start gap-4">
              <div
                onClick={() => navigate("/admin/ManageCoupons")}
                className="size-12 rounded-xl bg-[#f1d5d9] text-[#7A1F2B] flex justify-center items-center cursor-pointer"
              >
                <ChevronLeft className="size-6" />
              </div>

              <div>
                <p className="font-semibold text-2xl font-stack-sans text-[#7A1F2B]">
                  {couponId ? "Update Coupon" : "Create Coupon"}
                </p>
                <p className="text-[#71717b] text-sm">
                  Create and manage promotional discount coupons.Rev
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  type="button"
                  className="border border-zinc-200 bg-white text-[#7A1F2B] px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <X className="size-4" />
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`min-w-[140px] px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
                    loading
                      ? "bg-[#f1d5d9] cursor-not-allowed"
                      : "  bg-[#7A1F2B] hover:bg-[#fdd1c8] hover:text-gray-600"
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />
                      {couponId ? "Update Coupon" : "Save Coupon"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* LEFT SIDE */}
            <div className="col-span-2 flex flex-col gap-6">
              {/* Coupon Details */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    <Info className="size-4 text-[#7A1F2B]" />
                    Coupon Details
                  </h2>
                  <p className="text-xs text-[#71717b]">
                    Basic information about the discount coupon.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Coupon Code</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#71717b]" />
                      <input
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Enter coupon code"
                        className="w-full uppercase border border-zinc-200 rounded-md px-3 py-2 pl-9 outline-none"
                      />
                    </div>
                    <p className="text-[#71717b] text-xs">
                      Example: SAVE20 — keep it short and memorable.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Discount Percentage (%)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#71717b]" />
                      <input
                        name="discountPercentage"
                        type="number"
                        value={formData.discountPercentage}
                        onChange={handleChange}
                        placeholder="0–100"
                        className="w-full border border-zinc-200 rounded-md px-3 py-2 pl-9 outline-none"
                      />
                    </div>
                    <p className="text-[#71717b] text-xs">
                      Value between 0 and 100.
                    </p>
                  </div>

                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter coupon description"
                      className="w-full min-h-20 resize-none border border-zinc-200 rounded-md px-3 py-2 outline-none"
                    />
                    <p className="text-[#71717b] text-xs">
                      Shown to customers at checkout.
                    </p>
                  </div>
                </div>
              </div>

              {/* Limits */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    <Wallet className="size-4 text-[#0C0057]" />
                    Limits & Conditions
                  </h2>
                  <p className="text-xs text-[#71717b]">
                    Configure spend thresholds and usage rules.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Maximum Discount Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717b] text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="maxDiscountAmount"
                        value={formData.maxDiscountAmount}
                        onChange={handleChange}
                        placeholder="Enter max discount"
                        className="w-full border border-zinc-200 rounded-md px-3 py-2 pl-7 outline-none"
                      />
                    </div>
                    <p className="text-[#71717b] text-xs">
                      Caps the total amount discounted.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Minimum Cart Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717b] text-sm">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="minimumCartValue"
                        value={formData.minimumCartValue}
                        onChange={handleChange}
                        placeholder="Enter minimum order value"
                        className="w-full border border-zinc-200 rounded-md px-3 py-2 pl-7 outline-none"
                      />
                    </div>
                    <p className="text-[#71717b] text-xs">
                      Minimum order subtotal to qualify.
                    </p>
                  </div>

                  {/* Applies To */}
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium">Applies To</label>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {/* All Products */}
                      <label
                        className={`cursor-pointer rounded-lg p-3 flex flex-col gap-1 border-2 transition-all duration-200 ${
                          formData.appliesTo === "all"
                            ? "bg-[#2b7fff]/5 border-[#0C0057]"
                            : "border-zinc-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="appliesTo"
                          value="all"
                          checked={formData.appliesTo === "all"}
                          onChange={handleChange}
                          className="hidden"
                        />

                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">
                            All Products
                          </span>
                          {formData.appliesTo === "all" && (
                            <Check className="size-4 text-[#0C0057]" />
                          )}
                        </div>

                        <span className="text-[#71717b] text-xs">
                          Apply storewide
                        </span>
                      </label>

                      {/* Categories */}
                      <label
                        className={`cursor-pointer rounded-lg p-3 flex flex-col gap-1 border-2 transition-all duration-200 ${
                          formData.appliesTo === "category"
                            ? "bg-[#f1d5d9] border-[#7A1F2B]"
                            : "border-zinc-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="appliesTo"
                          value="category"
                          checked={formData.appliesTo === "category"}
                          onChange={handleChange}
                          className="hidden"
                        />

                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">
                            Categories
                          </span>
                          {formData.appliesTo === "category" && (
                            <Check className="size-4 text-[#7A1F2B]" />
                          )}
                        </div>

                        <span className="text-[#71717b] text-xs">
                          Select categories
                        </span>
                      </label>

                      {/* Products */}
                      <label
                        className={`cursor-pointer rounded-lg p-3 flex flex-col gap-1 border-2 transition-all duration-200 ${
                          formData.appliesTo === "product"
                            ? "bg-[#f1d5d9] border-[#7A1F2B]"
                            : "border-zinc-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="appliesTo"
                          value="product"
                          checked={formData.appliesTo === "product"}
                          onChange={handleChange}
                          className="hidden"
                        />

                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">
                            Specific Products
                          </span>
                          {formData.appliesTo === "product" && (
                            <Check className="size-4 text-[#7A1F2B]" />
                          )}
                        </div>

                        <span className="text-[#71717b] text-xs">
                          Search products
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Category Multi Select */}
                  {formData.appliesTo === "category" && (
                    <div className="col-span-2 flex flex-col gap-3">
                      <label className="text-sm font-medium">
                        Select Categories
                      </label>

                      <input
                        type="text"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        placeholder="Search category..."
                        className="w-full border border-zinc-200 rounded-md px-3 py-2 outline-none"
                      />

                      <div className="border border-zinc-200 rounded-lg p-3 max-h-52 overflow-y-auto bg-white">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                              <label
                                key={cat._id}
                                className="flex items-center gap-2 cursor-pointer text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.applicableCategories.includes(
                                    cat._id,
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setformData((prev) => ({
                                        ...prev,
                                        applicableCategories: [
                                          ...prev.applicableCategories,
                                          cat._id,
                                        ],
                                      }));
                                    } else {
                                      setformData((prev) => ({
                                        ...prev,
                                        applicableCategories:
                                          prev.applicableCategories.filter(
                                            (id) => id !== cat._id,
                                          ),
                                      }));
                                    }
                                  }}
                                />

                                <span>{cat.name}</span>
                              </label>
                            ))
                          ) : (
                            <p className="text-sm text-[#71717b] col-span-3">
                              No category found
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {formData.applicableCategories.map((id) => {
                          const category = categories.find(
                            (cat) => cat._id === id,
                          );

                          return (
                            <span
                              key={id}
                              className="px-3 py-1 rounded-md bg-[#7A1F2B]/50 text-[#7A1F2B] text-sm flex items-center gap-1"
                            >
                              {category?.name}

                              <X
                                size={14}
                                className="cursor-pointer"
                                onClick={() =>
                                  setformData((prev) => ({
                                    ...prev,
                                    applicableCategories:
                                      prev.applicableCategories.filter(
                                        (item) => item !== id,
                                      ),
                                  }))
                                }
                              />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Product Multi Select */}
                  {formData.appliesTo === "product" && (
                    <div className="col-span-2 flex flex-col gap-3">
                      <label className="text-sm font-medium">
                        Select Products
                      </label>

                      {/* Search Product */}
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search product..."
                        className="w-full border border-zinc-200 rounded-md px-3 py-2 outline-none"
                      />

                      {/* Product List */}
                      <div className="border border-zinc-200 rounded-lg p-3 max-h-52 overflow-y-auto bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                              <label
                                key={product._id}
                                className="flex items-center gap-2 cursor-pointer text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.applicableProducts.includes(
                                    product._id,
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setformData((prev) => ({
                                        ...prev,
                                        applicableProducts: [
                                          ...prev.applicableProducts,
                                          product._id,
                                        ],
                                      }));
                                    } else {
                                      setformData((prev) => ({
                                        ...prev,
                                        applicableProducts:
                                          prev.applicableProducts.filter(
                                            (id) => id !== product._id,
                                          ),
                                      }));
                                    }
                                  }}
                                />

                                <span>
                                  {product.name ||
                                    product.productName ||
                                    product.title ||
                                    "Unnamed Product"}
                                </span>
                              </label>
                            ))
                          ) : (
                            <p className="text-sm text-[#71717b] col-span-2">
                              No product found
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Selected Products */}
                      <div className="flex flex-wrap gap-2">
                        {formData.applicableProducts.map((id) => {
                          const selectedProduct = products.find(
                            (item) => item._id === id,
                          );

                          return (
                            <span
                              key={id}
                              className="px-3 py-1 rounded-md bg-[#7A1F2B]/50 text-[#7A1F2B] text-sm flex items-center gap-1"
                            >
                              {selectedProduct?.name ||
                                selectedProduct?.productName ||
                                selectedProduct?.title}

                              <X
                                size={14}
                                className="cursor-pointer"
                                onClick={() =>
                                  setformData((prev) => ({
                                    ...prev,
                                    applicableProducts:
                                      prev.applicableProducts.filter(
                                        (item) => item !== id,
                                      ),
                                  }))
                                }
                              />
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 flex flex-col gap-6">
                <div>
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    <Repeat className="size-4 text-[#7A1F2B]" />
                    Usage & Visibility
                  </h2>
                  <p className="text-xs text-[#71717b]">
                    Control how often and by whom this coupon can be used.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Usage Limit</label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      className="w-full border border-zinc-200 rounded-md px-3 py-2 outline-none"
                    />
                    <p className="text-[#71717b] text-xs">
                      Leave empty for unlimited.
                    </p>
                  </div>

                  {/* <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Used Count</label>
                    <input
                      type="number"
                      defaultValue="0"
                      disabled
                      className="w-full border border-zinc-200 rounded-md px-3 py-2 bg-zinc-100 text-[#71717b]"
                    />
                    <p className="text-[#71717b] text-xs">
                      Read-only system value.
                    </p>
                  </div> */}

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">
                      Per User Limit
                    </label>
                    <input
                      type="number"
                      name="perUserLimit"
                      value={formData.perUserLimit}
                      onChange={handleChange}
                      placeholder="e.g. 1"
                      className="w-full border border-zinc-200 rounded-md px-3 py-2 outline-none"
                    />
                    <p className="text-[#71717b] text-xs">
                      Leave empty for unlimited.
                    </p>
                  </div>

                  <div className="col-span-3 rounded-lg border border-zinc-200 flex p-4 justify-between items-center">
                    <div className="flex items-start gap-3">
                      <Globe className="size-5 text-[#7A1F2B] mt-0.5" />
                      <div>
                        <span className="font-medium text-sm">
                          Public Coupon
                        </span>
                        <p className="text-[#71717b] text-xs">
                          Visible to all customers on the storefront.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setformData((prev) => ({
                          ...prev,
                          isPublic: !prev.isPublic,
                        }))
                      }
                      className={`w-10 h-6 rounded-full p-1 flex transition-all ${
                        formData.isPublic
                          ? "  bg-[#7A1F2B] justify-end"
                          : "bg-gray-300 justify-start"
                      }`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>

                  <div className="col-span-3 rounded-lg border border-zinc-200 flex p-4 justify-between items-center">
                    <div>
                      <span className="font-medium text-sm">Coupon Status</span>
                      <p className="text-[#71717b] text-xs">
                        Activate to make this coupon usable.
                      </p>
                    </div>

                    <div className="inline-flex rounded-lg bg-zinc-100 p-1">
                      <button
                        onClick={() =>
                          setformData((prev) => ({
                            ...prev,
                            isActive: true,
                          }))
                        }
                        className={`px-4 py-1.5 rounded-md text-sm ${
                          formData.isActive
                            ? "bg-white shadow-sm"
                            : "text-[#71717b]"
                        }`}
                      >
                        Active
                      </button>

                      <button
                        onClick={() =>
                          setformData((prev) => ({
                            ...prev,
                            isActive: false,
                          }))
                        }
                        className={`px-4 py-1.5 rounded-md text-sm ${
                          !formData.isActive
                            ? "bg-white shadow-sm"
                            : "text-[#71717b]"
                        }`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-1 flex flex-col gap-6">
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm sticky top-24 p-6 flex flex-col gap-4">
                <div>
                  <h2 className="font-semibold flex items-center gap-2 text-[#7A1F2B] font-stack-sans">
                    {/* <Eye className="size-4 text-[#2b7fff]" /> */}
                    Live Preview
                  </h2>
                  <p className="text-xs text-[#71717b]">
                    How your coupon looks.
                  </p>
                </div>

                <div className="relative rounded-xl bg-[#7A1F2B] text-white p-5 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="uppercase opacity-80 text-xs tracking-wider">
                        Coupon Code
                      </span>
                      <h3 className="font-bold text-2xl uppercase">
                        {formData.code || "SAVE20"}
                      </h3>
                    </div>

                    <TicketPercent className="size-10 opacity-30" />
                  </div>

                  <div className="flex mt-4 justify-between items-end">
                    <div>
                      <span className="font-bold text-4xl">
                        {formData.discountPercentage || 0}%
                      </span>
                      <p className="opacity-80 text-xs mt-1">
                        discount applied
                      </p>
                    </div>

                    <span className="rounded-md bg-white px-2 py-1 text-sm font-stack-sans text-[#7A1F2B]">
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="top-1/2 size-4 -translate-y-1/2 rounded-full bg-white absolute -left-2" />
                  <div className="top-1/2 size-4 -translate-y-1/2 rounded-full bg-white absolute -right-2" />
                </div>

                <div className="rounded-lg border border-zinc-200 flex p-4 flex-col gap-3">
                  <span className="font-medium uppercase text-[#71717b] text-xs tracking-wide">
                    Usage Summary
                  </span>

                  <div className="text-sm flex justify-between">
                    <span className="text-[#71717b]">Used</span>
                    <span className="font-medium">
                      0 / {formData.usageLimit || 0}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-zinc-200 overflow-hidden">
                    <div
                      className="h-full bg-[#2b7fff]"
                      style={{ width: "0%" }}
                    />
                  </div>

                  <div className="text-sm flex justify-between">
                    <span className="text-[#71717b]">Per user limit</span>
                    <span className="font-medium">
                      {formData.perUserLimit || 0}
                    </span>
                  </div>

                  <div className="text-sm flex justify-between">
                    <span className="text-[#71717b]">Min. cart value</span>
                    <span className="font-medium">
                      ₹{formData.minimumCartValue || 0}
                    </span>
                  </div>

                  <div className="text-sm flex justify-between">
                    <span className="text-[#71717b]">Max. discount</span>
                    <span className="font-medium">
                      ₹{formData.maxDiscountAmount || 0}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-zinc-100 flex p-3 items-start gap-2">
                  <Lightbulb className="size-4 text-[#2b7fff] mt-0.5" />
                  <p className="text-[#71717b] text-xs">
                    Public coupons appear automatically at checkout for eligible
                    carts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoupenForm;
