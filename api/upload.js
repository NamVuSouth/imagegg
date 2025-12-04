import multer from "multer";
import path from "path";
import nextConnect from "next-connect";

export const config = {
  api: {
    bodyParser: false, // CỰC QUAN TRỌNG CHO MULTER TRÊN VERCEL
  },
};
// cấu hình lưu bộ nhớ tạm (Vercel không có filesystem permanent)
const storage = multer.memoryStorage();

// quy định kiểm tra file
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext !== ".png") {
    return cb(new Error("Only PNG files are allowed"), false);
  }

  if (file.size > 1 * 1024 * 1024) {
    return cb(new Error("Image must be < 1MB"), false);
  }

  cb(null, true);
}

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter,
}).array("images", 10); // cho phép upload nhiều file

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // File nằm trong req.files dạng buffer
    const uploadedImages = req.files.map((file) => {
      const base64 = file.buffer.toString("base64");
      return `data:image/png;base64,${base64}`;
    });

    return res.status(200).json({
      message: "Upload success",
      images: uploadedImages,
    });
  });
}
