import multer from "multer";

const storage = multer.memoryStorage();

const FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "application/pdf",

  // ADD THESE
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-excel", // xls
  "text/csv",
];

const fileFilter = (req, file, cb) => {
  if (FILE_TYPES.includes(file.mimetype)) {
    if (file.mimetype.startsWith("image/")) req.fileType = "image";
    else if (file.mimetype.startsWith("video/")) req.fileType = "video";
    else if (file.mimetype === "application/pdf") req.fileType = "raw";
    else if (file.mimetype.includes("sheet") || file.mimetype === "text/csv")
      req.fileType = "excel";

    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP images, MP4/WEBM videos, and PDF,xlsx, xls and csv files allowed",
      ),
      false,
    );
  }
};
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});
