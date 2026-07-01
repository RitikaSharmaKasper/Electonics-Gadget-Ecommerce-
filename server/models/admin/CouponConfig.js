import mongoose from "mongoose";

const couponConfigSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    maxDiscountAmount: {
      type: Number,
      min: 0,
      default: 0,
    },

    minimumCartValue: {
      type: Number,
      default: 0,
    },

    appliesTo: {
      type: String,
      enum: ["all", "category", "product"],
      default: "all",
    },

    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    usageLimit: {
      type: Number,
      default: 0, // leave empty for unlimited use
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    perUserLimit: {
      type: Number,
      default: 1, // leave empty for unlimited use
    },

    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        count: {
          type: Number,
          default: 1,
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

couponConfigSchema.index({ code: 1, isActive: 1 });

couponConfigSchema.pre("save", function () {
  this.code = this.code.toUpperCase().trim();
});

const Coupon = mongoose.model("Coupon", couponConfigSchema);
export default Coupon;
