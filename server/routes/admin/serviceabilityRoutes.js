import { Router } from "express";
import {
  checkServiceability,
  createServiceability,
  deleteServiceability,
  getAllServiceability,
  toggleServiceability,
  updateServiceability,
  bulkCreateServiceability,
} from "../../controllers/admin/serviceabilityController.js";
import { authenticate, authorize } from "../../middlewares/authMiddleware.js";
import { upload } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/create-serviceability",
  authenticate,
  authorize("admin"),
  createServiceability,
);

// admin add bulk import
router.post(
  "/bulk-create-serviceability",
  authenticate,
  authorize("admin"),
  upload.single("file"),
  bulkCreateServiceability,
);

router.post("/check", checkServiceability);

router.get("/", authenticate, authorize("admin"), getAllServiceability);

router.patch(
  "/:serviceabilityId",
  authenticate,
  authorize("admin"),
  updateServiceability,
);

router.patch(
  "/toggle/:serviceabilityId",
  authenticate,
  authorize("admin"),
  toggleServiceability,
);

// delete
router.delete(
  "/delete/:serviceabilityId",
  authenticate,
  authorize("admin"),
  deleteServiceability,
);

export default router;
