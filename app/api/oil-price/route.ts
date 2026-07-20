import { NextResponse } from "next/server";
import { getLiveBrentCrudePrice } from "@/lib/oilPrice";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getLiveBrentCrudePrice();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch oil price" },
      { status: 500 }
    );
  }
}
