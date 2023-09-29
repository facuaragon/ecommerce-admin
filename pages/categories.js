import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
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
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        values: property.values.split(","),
      })),
    };
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
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  };
  const editCategory = (category) => {
    // console.log(category.properties);
    // console.log(category);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
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
  const addProperty = () => {
    setProperties([...properties, { name: "", values: "" }]);
  };
  const handlePropertyNameChange = (index, property, newName) => {
    // console.log({ index, property, newName });
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };
  const handlePropertyValuesChange = (index, property, newValues) => {
    // console.log({ index, property, newValues });
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };
  const removeProperty = (i) => {
    setProperties((prev) => {
      const newProperties = [...prev];
      newProperties.splice(i, 1);
      return [...newProperties];
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
        <form onSubmit={saveCategory}>
          <div className="flex gap-1">
            <input
              type="text"
              name="category"
              placeholder="Category Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            ></input>
            <select
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
          </div>
          <div className="mb-2">
            <label className="block">Properties</label>
            <button
              className="btn-default text-sm mb-2"
              type="button"
              onClick={addProperty}
            >
              Add property
            </button>
            {properties.length > 0 &&
              properties.map((property, i) => (
                <div key={i} className="flex gap-1 mb-2">
                  <input
                    className="mb-0"
                    value={property.name}
                    onChange={(e) =>
                      handlePropertyNameChange(i, property, e.target.value)
                    }
                    type="text"
                    placeholder="Property name (example: color)"
                  ></input>
                  <input
                    className="mb-0"
                    value={property.values}
                    onChange={(e) =>
                      handlePropertyValuesChange(i, property, e.target.value)
                    }
                    type="text"
                    placeholder="values, comma separated"
                  ></input>
                  <button
                    className="btn-default"
                    type="button"
                    onClick={() => removeProperty(i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
          </div>
          <div className="flex gap-1">
            {editedCategory && (
              <button
                type="button"
                className="btn-default py-1"
                onClick={() => {
                  setEditedCategory(null);
                  setEditedCategory(null);
                  setName("");
                  setParentCategory("");
                  setProperties([]);
                }}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary py-1">
              Save
            </button>
          </div>
        </form>
        {!editedCategory && (
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
                        onClick={() => {
                          editCategory(category);
                        }}
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
        )}
      </Layout>
    </>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
