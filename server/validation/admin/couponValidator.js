import { body, param, query } from "express-validator";

export const createCouponValidation = [
  body("code")
    .notEmpty()
    .withMessage("Coupon code is required")
    .isString()
    .withMessage("Coupon code must be a string")
    .isLength({ min: 4 })
    .withMessage("Coupon code must be at least 4 characters long")
    .isLength({ max: 20 })
    .withMessage("Coupon code must be at most 20 characters long")
    .trim(),

  body("discountPercentage")
    .notEmpty()
    .withMessage("Discount percentage is required")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount percentage must be between 0 and 100"),

  body("maxDiscountAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max discount amount must be a positive number"),

  body("minimumCartValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum cart value must be a positive number"),

  body("usageLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Usage limit must be a positive integer"),

  body("perUserLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Per user limit must be a positive integer"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("appliesTo")
    .optional()
    .isIn(["all", "category", "product"])
    .withMessage("appliesTo must be either 'all', 'category', or 'product'"),

  body("applicableCategories")
    .optional()
    .isArray()
    .withMessage("Applicable categories must be an array")
    .custom((arr) => arr.every((id) => typeof id === "string"))
    .withMessage("Applicable categories must be an array of strings"),

  body("applicableProducts")
    .optional()
    .isArray()
    .withMessage("Applicable products must be an array")
    .custom((arr) => arr.every((id) => typeof id === "string"))
    .withMessage("Applicable products must be an array of strings"),
];

export const updateCouponValidation = [
  param("couponId")
    .notEmpty()
    .withMessage("Coupon ID is required")
    .isString()
    .withMessage("Coupon ID must be a string")
    .trim(),

  body("code")
    .optional()
    .isString()
    .withMessage("Coupon code must be a string")
    .isLength({ min: 4 })
    .withMessage("Coupon code must be at least 4 characters long")
    .isLength({ max: 20 })
    .withMessage("Coupon code must be at most 20 characters long")
    .trim(),

  body("discountPercentage")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount percentage must be between 0 and 100"),

  body("maxDiscountAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Max discount amount must be a positive number"),

  body("minimumCartValue")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum cart value must be a positive number"),

  body("usageLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Usage limit must be a positive integer"),

  body("perUserLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Per user limit must be a positive integer"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("appliesTo")
    .optional()
    .isIn(["all", "category", "product"])
    .withMessage("appliesTo must be either 'all', 'category', or 'product'"),

  body("applicableCategories")
    .optional()
    .isArray()
    .withMessage("Applicable categories must be an array")
    .custom((arr) => arr.every((id) => typeof id === "string"))
    .withMessage("Applicable categories must be an array of strings"),

  body("applicableProducts")
    .optional()
    .isArray()
    .withMessage("Applicable products must be an array")
    .custom((arr) => arr.every((id) => typeof id === "string"))
    .withMessage("Applicable products must be an array of strings"),
];

export const getCouponsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "discountPercentage", "code"])
    .withMessage(
      "sortBy must be either 'createdAt', 'discountPercentage', or 'code'",
    ),

  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("order must be either 'asc' or 'desc'"),

  query("search")
    .optional()
    .isString()
    .withMessage("Search query must be a string"),
];

export const couponIdValidation = [
  param("couponId")
    .notEmpty()
    .withMessage("Coupon ID is required")
    .isString()
    .withMessage("Coupon ID must be a string")
    .trim(),
];
