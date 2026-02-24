"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function OrdersPage() {
  const { token, userId } = useAuth(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
          {
            headers: {
              token: token // Add token for authentication
            }
          }
        );

        const data = await res.json();
        setOrders(data.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No Orders Yet</p>
      ) : (
        orders.map((order: any) => (
          <div key={order._id} className="border p-4 mb-4 rounded-lg shadow-sm">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p>Total: {order.totalOrderPrice} EGP</p>
            <p>Paid: {order.isPaid ? "Yes ✅" : "No ❌"}</p>
            {order.createdAt && (
              <p className="text-sm text-gray-500">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}