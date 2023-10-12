import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);
  return (
    <>
      <Layout>
        <h1>Orders</h1>
        <table className="basic">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Paid</th>
              <th>Recipient</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {new Date(order.createdAt).toLocaleString().split(",")[0]}
                  </td>
                  <td>
                    {new Date(order.createdAt)
                      .toLocaleString()
                      .split(",")[1]
                      .trim()}
                  </td>
                  <td
                    className={order.paid ? "text-green-600" : "text-red-600"}
                  >
                    {order.paid ? "YES" : "NO"}
                  </td>
                  <td>
                    {order.name} {order.email}
                    <br />
                    {order.city} {order.postalCode} {order.country} <br />
                    {order.streetAddress}
                  </td>
                  <td>
                    {order.line_items.map((l) => (
                      <>
                        {l.title} x {l.quantity}
                        <br />
                      </>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    </>
  );
}
