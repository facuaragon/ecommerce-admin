import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProduct() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState(null);
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, []);
  return (
    <>
      <Layout>
        <h1>Edit Product</h1>
        {productInfo && <ProductForm {...productInfo} />}
      </Layout>
    </>
  );
}
