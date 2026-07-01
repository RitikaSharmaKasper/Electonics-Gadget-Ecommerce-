import Serviceability from "../../models/admin/serviceabilityConfig.js";
import Warehouse from "../../models/admin/WarehouseConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";
import XLSX from "xlsx";

export const createServiceability = asyncHandler(async (req, res) => {
  let { type, value, isServiceable } = req.body;

  value = String(value).trim();

  // validation
  if (type === "prefix" && !/^\d{2,4}$/.test(value)) {
    throw AppError.badRequest("Invalid prefix (2–4 digits)", "INVALID_PREFIX");
  }

  if (type === "exact" && !/^\d{6}$/.test(value)) {
    throw AppError.badRequest("Invalid pincode (6 digits)", "INVALID_PINCODE");
  }

  const warehouse = await Warehouse.findOne({ isActive: true });
  const warehouseId = warehouse?._id || null;

  // FIXED duplicate check
  const existingConfig = await Serviceability.findOne({
    value,
    type,
    warehouse: warehouseId,
    isActive: true,
  });

  if (existingConfig) {
    throw AppError.conflict(
      "Serviceability code already exists",
      "SERVICEABILITY_EXISTS",
    );
  }

  const config = await Serviceability.create({
    type,
    value,
    isServiceable,
    warehouse: warehouseId,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Serviceability rule created successfully",
    data: config,
  });
});

// export const checkServiceability = asyncHandler(async (req, res) => {
//   let { pincode } = req.body;

//   if (!/^\d{6}$/.test(pincode)) {
//     throw AppError.badRequest("Invalid pincode", "INVALID_PINCODE");
//   }

//   pincode = String(pincode);

//   // build prefixes (longest first)
//   const prefixes = [
//     pincode.slice(0, 4),
//     pincode.slice(0, 3),
//     pincode.slice(0, 2),
//   ];

//   // SINGLE QUERY (FASTEST)
//   const configs = await Serviceability.find({
//     $or: [
//       { type: "exact", value: pincode },
//       { type: "prefix", value: { $in: prefixes } },
//     ],
//   })
//     .sort({ type: -1, value: -1 }) // exact first, then longest prefix
//     .lean();

//   if (!configs.length) {
//     return res.status(200).json({
//       success: true,
//       data: {
//         isServiceable: false,
//         reason: "No service available for this pincode",
//       },
//     });
//   }

//   // 🔥 priority: exact > longest prefix
//   const bestMatch = configs[0];

//   res.status(200).json({
//     success: true,
//     message: "We are serving to this pincode",
//     data: {
//       isServiceable: bestMatch.isServiceable,
//       matchedOn: bestMatch.type,
//       value: bestMatch.value,
//     },
//   });
// });

export const bulkCreateServiceability = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw AppError.badRequest("Excel file required");
  }

  const workbook = XLSX.read(file.buffer, {
    type: "buffer",
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json(sheet);

  const warehouse = await Warehouse.findOne({
    isActive: true,
  });

  const warehouseId = warehouse?._id || null;

  const insertData = [];
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    let { type, value, isServiceable = true } = rows[i];

    type = String(type).toLowerCase();

    value = String(value).trim();

    if (type === "prefix" && !/^\d{2,4}$/.test(value)) {
      errors.push(`Row ${i + 2}: Invalid Prefix`);

      continue;
    }

    if (type === "exact" && !/^\d{6}$/.test(value)) {
      errors.push(`Row ${i + 2}: Invalid Pincode`);

      continue;
    }

    const exists = await Serviceability.findOne({
      type,
      value,
      warehouse: warehouseId,
      isActive: true,
    });

    if (exists) {
      errors.push(`Row ${i + 2}: Already exists`);

      continue;
    }

    insertData.push({
      type,
      value,
      isServiceable,
      warehouse: warehouseId,
      isActive: true,
    });
  }

  if (insertData.length) {
    await Serviceability.insertMany(insertData, {
      ordered: false,
    });
  }

  res.status(201).json({
    success: true,

    message: "Import completed",

    inserted: insertData.length,

    failed: errors.length,

    errors,
  });
});


