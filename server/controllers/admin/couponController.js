import Coupon from "../../models/admin/CouponConfig.js";
import Cart from "../../models/Cart.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

// Admin Controllers
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountPercentage,
    maxDiscountAmount,
    minimumCartValue,
    usageLimit,
    perUserLimit,
    isActive,
    isPublic,
    description,
    applicableCategories = [],
    applicableProducts = [],
    appliesTo = "all",
  } = req.body;

  const existingCoupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
  });
  if (existingCoupon) {
    throw AppError.conflict("Coupon code already exists", "COUPON_EXISTS");
  }

  if (appliesTo === "category") {
    if (!applicableCategories.length) {
      throw AppError.badRequest(
        "Applicable categories are required for category-specific coupons",
        "CATEGORIES_REQUIRED",
      );
    }
  }

  if (appliesTo === "product") {
    if (!applicableProducts.length) {
      throw AppError.badRequest(
        "Applicable products are required for product-specific coupons",
        "PRODUCTS_REQUIRED",
      );
    }
  }

  const coupon = await Coupon.create({
    code: code.trim().toUpperCase(),
    discountPercentage,
    maxDiscountAmount,
    minimumCartValue,
    usageLimit,
    perUserLimit,
    description,
    isActive: isActive ?? true,
    isPublic: isPublic ?? false,
    appliesTo,
    applicableCategories,
    applicableProducts,
  });

  return res.status(201).json({
    success: true,
    message: "Coupon created successfully",
    data: coupon,
  });
});

export const getCouponsAdmin = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    isActive,
    sortBy = "createdAt",
    order = "desc",
    search = "",
  } = req.query;

  const query = {};

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  if (search.trim()) {
    query.$or = [
      {
        code: { $regex: search.trim(), $options: "i" },
      },
    ];
  }

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.min(parseInt(limit, 10), 100);
  const skip = (pageNumber - 1) * pageLimit;

  const sortOrder = order === "asc" ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };

  const [coupons, filteredCount] = await Promise.all([
    Coupon.find(query).sort(sortOptions).skip(skip).limit(pageLimit),
    Coupon.countDocuments(query),
  ]);

  const [totalCoupons, activeCoupons, usageStats] = await Promise.all([
    Coupon.countDocuments({}),
    Coupon.countDocuments({ isActive: true }),
    Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalUsed: { $sum: "$usedCount" },
          totalLimit: { $sum: "$usageLimit" },
        },
      },
    ]),
  ]);

  const totalUsed = usageStats?.[0]?.totalUsed ?? 0;
  const totalLimit = usageStats?.[0]?.totalLimit ?? 0;

  const usagePercentage =
    totalLimit > 0 ? Number(((totalUsed / totalLimit) * 100).toFixed(2)) : 0;

  return res.status(200).json({
    success: true,
    message: "Coupons fetched successfully",
    data: coupons,
    stats: {
      totalCoupons,
      activeCoupons,
      usagePercentage,
    },

    pagination: {
      filteredCount,
      totalPages: Math.ceil(filteredCount / pageLimit),
      currentPage: pageNumber,
      pageLimit: pageLimit,
    },
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const updateData = { ...req.body };

  if (updateData.code) {
    updateData.code = updateData.code.toUpperCase().trim();

    const existingCoupon = await Coupon.findOne({
      code: updateData.code,
      _id: { $ne: couponId },
    });

    if (existingCoupon) {
      throw AppError.conflict("Coupon code already exists", "COUPON_EXISTS");
    }
  }

  if (updateData.appliesTo === "category") {
    if (
      !Array.isArray(updateData.applicableCategories) ||
      updateData.applicableCategories.length === 0
    ) {
      throw AppError.badRequest(
        "Applicable categories are required",
        "CATEGORIES_REQUIRED",
      );
    }
  }

  if (updateData.appliesTo === "product") {
    if (
      !Array.isArray(updateData.applicableProducts) ||
      updateData.applicableProducts.length === 0
    ) {
      throw AppError.badRequest(
        "Applicable products are required",
        "PRODUCTS_REQUIRED",
      );
    }
  }

  Object.keys(updateData).forEach(
    (key) => updateData[key] === undefined && delete updateData[key],
  );

  const coupon = await Coupon.findByIdAndUpdate(
    couponId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!coupon) {
    throw AppError.notFound("Coupon not found", "COUPON_NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    message: "Coupon updated successfully",
    data: coupon,
  });
});

