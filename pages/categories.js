import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");

  const fetchCategories = () => {
    axios("/api/categories").then((response) => {
      setCategories(response.data);
    });
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const saveCategory = async (e) => {
    e.preventDefault();
    setMessage("");
    const data = { name, parentCategory };
    // console.log(editedCategory);
    if (!editedCategory) {
      const res = await axios.post("/api/categories", data);
      //   console.log(res);
      if (res.data?.message === "Category already exists") {
        setMessage(res.data.message);
      }
    } else {
      data._id = editedCategory._id;
      const res = await axios.put("/api/categories", data);
      //   console.log(res);
    }
    setName("");
    setParentCategory("");
    setEditedCategory(null);
    fetchCategories();
  };
  const editCategory = (category) => {
    // console.log(category);
    setEditedCategory(category);
    setName(category.name);
    category.parent
      ? setParentCategory(category.parent?._id)
      : setParentCategory("");
  };

  const deleteCategory = (category) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonTitle: "Cancel",
        confirmButtonText: "Yes, Delete!",
        reverseButtons: true,
        confirmButtonColor: "#d55",
        didOpen: () => {},
        didClose: () => {},
      })
      .then(async (result) => {
        // console.log(result);
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete(`/api/categories?_id=` + _id);
          fetchCategories();
        }
      });
  };
  return (
    <>
      <Layout>
        <h1>Categories</h1>
        <label>
          {editedCategory
            ? `Edit category ${editedCategory.name}`
            : "Create new category"}
        </label>
        {message && (
          <span className="bg-red-500 px-2 rounded-md text-white text-xs ml-2">
            {message}
          </span>
        )}
        <form className="flex gap-1" onSubmit={saveCategory}>
          <input
            className="mb-0"
            type="text"
            name="category"
            placeholder="Category Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>
          <select
            className="mb-0"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No parent category</option>
            {!!categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
          <button type="submit" className="btn-primary">
            Save
          </button>
        </form>
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {!!categories.length > 0 &&
              categories?.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className="btn-primary mr-1"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    </>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
