import {
  ArrowUpDown,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Eye,
  Globe,
  Layers,
  LayoutDashboard,
  Pencil,
  Percent,
  Plus,
  RotateCcw,
  Search,
  Settings,
  SlidersHorizontal,
  Ticket,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

export default function Coupon() {
  const navigate = useNavigate();
  const [Coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    filteredCount: 0,
    pageLimit: 10,
  });

  const getCoupons = async () => {
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", 10);

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (status !== "all" && status !== "") {
        params.append("isActive", status === "active" ? "true" : "false");
      }

      if (sort === "newest") {
        params.append("sortBy", "createdAt");
        params.append("order", "desc");
      }

      if (sort === "oldest") {
        params.append("sortBy", "createdAt");
        params.append("order", "asc");
      }

      if (sort === "highestDiscount") {
        params.append("sortBy", "discountPercentage");
        params.append("order", "desc");
      }

      const res = await axiosInstance.get(
        `/dashboard/coupon/admin?${params.toString()}`,
      );

      console.log("Product API:", res.data);

      setCoupons(Array.isArray(res?.data?.data) ? res?.data?.data : []);
      setPagination({
        totalPages: res.data?.pagination?.totalPages || 1,
        currentPage: res.data?.pagination?.currentPage || 1,
        filteredCount: res.data?.pagination?.filteredCount || 0,
        pageLimit: res.data?.pagination?.pageLimit || 10,
      });
    } catch (error) {
      console.log("Product API Error:", error);
    }
  };

  useEffect(() => {
    getCoupons();
  }, [page, status, sort]);

  useEffect(() => {
    if (search.trim() === "") {
      setPage(1);
      getCoupons();
    }
  }, [search]);

  console.log(Coupons);

  return (
    <div className="bg-white text-zinc-950 w-full min-h-screen">
      <main className="px-8 py-6 bg-[#F6F8F9] min-h-screen">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-[#2b7fff]/10 text-[#0C0057] flex justify-center items-center">
              <Ticket className="size-6" />
            </div>

            <div>
              <h1 className="font-bold text-2xl">Coupons</h1>
              <p className="text-[#71717b] text-sm">
                Browse, filter, and manage all your promotional discount
                coupons.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/CouponForm")}
            className="bg-[#0C0057] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="size-4" />
            Add Coupon
          </button>
        </div>

        {/* Search Filter */}
        <div className="bg-white border border-zinc-200 shadow-sm rounded-2xl mt-6 p-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-[#2b7fff]" />
              <h3 className="font-bold text-base">Search & Filter Coupons</h3>
            </div>

            <p className="text-sm text-[#71717b]">
              Quickly find coupons by code, status, scope, discount range, or
              visibility.
            </p>
          </div>

          <div className="flex items-end gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#71717b]" />

              <input
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);

                  // When search is cleared
                  if (value.trim() === "") {
                    setPage(1);
                  }
                }}
                className="w-full h-[42px] border border-zinc-200 rounded-lg pl-9 pr-4 outline-none"
                placeholder="Search coupons by code, e.g. SAVE20"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={() => {
                setPage(1);
                getCoupons();
              }}
              className="h-[42px] bg-[#0C0057] text-white px-4 rounded-lg flex items-center gap-2 whitespace-nowrap"
            >
              <Search className="size-4" />
              Search
            </button>

            {/* Status */}
            <div className="flex flex-col min-w-[180px]">
              <label className="h-5 mb-1 font-medium text-[#71717b] text-xs flex items-center">
                Status
              </label>

              <div className="relative">
                <CircleDot className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#71717b]" />

                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full h-[42px] border border-[#E5E7EB] rounded-lg pl-9 pr-8 text-sm text-[#1C1C1C] outline-none appearance-none bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#71717b] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="flex mt-6 justify-between items-center">
          <p className="text-[#71717b] text-sm">
            Showing{" "}
            <span className="font-semibold text-zinc-950">
              {" "}
              {Coupons.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-zinc-950">
              {pagination.filteredCount}
            </span>{" "}
            coupons
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[#71717b] text-sm">Sort by:</span>

            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#71717b]" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-45 border border-zinc-200 rounded-lg pl-9 pr-3 py-2 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highestDiscount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coupon Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 mt-4 gap-6">
          {Coupons.map((coupon, index) => {
            const progressPercentage =
              coupon.usageLimit > 0
                ? Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)
                : 100;
            return (
              <div
                key={index}
                className="bg-white shadow-sm rounded-xl overflow-hidden border border-zinc-200 min-h-[330px] flex flex-col"
              >
                <div className="relative bg-gradient-to-l from-[#CFC7FF80] to-[#FFC9EA33] text-black flex p-4 justify-between items-start">
                  {/* <div className="relative bg-[#2b7fff] bg-gradient-to-l text-white flex p-4 justify-between items-start"> */}
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg text-[#686868] tracking-wide">
                      {coupon.code}
                    </span>
                    <span className="font-semibold text-3xl">
                      {coupon.discountPercentage}%
                    </span>
                  </div>

                 <div className="flex-col flex items-end justify-end gap-2">
                   <span
                    className={`px-2 py-1 rounded-md text-xs text-white ${
                      coupon.isActive === true
                        ? "bg-emerald-400"
                        : "bg-zinc-300"
                    }`}
                  >
                    {coupon.isActive === true ? "Active" : "Inactive"}
                  </span>
                   <button
                    onClick={() => navigate(`/admin/coupon/edit/${coupon._id}`)}
                    className="size-8 text-[#71717b] rounded-md hover:bg-zinc-100 flex items-center justify-center"
                  >
                    <Pencil className="size-4" />
                  </button>
                 </div>
                </div>

                <div className="flex p-4 flex-col gap-3 flex-1">
                  <p className="text-[#71717b] text-xs line-clamp-2 min-h-[32px]">
                    {coupon.description || "No description available"}
                  </p>

                  <div className="border-t border-zinc-200" />

                  <div className="grid grid-cols-2 text-xs gap-3">
                    <div className="col-span-2 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-[#71717b]">Used / Limit</span>
                        <span className="font-semibold">
                          {coupon.usedCount} /{" "}
                          {coupon.usageLimit > 0
                            ? coupon.usageLimit
                            : "Unlimited"}
                        </span>
                      </div>

                      <div className="rounded-full bg-zinc-100 w-full h-1.5">
                        <div
                          className="rounded-full bg-[#2b7fff] h-1.5 transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#71717b]">Per User Limit</span>
                      <span className="font-semibold">
                        {coupon.perUserLimit && coupon.perUserLimit > 0
                          ? coupon.perUserLimit
                          : "Unlimited"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#71717b]">Min. Cart Value</span>
                      <span className="font-semibold">
                        {coupon.minimumCartValue}
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[#71717b]">Max. Discount</span>
                      <span className="font-semibold">
                        {coupon.maxDiscountAmount}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[#71717b]">Applies To</span>
                      <span className="bg-[#2b7fff]/10 text-[#0C0057] w-fit px-2 py-1 rounded-md text-xs">
                        {coupon.appliesTo}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[#71717b] text-xs">Visibility</span>
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        coupon.isPublic === true
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {coupon.isPublic === true ? "Public" : "Private"}
                    </span>
                  </div>
                </div>

                {/* <div className="border-t border-zinc-200 flex p-2 justify-end items-center gap-1"> */}
                  {/* <button className="size-8 text-[#2b7fff] rounded-md hover:bg-zinc-100 flex items-center justify-center">
                  <Eye className="size-4" />
                </button> */}

                  {/* <button
                    onClick={() => navigate(`/admin/coupon/edit/${coupon._id}`)}
                    className="size-8 text-[#71717b] rounded-md hover:bg-zinc-100 flex items-center justify-center"
                  >
                    <Pencil className="size-4" />
                  </button> */}

                  {/* <button className="size-8 text-[#e7000b] rounded-md hover:bg-zinc-100 flex items-center justify-center">
                  <Trash2 className="size-4" />
                </button> */}
                {/* </div> */}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex mt-8 justify-between items-center">
          <p className="text-sm text-[#71717b]">
            Showing{" "}
            <span className="font-semibold text-zinc-950">
              {Coupons.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-zinc-950">
              {pagination.filteredCount}
            </span>{" "}
            coupons
          </p>

          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="border border-zinc-200 px-3 py-2 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`size-9 rounded-lg text-sm ${
                    page === pageNumber
                      ? "bg-[#0C0057] text-white"
                      : "border border-zinc-200 bg-white"
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              disabled={page === pagination.totalPages}
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, pagination.totalPages))
              }
              className="border border-zinc-200 px-3 py-2 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
