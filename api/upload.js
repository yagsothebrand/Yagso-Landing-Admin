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
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// Upload endpoint
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  res.json({
    success: true,
    imageUrl: req.file.path, // Cloudinary gives a hosted URL
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
