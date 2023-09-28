import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    const categories = await Category.find().populate("parent");
    return res.json(categories);
  }
  if (method === "POST") {
    const { name, parentCategory } = req.body;

    let oldCategory;

    if (!parentCategory) {
      oldCategory = await Category.findOne({ name });
    } else {
      oldCategory = await Category.findOne({ name, parent: parentCategory });
    }

    if (!oldCategory) {
      const newCategoryData = { name };
      if (parentCategory) {
        newCategoryData.parent = parentCategory;
      }

      const newCategory = await Category.create(newCategoryData);
      return res.json(newCategory);
    } else {
      return res.json({ message: "Category already exists" });
    }
  }
  if (method === "PUT") {
    try {
      const { name, parentCategory, _id } = req.body;
      let update = { name };

      if (parentCategory !== undefined) {
        // Only set the 'parent' property if 'parentCategory' is defined
        update.parent = parentCategory || null;
      }

      // Use findOneAndUpdate to get the updated document
      const updatedCategory = await Category.findOneAndUpdate({ _id }, update, {
        new: true,
      });

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.json(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  if (method === "DELETE") {
    const { _id } = req.query;
    const category = await Category.deleteOne({ _id });
    return res.status(200).json("ok");
  }
}
