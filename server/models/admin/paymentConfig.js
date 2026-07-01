import mongoose from "mongoose";

const paymentConfigSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["razorpay", "stripe", "cashfree"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    credentials: {
      keyId: String,
      keySecret: String,
    },

    webhookSecret: String,

    extraConfig: {
      type: Object,
    },
  },
  { timestamps: true, versionKey: false },
);

paymentConfigSchema.index({ isActive: 1 });

const PaymentConfig = mongoose.model("PaymentConfig", paymentConfigSchema);
export default PaymentConfig;
