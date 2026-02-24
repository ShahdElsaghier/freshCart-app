import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

export async function POST(req: NextRequest) {
  const token = req.headers.get("token");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await fetch(
      `${BASE_URL}/orders/checkout-session/${body.cartId}?url=http://localhost:3000`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          shippingAddress: body.shippingAddress,
        }),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Checkout failed" }, { status: 500 });
  }
}