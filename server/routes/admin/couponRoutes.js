import { Router } from "express";
import {
  createCoupon,
  getAllCoupons,
  getCoupon,
  getCouponsAdmin,
  toggleCoupon,
  updateCoupon,
} from "../../controllers/admin/couponController.js";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import {
  couponIdValidation,
  createCouponValidation,
  getCouponsValidation,
  updateCouponValidation,
} from "../../validation/admin/couponValidator.js";
import { validateRequest } from "../../validation/validator.js";

const router = Router();

// Admin routes
router.post(
  "/create-coupon",
  authenticate,
  authorize("admin"),
  createCouponValidation,
  validateRequest,
  createCoupon,
);

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  getCouponsValidation,
  validateRequest,
  getCouponsAdmin,
);

router.put(
  "/update-coupon/:couponId",
  authenticate,
  authorize("admin"),
  updateCouponValidation,
  validateRequest,
  updateCoupon,
);

router.patch(
  "/toggle-coupon/:couponId",
  authenticate,
  authorize("admin"),
  couponIdValidation,
  validateRequest,
  toggleCoupon,
);

// common routes
router.get(
  "/:couponId",
  authenticate,
  couponIdValidation,
  validateRequest,
  getCoupon,
);

// user routes
router.get(
  "/",
  authenticate,
  getCouponsValidation,
  validateRequest,
  getAllCoupons,
);

export default router;
