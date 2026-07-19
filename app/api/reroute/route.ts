import { NextResponse } from "next/server";
import { rerouteTanker, getTankers } from "@/lib/db";
import { eventEmitter } from "@/lib/eventBus";

export async function POST(req: Request) {
  try {
    const { tankerId, newRouteId } = await req.json();

    if (!tankerId || !newRouteId) {
      return NextResponse.json({ error: "tankerId and newRouteId are required" }, { status: 400 });
    }

    // Update tanker route in Prisma DB
    await rerouteTanker(tankerId, newRouteId);

    const updatedTankers = await getTankers();

    // Check if any other tankers are still at risk
    const remainingAtRisk = updatedTankers.some(t => t.status === "AT_RISK");

    const payload = {
      tankerId,
      newRouteId,
      tankers: updatedTankers,
      resolved: !remainingAtRisk
    };

    // Broadcast update via SSE
    eventEmitter.emit("broadcast", "tanker_rerouted", payload);

    return NextResponse.json({ success: true, ...payload });
  } catch (error: any) {
    console.error("Error in reroute API route:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
