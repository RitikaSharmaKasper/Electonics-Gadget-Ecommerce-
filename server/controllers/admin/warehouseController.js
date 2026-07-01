import Warehouse from "../../models/admin/WarehouseConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const upsertWarehouse = asyncHandler(async (req, res) => {
  let { name, phone, email, address } = req.body;

  if (address && typeof address === "string") {
    address = JSON.parse(address);
  }

  // Better duplicate check
  const warehouse = await Warehouse.findOne();

  if (!warehouse) {
    const newWarehouse = await Warehouse.create({
      name,
      phone,
      email,
      address,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Warehouse created successfully",
      warehouse: newWarehouse,
    });
  }

  // Update existing
  warehouse.name = name;
  warehouse.phone = phone;
  warehouse.email = email;
  warehouse.address = address;
  warehouse.isActive = true;

  await warehouse.save();

  res.status(200).json({
    success: true,
    message: "Warehouse updated successfully",
    warehouse,
  });
});

export const getWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findOne({
    isActive: true,
  }).lean();

  if (!warehouse) {
    throw AppError.notFound("Warehouse not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Warehouse fetched successfully",
    warehouse,
  });
});