export const toggleCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw AppError.notFound("Coupon not found", "COUPON_NOT_FOUND");
  }

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.isActive ? "activated" : "deactivated"} successfully`,
    data: coupon,
  });
});

// common controllers
export const getCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw AppError.notFound("Coupon not found", "COUPON_NOT_FOUND");
  }

  return res.status(200).json({
    success: true,
    message: "Coupon fetched successfully",
    data: coupon,
  });
});

// user controllers (for applying and removing coupons from cart)
// export const getAllCoupons = asyncHandler(async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     isActive,
//     sortBy = "createdAt",
//     order = "desc",
//     search = "",
//   } = req.query;

//   const query = {
//     isPublic: false,
//   };

//   if (isActive !== undefined) {
//     query.isActive = isActive === "true";
//   }

//   if (search.trim()) {
//     query.$or = [{ code: { $regex: search.trim(), $options: "i" } }];
//   }

//   const pageNumber = Math.max(parseInt(page, 10), 1);
//   const pageLimit = Math.min(parseInt(limit, 10), 100);
//   const skip = (pageNumber - 1) * pageLimit;

//   const sortOrder = order === "asc" ? 1 : -1;
//   const sortOptions = { [sortBy]: sortOrder };

//   const [coupons, filteredCount] = await Promise.all([
//     Coupon.find(query).sort(sortOptions).skip(skip).limit(pageLimit),
//     Coupon.countDocuments(query),
//   ]);

//   const [totalCoupons, activeCoupons, usageStats] = await Promise.all([
//     Coupon.countDocuments({}),
//     Coupon.countDocuments({ isActive: true }),
//     Coupon.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalUsed: { $sum: "$usedCount" },
//           totalLimit: { $sum: "$usageLimit" },
//         },
//       },
//     ]),
//   ]);

//   const totalUsed = usageStats?.[0]?.totalUsed ?? 0;
//   const totalLimit = usageStats?.[0]?.totalLimit ?? 0;

//   const usagePercentage =
//     totalLimit > 0 ? Number(((totalUsed / totalLimit) * 100).toFixed(2)) : 0;

//   return res.status(200).json({
//     success: true,
//     message: "Coupons fetched successfully",
//     data: coupons,
//     stats: {
//       totalCoupons,
//       activeCoupons,
//       usagePercentage,
//     },

//     pagination: {
//       filteredCount,
//       totalPages: Math.ceil(filteredCount / pageLimit),
//       currentPage: pageNumber,
//       pageLimit: pageLimit,
//     },
//   });
// });

export const getAllCoupons = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    isActive,
    sortBy = "createdAt",
    order = "desc",
    search = "",
  } = req.query;

  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId, status: "active" }).lean();

  const cartItems = cart?.items ?? [];

  const cartTotal = cart?.grandTotal ?? 0;
  const cartProductIds = cartItems.map((i) => i.product.toString());
  const cartCategoryIds = cartItems
    .map((i) => i.category?.toString())
    .filter(Boolean);

  const query = { isPublic: false };

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  if (search.trim()) {
    query.$or = [{ code: { $regex: search.trim(), $options: "i" } }];
  }

  const pageNumber = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.min(parseInt(limit, 10), 100);
  const skip = (pageNumber - 1) * pageLimit;

  const sortOrder = order === "asc" ? 1 : -1;
  const sortOptions = { [sortBy]: sortOrder };

  // ─── Fetch coupons + stats in parallel ──────────────────────────
  const [coupons, filteredCount, totalCoupons, activeCoupons, usageStats] =
    await Promise.all([
      Coupon.find(query).sort(sortOptions).skip(skip).limit(pageLimit).lean(),
      Coupon.countDocuments(query),
      Coupon.countDocuments({}),
      Coupon.countDocuments({ isActive: true }),
      Coupon.aggregate([
        {
          $group: {
            _id: null,
            totalUsed: { $sum: "$usedCount" },
            totalLimit: { $sum: "$usageLimit" },
          },
        },
      ]),
    ]);

  // Check eligibility for each coupon
  const enrichedCoupons = coupons.map((coupon) => {
    const reasons = [];

    if (coupon.appliesTo === "product") {
      const applicable = coupon.applicableProducts.map((id) => id.toString());
      const hasMatch = cartProductIds.some((id) => applicable.includes(id));
      if (!hasMatch) reasons.push("Not applicable to your cart products");
    }

    if (coupon.appliesTo === "category") {
      const applicable = coupon.applicableCategories.map((id) => id.toString());
      const hasMatch = cartCategoryIds.some((id) => applicable.includes(id));
      if (!hasMatch) reasons.push("Not applicable to your cart categories");
    }

    if (coupon.minimumCartValue > 0 && cartTotal < coupon.minimumCartValue) {
      const diff = (coupon.minimumCartValue - cartTotal).toFixed(2);
      reasons.push(`Add ₹${diff} more to unlock this coupon`);
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      reasons.push("Coupon usage limit reached");
    }

    if (coupon.perUserLimit > 0) {
      const userUsage = coupon.usedBy?.find(
        (entry) => entry.user.toString() === userId.toString()
      );
      if (userUsage && userUsage.count >= coupon.perUserLimit) {
        reasons.push("You have already used this coupon");
      }
    }

    return {
      ...coupon,
      isEligible: reasons.length === 0,
      ineligibilityReasons: reasons,
    };
  });

  // Sort: eligible first
  enrichedCoupons.sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    return 0;
  });

  const totalUsed = usageStats?.[0]?.totalUsed ?? 0;
  const totalLimit = usageStats?.[0]?.totalLimit ?? 0;
  const usagePercentage =
    totalLimit > 0 ? Number(((totalUsed / totalLimit) * 100).toFixed(2)) : 0;

  return res.status(200).json({
    success: true,
    message: "Coupons fetched successfully",
    data: enrichedCoupons,
    stats: {
      totalCoupons,
      activeCoupons,
      usagePercentage,
    },
    pagination: {
      filteredCount,
      totalPages: Math.ceil(filteredCount / pageLimit),
      currentPage: pageNumber,
      pageLimit: pageLimit,
    },
  });
});
