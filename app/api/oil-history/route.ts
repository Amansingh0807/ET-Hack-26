import { NextResponse } from "next/server";
import { getMultiMarketPrices, getHistoricalData, getRouteAnalytics } from "@/lib/oilPrice";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      multiMarket,
      brentToday,
      brent5d,
      brent50d,
      wtiToday,
      wti5d,
      wti50d
    ] = await Promise.all([
      getMultiMarketPrices(),
      getHistoricalData("BZ=F", "today"),
      getHistoricalData("BZ=F", "5d"),
      getHistoricalData("BZ=F", "50d"),
      getHistoricalData("CL=F", "today"),
      getHistoricalData("CL=F", "5d"),
      getHistoricalData("CL=F", "50d"),
    ]);

    // Route analytics based on current Brent price
    const routeAnalytics = getRouteAnalytics(multiMarket.brent.price);

    return NextResponse.json({
      multiMarket,
      history: {
        brent: {
          today: brentToday,
          "5d": brent5d,
          "50d": brent50d
        },
        wti: {
          today: wtiToday,
          "5d": wti5d,
          "50d": wti50d
        }
      },
      routeAnalytics,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Oil history API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch oil price data" },
      { status: 500 }
    );
  }
}
