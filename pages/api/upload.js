// import { v2 as cloudinary } from "cloudinary";
// // Configure Cloudinary with your credentials
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const pipeline = promisify(require("stream").pipeline);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const uploadDir = path.join(process.cwd(), "uploads"); // Set your upload destination here.
    const fileName = "your-file-name.ext"; // Set the desired file name.

    const fileStream = Readable.from(req);
    const writeStream = fs.createWriteStream(path.join(uploadDir, fileName));

    fileStream.pipe(writeStream);

    writeStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Error uploading the file" });
    });

    writeStream.on("finish", () => {
      res.json({ message: "Image uploaded" });
    });
  } else {
    res.status(405).end(); // Method not allowed
  }
}