export const checkServiceability = asyncHandler(async (req, res) => {
  let { pincode } = req.body;

  if (!/^\d{6}$/.test(pincode)) {
    throw AppError.badRequest("Invalid pincode", "INVALID_PINCODE");
  }

  pincode = String(pincode);

  const prefixes = [
    pincode.slice(0, 4),
    pincode.slice(0, 3),
    pincode.slice(0, 2),
  ];

  // FETCH BOTH ACTIVE + INACTIVE
  const configs = await Serviceability.find({
    $or: [
      { type: "exact", value: pincode },
      { type: "prefix", value: { $in: prefixes } },
    ],
  }).lean();

  if (!configs.length) {
    return res.status(200).json({
      success: true,
      data: {
        isServiceable: false,
        reason: "No service available for this pincode",
      },
    });
  }

  // 1. EXACT MATCH HAS HIGHEST PRIORITY
  const exactMatch = configs.find(
    (c) => c.type === "exact" && c.value === pincode,
  );

  if (exactMatch) {
    return res.status(200).json({
      success: true,
      message: exactMatch.isServiceable
        ? "We are serving to this pincode"
        : "Delivery not available for this pincode",
      data: {
        isServiceable: exactMatch.isServiceable,
        matchedOn: "exact",
        value: exactMatch.value,
      },
    });
  }

  // 2. PREFIX MATCHES
  const prefixMatches = configs
    .filter((c) => c.type === "prefix")
    .sort((a, b) => b.value.length - a.value.length);

  if (prefixMatches.length > 0) {
    const bestPrefix = prefixMatches[0];

    return res.status(200).json({
      success: true,
      message: bestPrefix.isServiceable
        ? "We are serving to this pincode"
        : "Delivery not available for this pincode",
      data: {
        isServiceable: bestPrefix.isServiceable,
        matchedOn: "prefix",
        value: bestPrefix.value,
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      isServiceable: false,
      reason: "No service available for this pincode",
    },
  });
});

export const getAllServiceability = asyncHandler(async (req, res) => {
  const { type, isActive, page = 1, limit = 20, search = "" } = req.query;

  const skip = (page - 1) * limit;

  const filter = {};

  if (type) filter.type = type;
  if (isActive !== undefined) filter.isActive = isActive === "true";

  if (search) {
    filter.value = { $regex: search, $options: "i" };
  }

  const [data, total] = await Promise.all([
    Serviceability.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),

    Serviceability.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Serviceability configs fetched successfully",
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const updateServiceability = asyncHandler(async (req, res) => {
  const { serviceabilityId } = req.params;
  let { value, isServiceable } = req.body;

  const existing = await Serviceability.findById(serviceabilityId);

  if (!existing) {
    throw AppError.notFound("Config not found", "NOT_FOUND");
  }

  if (value) {
    value = String(value).trim();

    if (existing.type === "prefix" && !/^\d{2,4}$/.test(value)) {
      throw AppError.badRequest("Invalid prefix", "INVALID_PREFIX");
    }

    if (existing.type === "exact" && !/^\d{6}$/.test(value)) {
      throw AppError.badRequest("Invalid pincode", "INVALID_PINCODE");
    }

    existing.value = value;
  }

  if (isServiceable !== undefined) {
    existing.isServiceable = isServiceable;
  }

  await existing.save();

  res.status(200).json({
    success: true,
    message: "Serviceability config updated successfully",
    data: existing,
  });
});

export const toggleServiceability = asyncHandler(async (req, res) => {
  const { serviceabilityId } = req.params;

  const config = await Serviceability.findById(serviceabilityId);

  if (!config) {
    throw AppError.notFound("Config not found", "NOT_FOUND");
  }

  const nextState = !config.isActive;

  config.isActive = nextState;
  config.isServiceable = nextState;

  await config.save();

  res.status(200).json({
    success: true,
    message: `Serviceability config ${
      nextState ? "activated" : "deactivated"
    } successfully`,
    data: config,
  });
});

export const deleteServiceability = asyncHandler(async (req, res) => {
  const { serviceabilityId } = req.params;

  const config = await Serviceability.findById(serviceabilityId);
  if (!config) {
    throw AppError.notFound("Config not found", "NOT_FOUND");
  }

  // delete
  await config.deleteOne();

  res.status(200).json({
    success: true,
    message: "Serviceability config deleted successfully",
  });
});
