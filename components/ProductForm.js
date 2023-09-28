import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);

  useEffect(() => {
    console.log("message: ", message);
  }, [message]);
  //   console.log(_id);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description, price, images };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };
  if (goToProducts) {
    router.push("/products");
  }

  const uploadCloudinaryImages = async (e) => {
    const files = e.target?.files;
    const MAX_TOTAL_SIZE = 1024 * 1024; // 1MB in bytes
    let totalSize = 0;

    if (files?.length > 0) {
      setLoading(true);

      // Calculate the total size of selected files
      Array.from(files).forEach((file) => {
        totalSize += file.size;
      });

      if (totalSize > MAX_TOTAL_SIZE) {
        setMessage("Selected files exceed 1MB, please try again");
        setLoading(false);
        return; // No need to proceed further
      } else {
        setMessage("");
      }

      const promises = Array.from(files).map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve(reader.result);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(file);
        });
      });

      Promise.all(promises)
        .then(async (results) => {
          try {
            const res = await axios.post("/api/upload", results);
            // console.log(res.data);
            setLoading(false);
            setImages([...images, ...res.data]);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  };

  const deleteImage = async (e) => {
    // console.log(e.target.id);
    const array = [...images];
    const positionToRemove = Number(e.target.id);
    array.splice(positionToRemove, 1);
    setImages([...array]);
  };

  const updateImagesOrder = (images) => {
    // console.log(images);
    setImages(images);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          placeholder="product name"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <label>
          Photos:{" "}
          {message && (
            <span className="bg-red-500 px-2 rounded-md text-white text-xs">
              {message}
            </span>
          )}
        </label>
        <div className="mb-2 flex gap-3 flex-wrap">
          <label className="cursor-pointer w-24 h-24 flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
            {loading ? (
              <Spinner />
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <div>Add</div>

                <input
                  type="file"
                  name="file"
                  multiple
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={uploadCloudinaryImages}
                ></input>
              </>
            )}
          </label>

          <ReactSortable
            className="flex flex-wrap gap-2"
            list={images}
            setList={updateImagesOrder}
          >
            {images &&
              images.map((image, i) => (
                <div
                  key={i}
                  className="relative border rounded-md overflow-hidden"
                >
                  <img
                    src={image}
                    width={100}
                    style={{ maxHeight: "100px", width: "auto" }}
                    alt="Image"
                  />
                  <button
                    name={i}
                    type="button"
                    onClick={deleteImage}
                    className="absolute top-1 right-1 bg-gray-200 text-gray-500 rounded-xl"
                  >
                    <div
                      id={i}
                      className="absolute w-full h-full z-1 bg-transparent"
                    ></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 z-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              ))}
          </ReactSortable>
        </div>
        <label>Product Description</label>
        <textarea
          placeholder="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Product Price</label>

        <input
          type="number"
          placeholder="price"
          name="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></input>
        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </>
  );
}
