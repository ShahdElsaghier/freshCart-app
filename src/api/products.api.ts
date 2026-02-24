import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://ecommerce.routemisr.com/api/v1/products"
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}