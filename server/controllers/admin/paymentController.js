import PaymentConfig from "../../models/admin/paymentConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
// import { encrypt, decrypt } from "../../utils/paymentConfig.js";
// import { loadPaymentGateway } from "../../service/paymentManager.js";

// export const upsertPaymentGateway = asyncHandler(async (req, res) => {
//   const {
//     provider = "razorpay",
//     keyId,
//     keySecret,
//     webhookSecret,
//     extraConfig = {},
//   } = req.body;

//   // VALIDATION
//   if (!provider) {
//     throw AppError.badRequest("Provider is required", "PROVIDER_REQUIRED");
//   }

//   if (!["razorpay", "stripe", "cashfree"].includes(provider)) {
//     throw AppError.badRequest("Invalid provider", "INVALID_PROVIDER");
//   }

//   if (!keyId || !keySecret) {
//     throw AppError.badRequest(
//       "KeyId and KeySecret are required",
//       "CREDENTIALS_REQUIRED",
//     );
//   }

//   // ENCRYPT
//   const encryptedCredentials = {
//     keyId: encrypt(keyId),
//     keySecret: encrypt(keySecret),
//   };

//   const encryptedWebhookSecret = webhookSecret ? encrypt(webhookSecret) : null;

//   // UPSERT SINGLE CONFIG (no provider filter)
//   const config = await PaymentConfig.findOneAndUpdate(
//     {}, // 👈 IMPORTANT: no filter = single doc system
//     {
//       $set: {
//         provider,
//         isActive: true, // always active since only one
//         credentials: encryptedCredentials,
//         webhookSecret: encryptedWebhookSecret,
//         extraConfig,
//       },
//     },
//     {
//       new: true,
//       upsert: true,
//       setDefaultsOnInsert: true,
//     },
//   );

//   await loadPaymentGateway(true);

//   res.status(200).json({
//     success: true,
//     message: "Payment gateway saved successfully",
//     data: {
//       _id: config._id,
//       provider: config.provider,
//       isActive: config.isActive,
//       createdAt: config.createdAt,
//       updatedAt: config.updatedAt,
//     },
//   });
// });

// export const getPaymentGateway = asyncHandler(async (req, res) => {
//   const config = await PaymentConfig.findOne({ isActive: true }).lean();

//   if (!config) {
//     throw AppError.notFound("Payment gateway not found", "NOT_FOUND");
//   }

//   const decryptedCredentials = {
//     keyId: decrypt(config.credentials?.keyId),
//     keySecret: decrypt(config.credentials?.keySecret),
//   };

//   const webhookSecret = config.webhookSecret
//     ? decrypt(config.webhookSecret)
//     : null;

//   res.status(200).json({
//     success: true,
//     data: {
//       provider: config.provider,
//       credentials: decryptedCredentials,
//       webhookSecret,
//       extraConfig: config.extraConfig || {},
//     },
//   });
// });
