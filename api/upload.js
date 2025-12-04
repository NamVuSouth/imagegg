import multer from "multer";
import path from "path";
import nextConnect from "next-connect";

export const config = {
  api: {
    bodyParser: false, // bắt buộc tắt bodyParser để Multer nhận multipart
  },
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".png") {
      return cb(new Error("Only PNG files are allowed"), false);
    }
    cb(null, true);
  },
}).array("images", 10);

const handler = nextConnect({
  onError(error, req, res) {
    res.status(400).json({ error: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: "Method not allowed" });
  },
});

handler.use(upload);

handler.post((req, res) => {
  const images = req.files.map((file) => {
    const base64 = file.buffer.toString("base64");
    return `data:image/png;base64,${base64}`;
  });

  res.status(200).json({
    message: "Upload success",
    images,
  });
});

export default handler;
