import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    const categories = await Category.find().populate("parent");
    return res.json(categories);
  }
  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;

    const oldCategory = await Category.findOne({
      name,
      parentCategory,
      properties,
    });

    if (!oldCategory) {
      const newCategory = await Category.create({
        name,
        parent: parentCategory || undefined,
        properties,
      });
      return res.json(newCategory);
    } else {
      return res.json({ message: "Category already exists" });
    }
  }
  if (method === "PUT") {
    const { name, parentCategory, properties, _id } = req.body;

    // Create an update object to set or unset the parent field as needed
    const updateObject = {
      name,
      properties,
    };

    if (parentCategory) {
      // Ensure that parentCategory is a valid ObjectId before setting it
      if (mongoose.Types.ObjectId.isValid(parentCategory)) {
        updateObject.parent = parentCategory;
      } else {
        // Handle the case where parentCategory is not a valid ObjectId
        return res.status(400).json({ error: "Invalid parentCategory value" });
      }
    } else {
      // Use $unset to remove the parent field if it's undefined
      updateObject.$unset = { parent: 1 };
    }

    const categoryUpdate = await Category.updateOne({ _id }, updateObject);

    res.json(categoryUpdate);
  }
  if (method === "DELETE") {
    const { _id } = req.query;
    const category = await Category.deleteOne({ _id });
    return res.status(200).json("ok");
  }
}
