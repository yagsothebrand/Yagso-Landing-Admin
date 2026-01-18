import express from "express";
import cors from "cors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js"; // import config

const app = express();
const port = process.env.PORT || 5000;

// CORS for your frontend
// app.use(cors({ origin: "https://yagso.vercel.app" }));
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://yagso.com",
      "https://www.yagso.com",
    ],
  })
);

// Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yagso", // folder in your Cloudinary account
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4"],
  },
});

const upload = multer({ storage });

// Upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    res.json({
      success: true,
      imageUrl: req.file.path,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error during upload." });
  }
});

app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res
    .status(500)
    .json({ success: false, message: "Something went wrong on the server." });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
