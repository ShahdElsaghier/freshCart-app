"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function OrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${user.id}`
      );

      const data = await res.json();
      setOrders(data || []);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 && <p>No Orders Yet</p>}

      {orders.map((order: any) => (
        <div key={order._id} className="border p-4 mb-4">
          <p>Total: {order.totalOrderPrice} EGP</p>
          <p>Paid: {order.isPaid ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
}