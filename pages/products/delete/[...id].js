import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

export default function DeleteProduct() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState(null);
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get("/api/products?id=" + id).then((response) => {
        setProductInfo(response.data);
        // console.log(response.data);
      });
    }
  }, []);
  const goBack = () => {
    router.push("/products");
  };
  const deleteProduct = async () => {
    await axios.delete("/api/products?id=" + id);
    goBack();
  };
  return (
    <>
      <Layout>
        {productInfo && (
          <>
            <h1 className="text-center">
              Do you really want to delete &quot;{productInfo.title}&quot;?
            </h1>
            <div className="flex gap-2 justify-center">
              <button className="btn-red" onClick={deleteProduct}>
                YES
              </button>
              <button className="btn-default" onClick={goBack}>
                NO
              </button>
            </div>
          </>
        )}
      </Layout>
    </>
  );
}
