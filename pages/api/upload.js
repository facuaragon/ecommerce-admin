import { v2 as cloudinary } from "cloudinary";

export default async function handler(req, res) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const files = req.body;
  const uploadResults = [];
  const cloudinaryLinks = [];

  for (const file of files) {
    try {
      const cloudinaryResult = await cloudinary.uploader.upload(file, {
        folder: "Ecommerce",
      });
      if (!cloudinaryResult) {
        throw new Error("Error en la carga del archivo a Cloudinary");
      }
      cloudinaryLinks.push(cloudinaryResult.secure_url);
      uploadResults.push(cloudinaryResult);
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ error: "Error en la carga del archivo a Cloudinary" });
      return;
    }
  }
  res.json(cloudinaryLinks);
}
