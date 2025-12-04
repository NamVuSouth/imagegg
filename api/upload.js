import Busboy from "busboy";
import path from "path";


export default function (req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.json({ error: "Method not allowed" });
  }

  // busboy limits
  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  const MAX_FILES = 10;

  let fileCount = 0;
  const uploaded = [];
  let errorOccurred = null;

  const bb = Busboy({ headers: req.headers, limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES } });

  bb.on("file", (fieldname, fileStream, fileInfo) => {
    // fileInfo: { filename, encoding, mimeType }
    fileCount++;

    // validate extension and mime early
    const ext = path.extname(fileInfo.filename || "").toLowerCase();
    const mime = (fileInfo.mimeType || "").toLowerCase();

    if (ext !== ".png" && mime !== "image/png") {
      errorOccurred = `Only PNG files allowed. Rejected: ${fileInfo.filename}`;
      // consume stream then end
      fileStream.resume();
      return;
    }

    // accumulate buffer up to limit
    const chunks = [];
    let total = 0;
    fileStream.on("data", (chunk) => {
      total += chunk.length;
      chunks.push(chunk);
    });

    fileStream.on("limit", () => {
      errorOccurred = `${fileInfo.filename} exceeds ${MAX_FILE_SIZE} bytes`;
      // stop reading
      fileStream.resume();
    });

    fileStream.on("end", () => {
      if (!errorOccurred) {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString("base64");
        uploaded.push({
          filename: fileInfo.filename || "unknown.png",
          mime: mime || "image/png",
          data: `data:image/png;base64,${base64}`,
          size: buffer.length,
        });
      }
    });
  });

  bb.on("field", (name, val) => {
    // ignore text fields (if any)
  });

  bb.on("error", (err) => {
    errorOccurred = err.message || "Parse error";
  });

  bb.on("finish", () => {
    if (errorOccurred) {
      res.statusCode = 400;
      return res.json({ error: errorOccurred });
    }

    if (uploaded.length === 0) {
      return res.status(400).json({ error: "No valid PNG files uploaded." });
    }

    // success: return base64 images
    return res.status(200).json({
      message: "Upload success",
      images: uploaded.map((i) => ({ filename: i.filename, url: i.data, size: i.size })),
    });
  });

  // pipe request to busboy
  req.pipe(bb);
}
